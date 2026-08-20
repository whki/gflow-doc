# Overview: Why Only 7 Tables

<div class="lead">
The Activiti family easily runs to twenty or thirty tables; GFlow Engine has only 7. Fewer is not laziness — it is putting "state" and "structure" in the right places.
</div>

## Table List

| Table | Track | Purpose |
|---|---|---|
| [wf_process](/en/guide/data-model/wf-process) | Definition | Process definition: full DSL text + version |
| [wf_instance](/en/guide/data-model/wf-instance) | Runtime | In-flight process instances |
| [wf_task](/en/guide/data-model/wf-task) | Runtime | In-flight approval tasks |
| [wf_task_assignee](/en/guide/data-model/wf-task-assignee) | Runtime | Task candidate pool (raw role/department references) |
| [wf_task_comment](/en/guide/data-model/wf-task-comment) | Runtime | Task comments (persisted approval comments) |
| [wf_hi_instance](/en/guide/data-model/wf-hi-instance) | History | Archive of finished instances |
| [wf_hi_task](/en/guide/data-model/wf-hi-task) | History | Archive of finished tasks (with snapshots) |

<DataModelDiagram />

## Why So Few Tables Are Enough

**1. The process structure is encoded in the DSL, not in tables.**
Sequencing, parallelism, and conditional relationships between nodes are simply the rule chain's `connections` — at execution time the engine walks the graph in memory and needs no "current state-transition table". How far execution has progressed is expressed naturally by the active task rows: **wherever `wf_task` rows exist is exactly where the flow currently sits**.

**2. Countersign and add-sign reuse the task parent-child chain.**
Add-sign is not a new table; it attaches child tasks via `parent_id + sequence_order`. Countersign rules live in the `approval_rule` JSON on the task row — there is no separate "countersign configuration table".

**3. Candidates are not expanded redundantly.**
`wf_task_assignee` stores only the raw `entity_type + entity_id` references (role:xxx / dept:xxx); when querying todos, the `IdentityService` expands them in real time. When the organizational structure changes, todo ownership takes effect immediately — no task-table synchronization needed.

**4. Form data is process variables.**
Values from the initiation form go into `wf_instance.variables` (JSON) and are snapshotted into `wf_hi_task.variables` the moment a task ends. There is no separate "form data table" or "field value table".

**5. A runtime/history dual track, not flag columns.**
In-flight rows keep only the minimal field set needed to handle them, so runtime tables stay small and hot forever; when finished, the whole row migrates into `wf_hi_*` and gains `duration` / `end_reason`. Reports can add whatever indexes they like on the history tables without affecting production.

**6. Approval comments persist independently and do not move with the task.**
One comment per row, attached by `task_id`, stored in `wf_task_comment`. After the task row completes and migrates into the history tables, the comments remain queryable and appendable in place — the audit trail is an independent timeline, not an attached field on the task row.

## Tables the Engine Does Not Create

System tables for users, roles, departments, positions, and so on **are the host application's responsibility** (gflow ships a complete implementation). The engine integrates with them through the `IdentityService` interface, so it naturally fits your existing organizational structure.

## Initialization Scripts

```bash
# Engine repository (PostgreSQL / MySQL)
createdb gflow
psql -d gflow -f gflow-engine/scripts/00.init_bpm_pg.sql
mysql -u root -p -e "CREATE DATABASE gflow"
mysql -u root -p gflow < gflow-engine/scripts/00.init_bpm_mysql.sql

# GFlow Platform (PostgreSQL: first the 7 engine tables, then the host tables + seed data — run both)
psql -d gflow -f gflow/scripts/engine/00.init_bpm_pg.sql
psql -d gflow -f gflow/scripts/00.init_pg.sql
```
