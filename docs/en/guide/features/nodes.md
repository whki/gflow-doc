# Node Reference

<div class="lead">
A process is built from nodes: drag a node onto the canvas, then click it to configure it in the drawer on the right. This page walks through each node type in terms of "when to use it, how to configure it, runtime behavior, and what to watch out for".
</div>

## BPM Approval Nodes

### Start Node (Entry Point)

The marker for where a process begins, generated automatically by the Process Designer. In the drawer you can rename the node and configure the **initiation scope**: everyone can initiate (default) / specific members / specific roles. The scope is strictly enforced by the backend — users outside the scope are rejected (403) when initiating, and the corresponding process is greyed out on the initiation page; the specified scope cannot be empty, otherwise no one will be able to initiate the process once it is published.

### Approval Node (userTask)

The core node: when the process reaches it, a todo is created for the approvers, and only approval lets the process continue.

**Who approves (seven ways)**:

| Mode | Description |
|---|---|
| Specific members | A fixed list; the people must be chosen before publishing |
| Specific role | Members are expanded from the role at runtime, producing "to be claimed" tasks |
| Specific department | Members are expanded from the department at runtime, producing "to be claimed" tasks |
| Direct manager | The initiator's Nth-level manager (level 1 by default); **the process fails if the org hierarchy is not deep enough** — it is never silently skipped |
| Multi-level manager | Managers from level 1 through N all approve, level by level; an "up to the top" option is available (review as many levels as exist) |
| Initiator-selected | The initiator picks the approvers on the initiation page (at least 1 person must be selected); multiple selection is supported |
| The initiator themselves | The approver is the initiator |

**How multiple approvers count as passed (approval mode)**: single / OR-sign (any one approves) / sequential (reviewed one by one in order) / countersign (everyone approves) / vote (passes at the threshold, percent-based by default and 50% when left blank). See [Approval Semantics](/en/guide/features/approval-semantics) for details.

**Other configuration**:

- Reject strategy: terminate the process / return to the initiator / previous node / a specified node
- Self-approval policy, for when the approver happens to be the initiator: allow self-approval / auto-skip / hand over to the manager / hand over to the department head
- Field permissions: control whether each form field is editable / read-only / hidden for this approver (read-only and hidden fields are never overwritten on submission)
- Action permissions: show or hide buttons such as transfer, add-sign, return, and urge

### CC Node (ccTask)

Notifies relevant people about the process, **without blocking it**. Two ways to build the list: fixed members; or "initiator-selected" — the initiator picks recipients on the initiation page (skipping CC entirely is allowed).

**Form permissions**: control which form fields CC recipients can see when viewing the details (read-only / hidden; all fields read-only by default). CC is informational in nature — there is no "edit" semantics.

### AI Agent Node (aiAgent)

Invokes an AI Agent to pre-screen the request: routing is automatic based on the `AI_DECISION` marker at the end of the output, and when the decision cannot be determined or the invocation fails, it **falls back to a human by default** (a todo is created for the fallback owner; once the human approves, the process continues, and the AI is not invoked again). The context (form/attachments/process information/prior comments/initiator) is assembled from the checked options, and the complete AI output is always kept in the process variable `_ai` for human review. See [AI Agent (AI Approval)](/en/guide/features/ai-approval) for details.

## System Action Nodes

### HTTP Call (httpCall)

Synchronously calls an external API within the process (tracking a shipment, fetching an exchange rate, etc.).

- The URL, headers, and body all support `${msg.field}` variables; form fields can be inserted with a click above the input box
- **A failed request (timeout / non-2xx) terminates the entire process instance, with no automatic retry** — be cautious when calling unreliable third-party APIs
- Response merging involves two settings:
  - **Output mode**: flatten into process variables (the default, and the most common way to enrich data from an API; fields with the same name as form fields overwrite what the applicant filled in) / isolated (the complete response goes only into the process variable `_http` and never touches the form)
  - **Field mapping**: extracts response fields into designated process variables; effective in both modes and takes the highest precedence

### Service Task (serviceTask)

Calls a Go function registered on the platform (e.g. a credit lookup or score computation). Once a function is selected, the parameter form is rendered automatically from its declaration; text parameters support `${msg.field}` templates with click-to-insert variables. A failed function execution terminates the entire process instance. Functions are registered by platform developers; integrators can find the registration method in the [engine docs · service task function registration](https://github.com/rulego/gflow-engine).

### Automation (automation)

Triggers an automation rule chain (send a notification, write a log, etc.); after triggering, it **does not wait for the result and does not feed output back**. Note: a failed trigger on the target chain terminates the entire process instance, so make sure the chosen automation is stable and available; if the selected target is taken offline, the drawer will warn you.

### Sub-process (subProcess)

Starts another published process as a sub-process: **the main process suspends here** and resumes once the sub-process instance has finished. The candidate list shows the current tenant's active processes (the current process itself is excluded automatically to prevent self-reference); by default all process variables are passed into the child instance.

### Delay (delay)

The process suspends here for the specified duration and then automatically continues.

## Branching and Merging

- **Conditional branch**: matches conditions top-down and takes the branch that hits; the condition field supports autocompletion (form fields + built-in variables such as the process instance ID / initiator). The "default branch" can only be set on the last branch
- **Routing**: configures multiple OR/AND conditional routes on a single node, with the same condition-field autocompletion as above
- **Parallel branch (fork) / inclusive branch (inclusive)**: multiple paths execute simultaneously or by condition
- **Join (join)**: waits for parallel branches to complete and then merges; parallel/join has boundary limitations (e.g. the behavior when some branches fail), see parallel-limitations in the engine repository docs

## Edges and Branching (DSL Perspective)

```json
{ "fromId": "node_s1", "toId": "node_manager_approval", "type": "manager_approval" }
```

- After a `switch`: `type` = the name of the branch that hit
- After approval/service nodes: `Success` / `Failure` (on rejection, `rejectStrategy` takes priority; only a failed jump falls through to the `Failure` outgoing edge)
- Use a `join` node where branches converge; every DSL must have a reachable `end` node (both the designer and deployment auto-complete it)

## Appendix: userTask Engine Field Quick Reference

For developers who write DSL directly; when the designer saves, it also writes frontend fields such as `setType`/`examineMode`. The engine reads only the fields below, and the two sets coexist without interfering with each other.

```json
{
  "id": "node_manager_approval",
  "type": "userTask",
  "name": "Manager approval",
  "configuration": {
    "candidateType": "user",
    "candidateConfig": { "userIds": ["480356539643727872"] },
    "approvalType": "single",
    "selfApprovalType": "allow",
    "rejectStrategy": "rejectToStarter"
  },
  "additionalInfo": {
    "actionPermissions": { "transfer": true, "return": true, "addSign": true, "urge": true },
    "formPermissions": { "field1": "r", "field2": "w", "field3": "h" }
  }
}
```

- `candidateType`: `user` / `role` / `dept` / `direct_manager` / `multi_level_manager` / `initiator_select` / `initiator_self`
- `candidateConfig`: takes `userIds` / `roleIds` / `levels` depending on the type (direct_manager ends at level N; multi_level_manager reviews every level; a negative value means up to the top of the organization); in the `initiator_select` scenario, `selected` supports `${msg.xxx}` resolved from process variables (gflow writes `${msg.selectedUsers}`)
- `approvalType`: `single` / `or` / `sequential` / `countersign` / `vote`, paired with an `approvalRule` threshold
- `selfApprovalType`: `allow` / `skip` / `delegate_to_manager` / `delegate_to_department_manager`
- `rejectStrategy`: `terminate` / `rejectToStarter` / `rejectToPrev` / `rejectToNode` (paired with `rejectTargetNode`)

See the [Process DSL Specification](/en/guide/dsl) for more.
