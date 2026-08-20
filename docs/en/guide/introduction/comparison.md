# Comparison with Other Solutions

<div class="lead">
Choosing a solution comes down to three things: whether Chinese-style semantics are native, whether the tech stack matches, and whether the process model stays under your control. GFlow Engine gives a different answer on all three.
</div>

## Engine-Level Comparison

Legend: <b class="mk-yes">✓</b> supported · <b class="mk-part">△</b> partial / requires your own implementation · <b class="mk-no">✗</b> not supported

| Dimension | GFlow Engine | Activiti / Flowable | DingTalk/Lark Approval |
|---|---|---|---|
| **Chinese-style approval semantics** (countersign / add-sign / return / transfer / delegate / withdraw) | <b class="mk-yes">✓</b> native, first-class | <b class="mk-part">△</b> requires extension development | <b class="mk-yes">✓</b> supported |
| **Rule engine integration** (a process is a rule chain; automation invokes any chain) | <b class="mk-yes">✓</b> native | <b class="mk-no">✗</b> none | <b class="mk-no">✗</b> none |
| **AI approval** (aiAgent node) | <b class="mk-yes">✓</b> built in | <b class="mk-part">△</b> integrate it yourself | <b class="mk-part">△</b> limited |
| **Multi-tenant** | <b class="mk-yes">✓</b> tenant_id end to end | <b class="mk-part">△</b> do it yourself | <b class="mk-yes">✓</b> platform-level |
| **Embedding into an existing system** (library + 7 tables) | <b class="mk-yes">✓</b> import one library | <b class="mk-no">✗</b> heavy middleware | <b class="mk-no">✗</b> not embeddable |
| **Deployment form** | <b class="mk-yes">✓</b> single binary, no mandatory middleware | <b class="mk-part">△</b> JVM application | — SaaS |
| Process definition format | RuleGo rule chain DSL (JSON) | BPMN 2.0 XML | Closed source |
| Tech stack | Go | Java | SaaS, closed source |

## Why It Does Not Parse BPMN 2.0 XML

BPMN is a standard designed for drawing diagrams, while the heart of Chinese-style approval is **task semantics** (the parent-child chain of add-sign, countersign rules, the snapshot carried back on a return). GFlow Engine describes nodes and edges directly in JSON and puts the approval semantics into the node `configuration`:

- One less XML↔object-model conversion layer: the DSL is the storage format — what you see is what you get;
- Fully isomorphic with RuleGo rule chains: gateways / parallel / inclusive branches reuse the rule engine's native nodes directly;
- No information loss between the frontend designer (tree-based) and the DSL.

## Why So Few Tables

 The full Activiti suite easily runs to twenty or thirty tables; GFlow Engine has only 7. The reasons are covered in [Data model: why only 7 tables](/en/guide/data-model/) — the ordering between tasks does not need a "transition table" to record it, because it is encoded in the rule chain's edges; candidate resolution needs no redundant expansion table — store the original references and expand them through the identity service at query time.

## Relationship with the Commercial gflow Edition

The engine is free and open source (Apache-2.0); the platform is commercial at a clearly stated price. Simply put: **embedding the engine into your own system is free; if you want a complete platform that business administrators can use directly, one payment gets you the full source code** (the three designers — process / form / rule chain — plus the AI agent and the frontend application). See [Pricing](/en/pricing) for details.
