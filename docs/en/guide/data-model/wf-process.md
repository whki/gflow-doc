# wf_process Process Definition Table

<div class="lead">
The process definition master table: one row per published version, with the full DSL text stored in definition_json. Multiple versions of the same process_key are retained with increasing version numbers.
</div>

## Table Structure

| Field | Type | Description |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID primary key |
| `process_key` | VARCHAR(100) | Process key (business-unique identifier, e.g. `leave_approval`) |
| `name` | VARCHAR(200) | Process name (e.g. "Leave Approval") |
| `version` | INTEGER | Version number, starting at 1 and incrementing |
| `category` | VARCHAR(100) | Category (used for permissions / report filtering) |
| `description` | VARCHAR(500) | Process description |
| `definition_json` | TEXT | **Process definition DSL** (full `ruleChain` + `metadata` text) |
| `status` | VARCHAR(20) | `active` (in effect) / `retired` (disabled); saved draft copies use `draft` |
| `publish_time` | TIMESTAMPTZ | Version publish time |
| `icon` | VARCHAR(200) | Process icon |
| `process_type` | VARCHAR(20) | `main` (main process) / `sub` (subprocess) |
| `tenant_id` | VARCHAR(100) | Tenant ID |
| `created_by / created_at / updated_by / updated_at` | — | The four standard audit columns |
| `ext` | TEXT | Structured extension field (JSON) |

Unique index: `(process_key, version)` — each version of the same key occupies its own row.

## Versioning Semantics

- **Publishing a new version**: a new row is inserted with `version + 1`, and within the same transaction the previous `active` version of the same key is automatically set to `retired` — **at any given moment a process_key has exactly one active version**
- **Starting an instance**: `wf_instance.process_id` points to the id of the **specific version row**, so existing instances always run the version that was current when they were started — later process changes never affect in-flight items
- **Retiring**: set to `retired`; no new instances can be started, and existing instances run to completion

## What Is Inside definition_json

The engine accepts two formats: the envelope-wrapped structure produced by the designer (four keys: `form` / `flow` / `ruleChain` / `metadata`) and the legacy flat RuleChain format (top-level `ruleChain` + `metadata`). The core content is identical:

- `ruleChain.additionalInfo`: form schema, category, icon, `processType`
- `metadata.nodes`: nodes (`userTask` / `switch` / `serviceTask` / `end`…) along with their `configuration` (assignees, countersign rules) and `additionalInfo` (action permissions, field permissions)
- `metadata.connections`: transition edges

See the [Process DSL Specification](/en/guide/dsl) for details. Every visual configuration made in the gflow designer ultimately lands in this one field.

## Common Queries

```sql
-- All versions of a key
SELECT version, status, publish_time, created_by
FROM wf_process WHERE process_key = 'leave_approval'
ORDER BY version DESC;

-- The currently active version
SELECT * FROM wf_process
WHERE process_key = 'leave_approval' AND status = 'active'
ORDER BY version DESC LIMIT 1;
```

::: tip Back to the [Data Model Overview](/en/guide/data-model/)
