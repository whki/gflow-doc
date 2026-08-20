# wf_hi_task History Task Table

<div class="lead">
The archive of finished tasks. One extra "soul" field: variables keeps a snapshot of the form at the moment the task ended — what the historical record "looked like back then" stays queryable forever.
</div>

## Table Structure

The fields are isomorphic to [wf_task](/en/guide/data-model/wf-task); key differences:

| Field | Description |
|---|---|
| `variables` | **Snapshot at the instant of completion** — the form stays exactly as it looked at approval time |
| `comment` | Task comment ("Agreed; mind the handover for the leave") |
| `end_reason` | Completion/return/termination reason |
| `duration` | Task elapsed time (milliseconds) — for step-efficiency analysis |
| `assignee` | Final handler |
| `delegate_*` | Delegation snapshot (if any) |

Every countersign participant task and every add-sign child task takes its own row here after ending, with `parent_id + sequence_order` preserving the chain structure.

## The Value of the Snapshot

When the approval detail page shows a historical record, it reads the variable values **from that moment**, not the current ones — even if later steps changed variables or the org structure replaced people, the historical record stays unchanged. This is the baseline requirement for audit compliance.

## Typical Queries

```sql
-- Full approval trail of an instance (including countersign/add-sign chains)
SELECT task_def_key, name, assignee, status, comment, ended_at, duration
FROM wf_hi_task
WHERE process_instance_id = '...'
ORDER BY created_at;

-- Average dwell time per step (find bottlenecks)
SELECT task_def_key, name,
       COUNT(*) AS cnt,
       ROUND(AVG(duration) / 3600000.0, 1) AS avg_hours
FROM wf_hi_task
WHERE ended_at > NOW() - INTERVAL '30 days'
GROUP BY task_def_key, name
ORDER BY avg_hours DESC;

-- One person's approval volume over the past year
SELECT COUNT(*) FROM wf_hi_task
WHERE assignee = 'u_zhangwei' AND ended_at > NOW() - INTERVAL '1 year';
```

## Relationship with the Runtime

```
wf_task (in progress) ──task ends──▶ wf_hi_task (archived, back-filling comment/duration/snapshot)
     ▲ When the whole instance ends: wf_instance → wf_hi_instance, task rows migrate wholesale
```

::: tip Back to the [Data Model Overview](/en/guide/data-model/)
