# Architecture Overview

<div class="lead">
Five layers from top to bottom: the design layer, the application layer, the engine layer, the rule engine, and the storage layer. Each layer can be used on its own — GFlow Engine can be embedded into your system without the rest of the platform, and GFlow never locks in your data.
</div>

<ArchDiagram />

> The open source / commercial boundary sits at the **engine layer**: the engine layer and everything below it (GFlow Engine, RuleGo) are Apache-2.0 open source; the design layer and application layer belong to the commercial GFlow Platform.

## Data Flow of One Approval

1. **Initiate**: The user submits a form in the GFlow frontend; the application layer calls `RuntimeService.StartProcessInstanceByKey`, and the form data is loaded into the process variable `msg`.
2. **Routing**: The engine loads the rule chain DSL from `wf_process.definition_json` and hands it to the RuleGo execution pool (partitioned by tenant).
3. **Gateway**: The `switch` node matches branches by EL expression (e.g. `msg.days > 3`) to decide where the flow goes.
4. **Task**: When the flow reaches a `userTask` node, the engine writes a task row into `wf_task` and resolves `wf_task_assignee` from the candidate configuration.
5. **Action**: The approver acts on the todo in the frontend — approve / reject / add-sign, and so on; `TaskService` completes the task and advances the process.
6. **Execution**: When the flow reaches an `automation` (invokes a rule chain), `serviceTask` (invokes a Go function), or `httpCall` (calls an external API) node, the follow-up actions **run automatically** — book the entry, grant permissions, send notifications, write back to ERP; the `aiAgent` node routes on the model's output (low risk passes straight through, high risk goes to a human).
7. **Archive**: The moment the process ends, the instance and task rows move into `wf_hi_instance` / `wf_hi_task`, with duration and outcome filled in afterwards.

## Key Design Decisions

### A Process Definition Is a Rule Chain

The process DSL strictly follows the RuleGo `{ruleChain, metadata}` standard: form schemas, approvers, and permissions live in the node `configuration` and `additionalInfo`, while gateways and parallel branches reuse RuleGo native components directly. **The benefit**: interoperability with the RuleGo ecosystem — existing rule chains can be used as processes as they are, and, the other way around, the `automation` node can invoke any rule chain.

### Runtime / History Dual-Track

In-flight instances and tasks keep only the minimal set of fields needed for handling; once archived, `duration`, `end_reason`, and more are filled in. Runtime tables stay small and hot; history tables can be indexed freely for reporting, and neither gets in the other's way. See the [data model](/en/guide/data-model/) for details.

### Identity Decoupled from the Engine

The engine is not bound to any user system. For tasks initiated by role / department / manager, the assignee is always resolved through the `service.IdentityService` interface — in production, inject the host application's own implementation to plug into your real organization structure. GFlow ships with a complete built-in implementation (users / roles / departments / positions / multi-tenancy).

### The DSL Is the Single Source of Truth

The UI is just a view over the DSL. Every node, every branch, and every field permission configured in the designer ultimately lands in `definition_json`; if any UI state is lost, everything can be rebuilt from the DSL.
