# wf_task_comment Task Comments

<div class="lead">
The engine's only "guestbook": one approval comment per row, append-only. After the task row completes and is migrated into the history tables, comments remain queryable and appendable in place — the audit trail is an independent timeline that does not move with the task.
</div>

## Table Structure

| Field | Type | Description |
|---|---|---|
| `id` | VARCHAR(36) PK | Primary key |
| `task_id` | VARCHAR(36) | References `wf_task.id` (still commentable/queryable after the task is archived) |
| `process_instance_id` | VARCHAR(36) | Process instance ID; pull the full comment stream of a process by instance |
| `tenant_id` | VARCHAR(100) | Tenant ID |
| `user_id` | VARCHAR(64) | Commenter ID |
| `user_name` | VARCHAR(100) | Commenter name (stored redundantly to avoid joins) |
| `content` | TEXT | Comment content |
| `created_at` | TIMESTAMPTZ | Creation time |

Indexes: `task_id`, `tenant_id`.

## Why Comments Don't Live on the Task Row

`wf_task.comment` stores only the conclusive comment from the last handling action, snapshotted into `wf_hi_task` when the task is archived. But a task's lifecycle often involves more than one comment: every countersign participant leaves one, add-signed approvers need to state their position too, and a reject-and-redo round adds another pass — this is a continuously appended timeline that a single field cannot hold.

So comments live in their own table: **one comment per row** — who (`user_id` / `user_name`), when (`created_at`), and what was said (`content`), attached by `task_id`. Append-only: historical comments are never overwritten by later handling.

## Still Readable and Writable After the Task Is Archived

Once runtime-table data completes, it migrates wholesale into `wf_hi_*`, whereas `wf_task_comment` is a persistent table: `task_id` is only a logical association — the task row moves away, the comments stay where they are. Completed-task detail views read it as usual, and adding a comment after the fact is no problem. To view a whole process's approval trail, pull everything at once via `process_instance_id`.

## Usage Examples

```sql
-- All comments of a task (chronological order)
SELECT user_name, content, created_at
FROM wf_task_comment
WHERE task_id = '...'
ORDER BY created_at;

-- The complete approval comment stream of a process instance
SELECT task_id, user_name, content, created_at
FROM wf_task_comment
WHERE process_instance_id = '...'
ORDER BY created_at;
```

::: tip Back to the [Data Model Overview](/en/guide/data-model/)
