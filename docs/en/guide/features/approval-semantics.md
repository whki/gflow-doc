# Chinese-Style Approval Semantics

<div class="lead">
Add-sign, reject, countersign, transfer, withdraw — these native semantics that give foreign BPMN engines a headache are first-class citizens in GFlow Engine. Every action closes the loop on <code>wf_task</code> and is exposed through the REST API and the Go API.
</div>

<script setup>
const matrixGroups = [
  {
    title: 'Approval modes',
    items: ['Single approver', 'OR-sign (any one approves)', 'Parallel countersign', 'Sequential countersign', 'Sequential approval', 'Vote (ratio/count)', 'System task', 'CC'],
  },
  {
    title: 'Countersign aggregation rules',
    items: ['Unanimous all (one-vote veto)', 'Any one any', 'Majority majority', 'Percentage percent', 'Fixed votes count', 'Sequential/parallel configurable'],
  },
  {
    title: 'In-flight actions',
    items: ['Add-sign', 'Remove-sign', 'Transfer', 'Delegate', 'Claim / grab', 'Return to previous node', 'Withdraw', 'Comment', 'Attachments'],
  },
  {
    title: 'Candidate types',
    items: ['Specific members', 'Role', 'Department', 'Direct manager', 'Multi-level manager', 'Initiator-selected', 'The initiator themselves'],
  },
  {
    title: 'Instance-level operations',
    items: ['Suspend', 'Resume', 'Terminate', 'Withdraw application', 'Timeout urge', 'Priority', 'Process tracking'],
  },
  {
    title: 'Self-approval policy (approver = initiator)',
    items: ['Skip', 'Route to direct manager', 'Route to department manager', 'Allow self-approval'],
  },
]
</script>

<CheckMatrix :groups="matrixGroups" />

## Approval Modes (approvalType)

Values for the node's `configuration.approvalType` (persisted as the same value into `wf_task.approval_type`):

| approvalType | Name | Pass rule | Description |
|---|---|---|---|
| `single` | Single approver | The assignee's action produces the outcome | Default value; `assignee` is a single handler |
| `or` | OR-sign | **Passes as soon as any one approver approves**; a single rejection rejects it | All candidates receive the task simultaneously; first to act wins |
| `countersign` | Countersign | Aggregated per `approvalRule` (unanimous / majority / ratio / count) | Works together with the rule fields; see the table below |
| `sequential` | Sequential approval | The next person receives the task only after the previous one has finished | The engine creates single-person tasks one at a time on demand; until the previous person produces an outcome, the task is invisible to the next |
| `vote` | Vote | The outcome follows the ratio/count in `approvalRule` | Shares the rule structure with countersign; a good fit for review and voting scenarios |
| `system` | System task | No manual voting | Used internally by automatic nodes |
| `cc` | CC task | Produces no approval outcome | Exclusive to `ccTask` nodes |

## Countersign Rules (approvalRule)

The aggregation rule for countersign/vote is written to `approval_rule` (a JSON string), with `CountersignRule` as the struct:

| Field | Type | Description |
|---|---|---|
| `type` | string | Aggregation mode: `all` / `any` / `majority` / `percent` / `count` |
| `value` | float | The rule value, used by the `percent` and `count` types |
| `isSequential` | bool | `false` parallel countersign (default) / `true` sequential countersign |

Details of the `type` aggregation modes:

| type | Pass condition | Reject condition | Example |
|---|---|---|---|
| `all` | Everyone approves | A single rejection rejects it | `{"type":"all","isSequential":false}` |
| `any` | Any one person approves | Any rejection rejects it (the first ballot completed decides the outcome) | `{"type":"any"}` |
| `majority` | Majority approves (`total/2+1`) | Majority rejects | `{"type":"majority","isSequential":true}` |
| `percent` | Approval share of votes ≥ `value` (in percent, rounded up: 60% of 3 people requires 2 votes) | Rejected once reaching the threshold is mathematically impossible | `{"type":"percent","value":60}` |
| `count` | Number of approval votes ≥ `value` (fixed count) | Rejected once reaching the threshold is mathematically impossible | `{"type":"count","value":3}` |

Typical combinations:

```json
// Parallel countersign · unanimous pass (one-vote veto)
{ "type": "all", "isSequential": false }

// Sequential countersign · majority pass (reviewed one by one; outcome once more than half)
{ "type": "majority", "isSequential": true }

// Parallel vote · 60% approval (review voting)
{ "type": "percent", "value": 60 }
```

> With `isSequential: true`, participants are activated one by one according to `wf_task.sequence_order`; in parallel mode everyone sees the task at the same time and the first to claim handles it (see Claim / grab below).

## When the Approvers Include the Initiator (Self-Approval Policy)

When the initiator appears in the approval chain, the node's configured `selfApprovalType` decides what happens — "approving your own request" never occurs:

| selfApprovalType | Behavior |
|---|---|
| `skip` | Skip this approver and go straight to the next node |
| `delegate_to_manager` | Route to the direct manager (falls back to the department manager when absent, and finally to the person specified by a `candidateConfig` variable) |
| `delegate_to_department_manager` | Route to the department manager for approval |
| `allow` | Allow the initiator to self-approve (the default; use when compliance requires it) |

> The enum also contains `auto_approve` (auto-approve) as a reserved value; the current implementation treats it the same as `allow`.

## Candidate Resolution

Tasks are created with the following `candidateType` values. The candidate pool (`wf_task_assignee`) stores only the original references, which are expanded through `IdentityService` at query time:

| candidateType | Resolution |
|---|---|
| `user` | `candidateUsers` provides user IDs directly |
| `role` / `dept` | Looks up users by role/department (department-manager approval can be configured) |
| `direct_manager` | The initiator's direct manager |
| `multi_level_manager` | The initiator's managers across multiple levels |
| `initiator_select` | Approvers chosen by the initiator at submission |
| `initiator_self` | The initiator themselves (self-approval scenario) |

## Actions During Processing

### Add-sign / Remove-sign

Dynamically insert approvers mid-approval (add-sign) or remove add-sign / countersign members who have not yet acted (remove-sign). Add-sign uses **before add-sign** semantics: the newly added signers review first, and the original approver produces an outcome only after all add-sign subtasks are complete. The engine maintains the parent-child task chain via `wf_task.parent_id + sequence_order`; add-sign creates child tasks, and the main task waits until every task on the chain has finished.

Remove-sign only touches subtasks that have **not yet been acted on** — members who already produced an outcome cannot be removed. On countersign / vote nodes the `approvalRule` is re-evaluated after removal: once the remaining votes already meet the threshold the node resolves and the flow continues; removing everyone (nobody left to review) terminates the instance. Removals are recorded via the `ReduceSign` event for audit / notification.

### Return (Send Back)

A task can be returned to the **last completed approval node** for re-processing:

- The return target is fixed to the most recently completed `userTask` (you cannot pick a target across nodes, nor return directly to the initiator)
- The returned task is archived as `returned`, the target node's task is rebuilt, and the form data and variables are carried back along with it
- When you need to "return to the initiator", configure the node's reject strategy as `rejectStrategy: rejectToStarter`

### Transfer / Delegate

Both hand the task to someone else — the difference is **who produces the final outcome** (the end-user walkthrough lives in the [Approval Actions Guide](/en/guide/features/approval-actions)):

- **Transfer**: the task is handed to someone else for good; the assignee changes, the original approver is out, and the new assignee's approval moves the flow on. An audit trail is written to the task variables `transfer_from` / `transfer_reason` / `transfer_time`
- **Delegate**: the delegatee reviews first, while `owner` keeps the original owner and `delegate_from` is persisted as an audit trail. When the delegatee approves or rejects, the task does **not** advance — it returns to the original approver automatically with a notification (`TaskEventResolved`), and the delegatee's comment stays on the timeline; the original approver then reviews once more to produce the final outcome. Delegating to yourself is rejected

### Claim / Grab

Role/department candidate tasks are first come, first served: anyone in the candidate pool can claim the task (`claimed_at` records the time), and once claimed no one else can process it.

### Withdraw

The initiator can **withdraw** an in-flight application: the instance terminates (status `terminated`, `end_reason` records "withdrawn by applicant"), in-flight tasks are voided, and afterwards the form can be modified and the request initiated again.

## Instance-Level Operations

| Operation | Instance state | Description |
|---|---|---|
| Suspend / Resume | `suspended` → `active` | Pauses all unprocessed tasks; on resume, each node resumes on its own without losing the parent context |
| Terminate | `terminated` | Force-killed by an administrator; `end_reason` is recorded |
| Complete | `completed` | Finishes normally through the end node and is archived into the history tables |

## Timeout Policy

A node's `timeoutPolicy` (`dueInMinutes` deadline duration + `action`) determines how overdue tasks are handled. gflow periodically scans in-flight tasks whose `wf_task.due_date` has expired every 30 minutes:

- `remind` (default): sends an in-app reminder through the built-in notification center without changing the task state
- `autoApprove`: auto-approves the overdue task as the system and the process continues
- `autoReject`: auto-rejects as the system and routes according to the node's reject strategy

`due_date` can also be set manually via the `TaskService.SetDueDate` Go API. For multi-instance nodes (sequential countersign / sequential approval), each subsequent subtask re-evaluates `dueInMinutes` based on **its own creation time**, so the whole chain never shares a single static deadline. When embedding the engine directly (without the gflow platform), the host must implement the scan logic itself (refer to gflow's overdue scanner).

## CC

The `ccTask` node produces CC records (without blocking the process) and fires the `CCTaskCreatedListener` callback; the gflow frontend has a "CC'd to me" list where CC recipients can comment.

## Action Permissions

Each `userTask` can finely toggle the actions available to its approver via `additionalInfo.actionPermissions`. **Approve and reject are forcibly enabled by the backend and cannot be turned off**; all other actions are off by default and must be enabled explicitly:

```json
{
  "transfer": true,
  "return": true,
  "delegate": true,
  "addSign": true,
  "reduceSign": true,
  "urge": true,
  "uploadAttachment": true
}
```

On the initiator side there are additional instance-level switches such as `suspend` / `withdraw` / `terminate` / `resubmit`. All of these are configured visually, node by node, in the Process Designer.
