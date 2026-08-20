# Visual Process Designer

<div class="lead">
A homegrown tree-based process designer — interactions business administrators already know, with zero learning curve. No code required: form, process, and publishing in one continuous flow.
</div>

## Design Wizard (Four Steps)

1. **Basic settings**: process name, icon, category, description
2. **Form design**: the homegrown [gform-designer](/en/guide/features/form-engine) — drag and drop fields, configure required rules and default values, or apply a template from the library
3. **Process design**: arrange nodes on a tree canvas (the focus of this page)
4. **Publish**: the version auto-increments; drafts never affect the live process

## Tree Canvas

A familiar top-down tree structure:

- Each node is a card; click it to open the **configuration drawer on the right**
- The **＋** button inserts a node anywhere: Approval / CC / Conditional branch / Parallel branch / Inclusive branch / Automation / Sub-process / Delay wait / Service task / HTTP call / AI Agent
- Branch containers can nest further branches. **Conditional/inclusive branches automatically get a trailing "default branch" at creation time** — an empty default branch passes straight through to the end, eliminating the "process deadlocks when no condition matches" failure mode

## Condition Configuration: Variable Autocomplete

No need to hand-assemble variable names in the condition drawer. The input box autocompletes three categories of candidates:

- **Form fields**: `msg.days`, `msg.amount` (fields from the form schema bound to the current process)
- **Engine metadata**: `metadata.instance_id` / `process_key` / `process_id` / `business_key` / `owner` / `tenant_id`
- Combine multiple conditions with AND/OR and preview the expression in real time

```js
// Auto-generated conditional branch expression (a case on the switch node; normalized to the canonical msg.<field> form on save)
msg.days > 3 && msg.leaveType !== 'annual'
```

## Node Configuration Drawer

Taking the approval node as an example:

| Option | Description |
|---|---|
| Approver | Specific members / roles / direct supervisor / multi-level supervisor / initiator's choice / initiator (department candidate pools are supported by the engine DSL but not yet exposed in the designer) |
| Approval method | Sequential / countersign (parallel, unanimous) / OR-sign / vote-sign (majority / percentage / count); advanced countersign combinations such as ordered or majority can be hand-written as `approvalRule` JSON |
| Form permissions | Per-field hidden / read-only / editable (written into the DSL `formPermissions`) |
| Action permissions | Approve/reject are always available; every other action (transfer / return / delegate / add-remove sign / expedite / attachments) has its own toggle, off by default |
| Timeout policy | Deadline duration + overdue action (remind / auto-approve / auto-reject); overdue tasks are handled uniformly by gflow's scheduled sweeps |

## Field Permissions

The same form renders a different view at each node:

```json
{ "amount": "r", "reason": "w", "salary": "h" }
```

`r` read-only, `w` editable, `h` hidden. The approval detail page renders the form according to the current node's permissions.

## Publishing and Versioning

- **Draft**: edit freely, with no impact on the live process
- **Publish**: `version + 1`, written to `wf_process`; instances already in flight keep running the old version, while new initiations use the new one
- **Retire**: once `retired`, the process can no longer be initiated; existing instances run to completion

## Bottom-Line Guarantees

The DSL is the single source of truth: every designer configuration ultimately lands in `definition_json`; if the UI state is corrupted, the process diagram can be fully rebuilt from the DSL. Condition variable references are normalized to the canonical `msg.<field>` form on save, and historical dirty data is corrected automatically.
