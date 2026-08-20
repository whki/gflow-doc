# Rule Chain Designer

<div class="lead">
One of the four homegrown components of the Commercial Edition. Orchestrate RuleGo rule chains visually — booking entries, notifications, and third-party writes after approval are just a matter of dragging nodes and drawing connections, with no hand-written rule chain JSON.
</div>

## Why an Approval Platform Needs a Rule Chain Designer

The `automation` node can invoke any RuleGo rule chain, but in the open-source edition rule chains can only be hand-written JSON. gflow closes that gap: **a rule chain is a process too — and can be dragged out just like one**.

```
Process Designer: how the approval flows (people + routing)
Rule Chain Designer: what the system does (automated actions)
The two connect seamlessly through the automation node
```

## Designer Capabilities

- **Drag-and-drop orchestration**: node palette → canvas connections, the same interaction model as the Process Designer
- **Node ecosystem**: all RuleGo standard components are available — data transformation, scripts, databases, message queues, email, HTTP calls, and more
- **Online debugging**: validate instantly via the rule chain test API — feed in a sample message and inspect each node's output
- **Deployment toggle**: the `disabled` flag controls whether a rule chain takes effect, updated on save; the list page shows versions and run records
- **Tenant isolation**: rule chains are isolated by `tenant_id`, consistent with the process engine's execution pools

## Integration with Processes

Drag an "Automation" node into the Process Designer and select a rule chain you have already orchestrated:

```json
{
  "type": "automation",
  "name": "Expense auto-booking",
  "configuration": {
    "targetId": "expense_auto_book"
  }
}
```

When the approval reaches that node → the engine invokes the rule chain → booking, notifications, and ERP write-backs all happen automatically. Conversely, nodes inside a rule chain can also initiate approval processes via the REST API — **processes drive automation, and automation can start processes too**.

## AI Agent Integration

Rule chains can include AI nodes (built on rulego-components-ai); combined with [AI Agent management](/en/guide/features/ai-approval) you get the "approval + AI + automation" combo: AI pre-screens → low risk goes straight through automation → high risk is routed to human countersign.

## Open-Source Edition Note

The engine-level `automation` node is open source (just configure it per the [node type overview](/en/guide/features/nodes)); the **visual designer UI** is part of the gflow Commercial Edition (delivered as source code; see [Pricing](/en/pricing)).
