# wf_task_assignee Task Candidate Pool

<div class="lead">
The smallest table of all, yet it solves the problem of decoupling the org structure from tasks: it stores only raw references (roles/departments) and expands them via IdentityService at query time — when the org structure changes, todo ownership takes effect in real time.
</div>

## Table Structure

| Field | Type | Description |
|---|---|---|
| `id` | VARCHAR(32) PK | Primary key |
| `task_id` | VARCHAR(36) | References `wf_task.id` |
| `entity_type` | VARCHAR(20) | `role` (default) / `department` / `person` |
| `entity_id` | VARCHAR(64) | roleId / deptId / userId |
| `tenant_id` | VARCHAR(100) | Tenant ID |
| `created_at` | TIMESTAMPTZ | Creation time |

Indexes: `task_id`, `(entity_type, entity_id)`, `tenant_id`.

## Why Not Expand Users Up Front

Suppose the "Finance role" has 50 candidates. The common approach writes all 50 user_ids into the association table when the task is created. Problems:

- After an org-structure change (transfers / offboarding), the candidate lists of already-created tasks go stale and need a synchronized refresh
- For large departments the write amplification becomes significant

GFlow Engine's approach: **store only the single raw reference `role:finance`**. When querying "who can handle this task", it is expanded in real time via `IdentityService.GetUserIDsByRoleID(tenantId, 'finance')`:

```
My todos = (wf_task.assignee = me)
         ∪ (in wf_task_assignee: entity_type=person and entity_id=me)
         ∪ (entity_type=role and my roles ∈ expand(entity_id))
         ∪ (entity_type=department and my departments ∈ expand(entity_id))
```

However the org structure changes, todo ownership is correct immediately.

## Working with Claim / Grab

Role/department candidate tasks are visible to all candidates; first to claim wins:

1. Any candidate clicks "Claim" in the list → that user is written into `wf_task.assignee`, and `claimed_at` records the time
2. The task disappears from everyone else's list
3. From then on the normal handling flow applies

## Usage Examples

```sql
-- All candidate references of a task
SELECT entity_type, entity_id
FROM wf_task_assignee WHERE task_id = '...';

-- Find the todos attached to my role (after the application layer expands role → userIDs)
SELECT t.* FROM wf_task t
JOIN wf_task_assignee a ON a.task_id = t.id
WHERE a.entity_type = 'person' AND a.entity_id = 'u_wangqiang';
```

::: tip Back to the [Data Model Overview](/en/guide/data-model/)
