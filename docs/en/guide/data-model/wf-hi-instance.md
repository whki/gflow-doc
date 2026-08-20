# wf_hi_instance History Process Instance Table

<div class="lead">
The archive captured the instant an instance ends: structurally identical to wf_instance, with duration and outcome back-filled. Reporting and auditing happen here, without weighing down the runtime.
</div>

## Table Structure

The fields are fully isomorphic to [wf_instance](/en/guide/data-model/wf-instance), with three fields that "only mean something once ended" back-filled:

| Field | Description |
|---|---|
| `ended_at` | Process end time |
| `duration` | Running duration (milliseconds) — the core metric for time-consumption analysis |
| `end_reason` | End reason: notes on normal completion, or the specific reason for termination/withdrawal/failure (includes error details) |

## Archival Semantics

- **Migration, not copying**: when an instance ends, the row is removed from `wf_instance` and inserted into this table
- The runtime table therefore always contains only "in-progress" instances, staying small and hot
- The history table is append-only — a natural audit ledger

## Indexes (for Reporting and Auditing)

- `tenant_id` / `status` / `business_key` / `parent_id`
- `created_at DESC` / `ended_at DESC` — time-range reports
- `duration` — duration ranking (find the slowest processes/steps)

## Typical Queries

```sql
-- Average duration per process (last 30 days)
SELECT p.process_key, p.name,
       COUNT(*) AS total,
       ROUND(AVG(h.duration) / 1000.0, 1) AS avg_seconds
FROM wf_hi_instance h
JOIN wf_process p ON p.id = h.process_id
WHERE h.ended_at > NOW() - INTERVAL '30 days'
GROUP BY p.process_key, p.name
ORDER BY avg_seconds DESC;

-- Terminated/withdrawn instances and their reasons (withdrawn instances have status terminated and end_reason "Withdrawn by applicant")
SELECT name, status, end_reason, ended_at
FROM wf_hi_instance
WHERE status IN ('terminated', 'failed')
ORDER BY ended_at DESC;
```

## Data Governance

The history table only grows, never shrinks. For long-term operation we recommend:

- Periodically archive cold data per your business retention policy (e.g. dump everything older than 3 years)
- Back reports with materialized views to avoid large scans
- In industries that require strict compliance trails, simply retain everything — the table structure is simple and storage costs stay manageable

::: tip Back to the [Data Model Overview](/en/guide/data-model/)
