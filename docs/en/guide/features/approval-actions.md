# Approval Actions Guide

<div class="lead">
What every button on the approval detail page does: who can use it, when it is available, and what happens to the flow afterwards. This page is for end users; the developer view of fields and data structures lives in <a href="/en/guide/features/approval-semantics">Chinese-Style Approval Semantics</a>, and the API contracts in <a href="/en/guide/api">REST API</a>.
</div>

## Actions at a Glance

When a handler opens a document under "My Approvals", the high-frequency **Approve / Reject** buttons sit front and center while the rest live under the "More" dropdown. Which actions a node offers is configured per node in the process designer — by default only Approve / Reject are enabled:

| Action | Who | Requirement | Effect |
|---|---|---|---|
| Approve / Reject | Handler | Always enabled | Flows on per the node's reject strategy |
| Claim / Unclaim | Candidate | Role/department candidate task | Once claimed, others cannot act |
| Transfer | Handler | transfer enabled in designer | Task moves entirely; the original handler is out |
| Delegate | Handler | delegate enabled in designer | The delegatee reviews, then the task returns for the final call |
| Return | Handler | return enabled in designer | Goes back to the last completed approval node for rework |
| Add-sign | Handler | addSign enabled in designer | Extra approvers review first; you decide after all of them |
| Remove-sign | Handler | reduceSign enabled in designer | Removes add-sign / countersign members who have not acted |
| Withdraw | Initiator | Instance in flight | Instance terminates; the form can be revised and resubmitted |
| Urge | Initiator / admin | urge enabled in designer | The handler gets a reminder; status unchanged |

## Transfer vs. Delegate

Both hand the document to someone else — the difference is **who makes the final call**:

|  | Transfer | Delegate |
|---|---|---|
| In one line | "This is not mine to approve — reassign it" | "Review it for me first; I make the final call" |
| Task ownership | Moves entirely; the original handler is out | Returns automatically after the delegatee acts |
| Final outcome | Produced by the new handler directly | Produced by the original handler after a second review |
| Audit trail | transfer_from / transfer_reason / transfer_time | owner / delegate_from, plus a return notification |

The full delegate loop (Zhang Wei → Li Na):

1. Zhang Wei clicks "More → Delegate" on the todo detail and picks Li Na
2. The document lands in Li Na's todo list and she reviews it as usual
3. When Li Na clicks "Approve", the flow does **not** advance: the task returns to Zhang Wei, who receives a "delegated task returned" notification, and Li Na's comment stays on the approval timeline for reference
4. Zhang Wei reviews and clicks "Approve" — only then does the flow move on

> Delegating to yourself is not allowed. When the delegatee clicks "Reject" the task still returns; whether to actually reject is decided by the original handler.

## Return

When the previous step was approved in error, use "Return" to send the document back:

- Only the **last completed approval node** can be targeted — no picking arbitrary nodes, no returning straight to the initiator
- The returned task is marked as returned, the target node gets a fresh todo, and form data and variables travel back with it
- To send work back to the initiator, use "Reject" with the node's reject strategy set to `rejectStrategy: rejectToStarter`

## Add-sign and Remove-sign

**Add-sign**: when more review is needed mid-flow, insert new approvers ahead of your own step (before add-sign). You get to decide only after every added signer has reviewed; while waiting, your Approve / Reject buttons are disabled with a hint showing who is still pending.

**Remove-sign**: someone was added by mistake, or a countersigner has been sitting on the task — remove add-sign / countersign members who have **not yet acted**:

- Members who already produced an outcome cannot be removed
- On countersign / vote nodes the rule is re-evaluated after removal: if the remaining votes already meet the threshold, the node resolves and the flow continues
- Removing everyone (nobody left to review) terminates the instance so the flow never deadlocks

## Withdraw

Second thoughts after submitting: the initiator can withdraw an in-flight application from "My Applications". The instance terminates (marked "withdrawn by applicant"), all in-flight tasks are voided, and the form can be revised and resubmitted. Completed flows cannot be withdrawn.
