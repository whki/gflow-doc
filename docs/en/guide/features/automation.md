# Automation

<div class="lead">
Approval is not just "a human clicks approve". The automation node invokes RuleGo rule chains to fully automate everything that follows approval — booking entries, granting permissions, sending notifications, writing to third-party systems. This is the power of "process as rule chain".
</div>

## The automation Node

Invokes any RuleGo rule chain (`flow` is a compatibility alias). The entire node ecosystem available inside rule chains works here: database writes, message queues, email, script transforms, HTTP, and more. In gflow you orchestrate these capabilities visually with the **Rule Chain Designer** (one of the four homegrown components of the Commercial Edition) instead of hand-writing rule chain JSON.

```json
{
  "id": "node_auto_1",
  "type": "automation",
  "name": "Expense auto-booking",
  "configuration": {
    "targetId": "expense_auto_book"
  }
}
```

`targetId` is the target rule chain ID (`flow` is the legacy alias). Triggering is **non-blocking**: the node succeeds and flows downstream as soon as the call is issued, without waiting for the rule chain's execution result.

## Service Task (serviceTask)

No rule chain needed — call a Go function directly (registered via `components.Services.Register`, which delegates to `action.Functions` internally; gflow ships two demo functions, `test` and `genSerialNo`, while business functions are registered by the host application):

```go
// The host application registers a function (metadata + implementation declared together;
// the designer dynamically renders the parameter form from the Def)
components.Services.Register(components.ServiceFuncDef{
    Name:  "sendApprovalNotification", // the value used as the node's functionName
    Label: "Send approval notification",
}, func(ctx rulegoTypes.RuleContext, msg rulegoTypes.RuleMsg) {
    // ...
})
```

```json
{ "type": "serviceTask", "configuration": { "functionName": "sendApprovalNotification", "param": { "channel": "wecom" } } }
```

## HTTP Call (httpCall)

Makes a synchronous request to an external API and merges the response into the process variables via mappings (`from` picks a response field; `to` writes to the top level of `msg.Data` or to `metadata.k`):

```json
{
  "type": "httpCall",
  "configuration": {
    "method": "POST",
    "url": "https://erp.internal/api/expense",
    "body": "Expense claim ${metadata.business_key}, amount ${msg.amount}, has been approved",
    "headers": { "X-Api-Version": "2" },
    "timeoutMs": 10000,
    "outputMappings": [{ "from": "data.orderNo", "to": "erpOrderNo" }]
  }
}
```

## Sub-process (subProcess)

Starts an independent sub-process instance (linked via `wf_instance.parent_id`); when the sub-process finishes, control returns to the main process:

- Break large processes into modules: a main "Procurement Request" with sub-processes "Contract Approval" and "Warehouse Acceptance"
- Sub-processes have their own forms and approvers, and bring result variables back to the main process on completion

## Delay Wait

Suspends for a specified duration after the node is reached, then continues (e.g. a "probation confirmation process: automatically initiate the evaluation 90 days after onboarding").

## Scenario Selection

| Business moment | Recommended node | Typical example |
|---|---|---|
| Run a set of system actions after approval (multi-step, reusable, visually maintained) | `automation` | After an expense is approved: generate a serial number → write to the expense system → send a WeCom notification, all as one rule chain |
| Lightweight in-process Go capability built into the platform/host | `serviceTask` | Built-in `genSerialNo` for business serial numbers; host-registered credit checks and scoring |
| Call an external HTTP API and bring the response back into the process | `httpCall` | After procurement approval, call the ERP ordering API and map the returned `orderNo` into process variables for downstream nodes |
| Embed an independent approval loop inside an approval | `subProcess` | A main "Procurement Request" process with a "Contract Countersign" sub-process that has its own form and approvers, returning on completion |
| Wait a period of time at a node | `delay` | Probation confirmation: automatically continue to the review node 90 days after onboarding |
| Drive notifications/audit from the task lifecycle (not a node) | Event callbacks | `TaskEventListener` writes in-app notifications and audit logs; Webhook write-back is extended by the host |

Rule of thumb: **reuse across flows → automation; lightweight in-process → serviceTask; need the external result → httpCall; humans still in the loop → subProcess; need to wait → delay**.

## Typical Composition

```
Initiate → Direct supervisor → Conditional branch
                      ├─ msg.amount ≤ 5000 → automation(book entry) → CC Finance → End
                      └─ default → Department manager countersign → aiAgent(risk pre-screen)
                                   ├─ low  → automation(book entry) → End
                                   └─ high → Finance director → httpCall(ERP) → End
```

A time-driven composition (probation confirmation):

```
Initiate (onboarding) → HR approval → delay(90 days) → Direct supervisor (probation review)
                         ├─ approved → httpCall(provision IT account) → automation(sync roster + notify) → End
                         └─ rejected (rejectToStarter) → initiator revises and resubmits
```

## Event Callbacks

gflow dispatches task lifecycle events (assignment/completion/rejection, etc.) to the host application via `TaskEventListener`, with built-in in-app notifications and audit logs; when you need Webhooks to write back to business systems or events to trigger rule chains, extend the listener in the host application yourself.
