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
| Recall | Handler (own latest approval) | No one has acted after you; recall not disabled on the flow (default on) | Downstream tasks void; the flow returns to you for re-approval |
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
- To send work back to the initiator, use "Reject" with the node's reject configured as `reject.strategy: toStarter`

## Add-sign and Remove-sign

**Add-sign**: when more review is needed mid-flow, insert new approvers ahead of your own step (before add-sign). You get to decide only after every added signer has reviewed; while waiting, your Approve / Reject buttons are disabled with a hint showing who is still pending.

**Remove-sign**: someone was added by mistake, or a countersigner has been sitting on the task — remove add-sign / countersign members who have **not yet acted**:

- Members who already produced an outcome cannot be removed
- On countersign / vote nodes the rule is re-evaluated after removal: if the remaining votes already meet the threshold, the node resolves and the flow continues
- Removing everyone (nobody left to review) terminates the instance so the flow never deadlocks

## Withdraw

Second thoughts after submitting: the initiator can withdraw an in-flight application from "My Applications". The instance terminates (marked "withdrawn by applicant"), all in-flight tasks are voided, and the form can be revised and resubmitted. Completed flows cannot be withdrawn.

## Recall

The approver's version of second thoughts: recall your own recently approved ticket as long as nobody has acted after you. All tasks created after your approval are voided (their handlers get notified), the flow returns to your to-do list for re-approval, and the timeline shows the ticket as "Recalled".

**You can recall when**:

- Your latest ticket is approved and the downstream node has not been handled yet (a task still pending for claim counts as "not handled")
- In sequential / countersign scenarios, you were the last handler of the round and nobody has acted after you
- Completed applications: the initiator or an admin can recall the whole instance within the recall window (default 7 days, adjustable per flow in the designer's advanced settings, 1-365 days); the last node reopens for re-review and the instance re-archives afterwards

**You cannot recall when**:

- Someone has already handled a node after you (a later handling record exists)
- An automation action has run after your approval (HTTP calls, automation nodes — effects that cannot be safely rolled back)
- The instance is suspended, or a completed application is past its recall window
- Only your own tickets can be recalled; flows that explicitly disable "Recall" in the designer (enabled by default)

## Out-of-office Delegation

On leave, on a business trip, or away for an extended period: set a delegation rule under **Personal Center → Out-of-office Delegation**. While the rule is active, newly created approval tasks are automatically routed to your delegate. The task detail marks it as a delegated task so the delegate knows why it arrived; the delegate approves or rejects normally and the decision counts in the record.

- The delegate must be an enabled user in the same tenant, not yourself; only one active rule per time window, and chained delegation is not allowed (your delegate cannot set up their own delegation in the same window)
- Optionally transfer existing to-dos when creating the rule; "Transfer existing" can also be run later as a retry
- When the rule ends or expires, new tasks return to you; already-transferred tasks stay put
- When an employee leaves, the admin performs "Disable and hand over": the system creates a long-term delegation rule, transfers in-flight tasks, and new tasks fall back to the department head or tenant admin — nothing is left dangling
- Unlike [Transfer](#transfer-vs-delegate), out-of-office delegation routes **new tasks automatically by person + time window**; transfer only moves the one task at hand
