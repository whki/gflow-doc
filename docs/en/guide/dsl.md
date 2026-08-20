# Process DSL Specification

<div class="lead">
A process definition is a RuleGo rule chain: <code>{ruleChain, metadata}</code>. The ruleChain carries the process metadata and form, while metadata describes the nodes and connections. BPMN 2.0 XML is not parsed.
</div>

## Top-Level Structure

```json
{
  "ruleChain": {
    "id": "leave_approval",
    "name": "Leave Approval",
    "root": true,
    "debugMode": false,
    "additionalInfo": {
      "description": "Employee leave approval process",
      "category": "hr",
      "icon": "Calendar",
      "processType": "main",
      "formType": "design",
      "form": { "title": "Leave Application Form", "fields": [ /* form schema */ ] }
    }
  },
  "metadata": {
    "firstNodeIndex": 0,
    "nodes": [ /* node array */ ],
    "connections": [ /* connection array */ ]
  }
}
```

- `processType: main` main process / `sub` sub-process
- Three form modes: `formType: "design"` (default, embeds the `form` schema) / `formType: "system"` + `formKey` referencing a shared template in the `forms` table / `formType: "external"` + `formUrl` attaching an external form (rendered read-only in an iframe)

## Nodes

```json
{
  "id": "node_manager_approval",
  "type": "userTask",
  "name": "Manager Approval",
  "configuration": { /* node configuration, varies by type */ },
  "additionalInfo": {
    "description": "Node description",
    "actionPermissions": { "transfer": true, "return": true, "addSign": true, "urge": true, "uploadAttachment": true },
    "formPermissions": { "field1": "r", "field2": "w", "field3": "h" },
    "layoutX": 300, "layoutY": 50
  }
}
```

For the `configuration` of each node type, see the [Node Type Overview](/en/guide/features/nodes).

## Connections

```json
{ "fromId": "node_s1", "toId": "node_manager_approval", "type": "manager_approval" }
```

Semantics of `type`:

- **After a switch**: the matched branch name (conditional routing)
- **After approval/service/automation nodes**: `Success` (approved/success) or `Failure` (rejected/failed)
- **fork/join**: the convergence relationship of parallel branches

::: warning
Every process must have a reachable `end` node; otherwise instances never complete. The gflow designer auto-appends the end node on save, and the backend wires dangling tail nodes to end at deploy time as well — when handwriting DSL you must guarantee this yourself.
:::

## Conditional Expressions

The gflow designer's "Conditional Branch" produces a native `switch` node whose `cases` are RuleGo EL expressions evaluated against `msg`; the first case that matches from top to bottom takes its branch, and if none match, the `Default` outgoing edge is taken:

```json
{
  "id": "node_s1",
  "type": "switch",
  "configuration": {
    "cases": [
      { "case": "msg.days <= 3", "then": "manager_approval" },
      { "case": "msg.days > 3", "then": "sequential_approval" }
    ]
  }
}
```

You can also use a `jsSwitch` node (inline JS returning an array of branch names); the effect is equivalent:

```json
{
  "id": "node_s1",
  "type": "jsSwitch",
  "configuration": {
    "jsScript": "var days = parseInt(msg.days); if (days <= 3) { return ['manager_approval']; } return ['sequential_approval'];"
  }
}
```

Available variables:

| Variable | Description |
|---|---|
| `msg.<field>` | Process variables (start form fields + variables added at runtime) |
| `metadata.instance_id` | Instance ID |
| `metadata.process_key` / `process_id` | Process key / definition version ID |
| `metadata.business_key` | Business key |
| `metadata.owner` | Process initiator |
| `metadata.tenant_id` | Tenant ID |

## Expression Placeholders

`${msg.xxx}` / `${metadata.xxx}` in node configuration are resolved at runtime, for example:

```json
{ "url": "https://erp.example.com/api/orders/${msg.businessKey}", "body": "Order ${msg.businessKey} has been approved" }
```

When the initiator picks the approvers, the `selected` field of the `userTask` candidate configuration also supports `${msg.xxx}` resolved from process variables.

## Countersign Rules

```json
{
  "approvalType": "countersign",
  "approvalRule": "{\"type\":\"majority\",\"isSequential\":true}"
}
```

For the full mapping of `approvalType` (single / or / countersign / sequential / vote, etc.) and `approvalRule` (`type: all / any / majority / percent / count` + `value` + `isSequential`), see [Chinese-Style Approval Semantics](/en/guide/features/approval-semantics).

## Complete Examples

Leave approval (OR-sign + parallel countersign + sequential countersign + service tasks) is in the repository at `examples/leave_approval/dsl.json`; finished gflow DSL examples (with form schema, CC, and multi-level routing) are in `gflow/docs/demo/`: leave, expense reimbursement, procurement, and seal usage requests — all directly importable.
