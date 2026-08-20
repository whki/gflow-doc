# AI Agent (AI Approval)

<div class="lead">
One of the four homegrown components of the Commercial Edition. The aiAgent node brings LLMs into the approval flow: auto-approve low risk, route high risk to humans, and annotate disputed submissions with reasons. Models, agents, and skills are configured visually end to end.
</div>

## Typical Usage

### 1. Risk Pre-screening

Expense/procurement claims pass through the AI node first, where the model assesses risk from form fields and historical data:

```
Input: msg.amount, msg.reason, msg.vendor …
Output: { "risk": "low|mid|high", "reason": "…" }
```

When the AI explicitly rejects (REJECT), the process terminates or is sent back per the reject strategy; multi-level routing such as `low/mid/high` is implemented by a downstream conditional branch reading a mapped field (e.g. `msg.aiRisk`).

### 2. Smart Form-Filling Assistance (Planned)

At initiation, the AI suggests form values from a one-sentence description and checks consistency between the amount and the purpose (e.g. "entertainment expense of 50,000" triggers a large-amount alert).

### 3. Approval Comment Summary (Planned)

After countersign or multi-level approvals, the AI aggregates the comments from each node into a summary so the final approver can quickly grasp the points of contention.

## Node Configuration

The `aiAgent` node invokes an AI agent rule chain (built on [rulego-components-ai](https://github.com/rulego/rulego-components-ai)). The node itself holds no LLM or prompt configuration — the model, systemPrompt, and tools are maintained in the **AI agent definition**; the node only selects the agent, assembles the context, and routes on the verdict output:

```json
{
  "id": "node_ai_review",
  "type": "aiAgent",
  "name": "AI pre-screen",
  "configuration": {
    "agentId": "ai_expense_reviewer",
    "async": false,
    "timeoutSec": 120,
    "inputAssembly": {
      "customPrompt": "Focus on checking whether the amount ${msg.amount} exceeds the entertainment expense limit",
      "contextSources": { "formData": true, "prevComments": true, "processInfo": true }
    },
    "decision": { "rejectStrategy": "terminate", "unresolved": "human" },
    "failureHandler": ["u_finance_admin"],
    "outputMappings": [{ "from": "risk", "to": "aiRisk" }, { "from": "reason", "to": "aiReason" }],
    "flattenOutput": false
  }
}
```

### Verdict Routing (decision)

Configuring `decision` enables it: the node automatically appends a **verdict protocol** to the end of the user message sent to the agent, requiring the agent to output `AI_DECISION: PASS` or `AI_DECISION: REJECT` alone on the last line of its output; the engine extracts the marker with a regex and routes on it — **it does not depend on the agent's output being valid JSON**, so code fences or explanatory text cause no problems:

- `REJECT` → reject strategy: `terminate` (default, terminates the instance) or `backToInitiator` (sends it back to the initiator)
- `PASS` → approved; the process continues to the next node
- Marker missing/unrecognizable → **unresolved strategy** (`unresolved`):
  - `human` (default): creates an approval todo for the `failureHandler` list; approve → continue to the next node, reject → apply the reject strategy. If no fallback person is configured, the process passes through and the record is tagged "AI unresolved"
  - `pass`: pass through and tag
  - `reject`: handled per the reject strategy

Whatever the outcome, `aiDecision` (PASS/REJECT/UNRESOLVED/HUMAN_PASS/HUMAN_REJECT) is written into metadata and visible in the approval details — **nothing ever passes through silently**.

### Human Fallback Closed Loop

Call failures (timeout/API errors) and unresolved cases routed to humans share the same `failureHandler` list. Once the fallback person completes the todo, the engine reads the human verdict directly when re-entering the node (approve → next node, reject → reject strategy) and **does not call the AI again**.

### Output Merging

Three fixed rules, no ambiguity:

1. The complete output is **always** written to `msg._ai` (object or raw text) — the original record for auditing is always there
2. With `flattenOutput: true` (the **default**), top-level fields of the output JSON are flattened into `msg.Data` (**overwriting same-named form fields**; use a mapping rename to avoid collisions); with `false`, the output is isolated and the complete response stays only in `msg._ai`. This matches the `httpCall` node in both semantics and default value
3. `outputMappings` always runs last (explicit configuration has the highest priority), e.g. `risk → aiRisk` so a later conditional branch can read `msg.aiRisk`

## The Experience in gflow

The Commercial Edition ships a complete AI Agent management console (one of the four homegrown components):

- **Agent and skill management**: each agent independently configures its model (provider/model/endpoint/API key/temperature, etc.), prompt templates, knowledge-base skills, and tool calls. Model providers are maintained on the "Model Providers" page (the `llm_providers` table; the catalog of available models is fetched via `GET /api/v1/llm/catalog`), and the global default LLM connection lives in `configs/config.yaml` at `llm.url / llm.api_key / llm.model` (or the environment variables `GFLOW_LLM_URL` / `GFLOW_LLM_API_KEY` / `GFLOW_LLM_MODEL`)
- **Designer integration**: drag an "AI Agent" node into the process and pick one of the configured agents; node settings span four pages — Agent / Prompt / AI Decision / Error Handling
- **Traceable results**: AI verdicts and reasons are written into process variables (`msg._ai` or mapped fields), viewable and reviewable in the variables panel of the approval details

## Boundaries and Recommendations

- AI verdicts are **routing suggestions only**; critical actions (actual payments, etc.) should still land on human nodes or automation nodes
- If an agent's systemPrompt hard-codes "output JSON only, no other text", add a line such as "when the caller requires a verdict marker, comply" to avoid conflicting with the injected verdict protocol
- Keep only necessary fields in prompts; redact sensitive information before sending it to the model
- Auto-approval is only recommended for scenarios with explicit amount/risk thresholds; otherwise, use the output as a reference for humans
