# Form Data Statistics

<div class="lead">
Pick a process and get a full statistics dashboard automatically: sums and averages for numeric fields, option distributions, and pivots by department, submitter, or month — no configuration needed. This page is for administrators: how to read the dashboard, which filters control the scope, and which fields are statable.
</div>

## Access

Administrators open it under **Approval Center → Form Data** (hidden from regular employees; granted to admins and workflow admins only). Pick a process on the left, switch the time range, and the dashboard refreshes instantly; **Export Report** in the top-right exports the current statistics.

## Auto-generated Dashboard

After selecting a process, the system reads the form definition attached to that process, detects statable fields, and renders three dashboard blocks — all fields participate by default, no chart building required:

| Block | Answers | Fields |
|---|---|---|
| Metric cards | What is the total / average / min / max across submissions | Number, money |
| Option distribution | How often each option was picked, and its share | Single choice, multi-select, switch |
| Group pivot | Break totals down by department / submitter / month / an option field | Processes with numeric fields |

Two details on **option distribution**: the option universe comes from the form definition, so options with zero votes still show 0%; a multi-select vote can hit several options while the percentage denominator stays at submission count, so multi-select shares may sum above 100%.

The **group pivot** switches dimension from the top-right selector: by department, by submitter, by month, or by any option field (e.g. total leave days by leave type). Each row shows sample count and per-field aggregates, exportable as CSV. High-cardinality dimensions such as submitter render the top 50 rows by default.

## Filters and Semantics

| Filter | Behavior |
|---|---|
| Time range | This month / quarter / year, or a custom date range |
| Include running | By default only **settled** submissions count (approved, rejected, withdrawn, terminated…); checking this folds in still-running instances for a real-time view |
| Statable fields | Toggle fields in the drawer; excluded fields drop out of metrics, distributions and pivots |

The coverage bar on top surfaces data quality: "N submissions · data complete", or "N skipped due to missing or unparseable field values" — skipped submissions never enter the denominator.

Two semantics worth knowing:

- **A just-finished submission is missing**: results are cached for minutes and finished instances take a short moment to archive — wait a minute and hit Refresh.
- **"Narrow the time range" prompt**: when a single process exceeds 50,000 submissions in the window, the system refuses to compute rather than grinding the database. Slice by month or quarter.

## Records and Export

The **Records** tab lists every submission's field values (submitter, time, status, fields) under the same filter scope as the dashboard — summarize first, drill down second — with pagination and CSV export (up to 2,000 rows). All three export buttons produce CSV:

| Export | Content |
|---|---|
| Export Report (top-right) | Full report: metrics, distributions, current pivot, with process name and range header |
| Pivot "Export CSV" | Current group table (dimension, metrics, sample count) |
| Records "Export CSV" | Per-submission rows |

## Statable Fields

To keep sensitive data out of reports, only the following field types participate; everything else (text, rich text, attachments, passwords…) is structurally excluded from the dashboard:

| Field type | Stat form |
|---|---|
| Number, money | Metrics (sum / avg / min / max) |
| Select, radio, switch | Distribution |
| Checkbox | Distribution (one vote, multiple buckets) |
| Date | Group dimension (by the field's month) |
| User, department | Group dimension |
| Sub-form fields | Expanded per row (each matrix row counts once) |

## API

The dashboard consumes two REST endpoints that external integrations can reuse: statable field discovery `GET /api/v1/workflow/form-statistics/fields` and aggregate query `POST /api/v1/workflow/form-statistics/aggregate` (the request body declares the metrics/distribution/group plan). See [REST API](/en/guide/api); the Swagger schema is authoritative.
