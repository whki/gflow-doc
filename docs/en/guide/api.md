# REST API

<div class="lead">
The engine's core approval capabilities are exposed via REST under the base path <code>/api/v1</code>. Every approval flow in the gflow UI runs on top of this API — there are no private endpoints, so when you extend the system, your application stands on equal footing with gflow. This page covers the approval core (process definitions / process instances / tasks); APIs for rule chains, agents, forms, skills, and other modules are listed under "Other Module APIs" below.
</div>

## Authentication

JWT Bearer Token (`Authorization: Bearer <token>`), obtained from the login endpoint. All requests carry tenant context. Exception: the in-app notification WebSocket `GET /api/v1/ws/notifications` (browser WS cannot send an Authorization header, so the token is passed via a query parameter for self-authentication).

Approval action endpoints (claim / approve / reject / transfer / delegate / add-reduce sign, etc.) require the `approval:operate` permission; starting an instance requires `workflow:instance:start` or `approval:create` (either one suffices); management endpoints each have their own permission codes.

## Process Definitions `/api/v1/workflow/process-definitions`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated query of the definition list |
| GET | `/categories` | Startable approval processes grouped by category (data source for the initiation page) |
| GET | `/key/{processKey}` | Get the currently active version by key |
| GET | `/key/{processKey}/versions` | Get all versions by key |
| GET | `/{id}` | Get a definition by ID |
| GET | `/{id}/versions` | Get all versions by ID |
| POST | `/deploy` | Deploy a DSL (new version = version+1, the previous active version is automatically retired) |
| POST | `/import` | Import a DSL JSON file (same key automatically bumps the version) |
| POST | `/validate-conditions` | Validate the conditional expressions in the DSL (pre-check before save/publish) |
| POST | `/` | Create a draft |
| PUT | `/{id}` | Update a draft |
| DELETE | `/{id}` | Delete |
| POST | `/{id}/activate` | Activate |
| POST | `/{id}/retire` | Retire |

## Process Instances `/api/v1/workflow/process-instances`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated query (runtime and archive tables are automatically merged in the response) |
| GET | `/{id}` | Instance details |
| POST | `/start` | **Start an instance** (processKey + businessKey + variables; returns `data.instanceId`) |
| POST | `/{id}/submit-draft` | **Submit a draft** (only draft instances can be submitted; the creator/initiator scope is strictly enforced by the engine; permission `workflow:instance:start` or `approval:create`) |
| POST | `/{id}/suspend` · `/{id}/activate` | Suspend / resume |
| POST | `/{id}/force-resume` | Force resume (admin fallback: rescue for parallel branches stuck) |
| GET | `/stuck` | Reconciliation of stuck instances (active but with no pending tasks) |
| POST | `/{id}/re-drive` | Re-drive a stuck instance (the engine re-advances from the current node) |
| POST | `/{id}/terminate` | Terminate |
| POST | `/{id}/complete` | Complete |
| POST | `/{id}/withdraw` | Withdraw by the initiator (the instance is terminated, end_reason recorded as "Withdrawn by applicant") |
| DELETE | `/{id}` · `/batch` | Delete / batch delete |
| GET | `/{id}/variables` | List process variables |
| GET | `/{id}/variables/{variableName}` | Get a single process variable |
| POST | `/{id}/variables` | Batch set process variables |
| PUT | `/{id}/variables/{variableName}` | Update a single process variable |
| DELETE | `/{id}/variables/{variableName}` | Delete a single process variable |
| GET | `/todo` `/done` `/cc` `/applications` | My to-dos / completed / CC / my applications |
| GET | `/{id}/detail` | Approval details (trail + form + permissions) |

## Tasks `/api/v1/workflow/tasks`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Query tasks (conditions such as assignee / status / due date) |
| GET | `/{id}` | Task details |
| GET | `/statistics` | Approval statistics (todo badge, etc.) |
| GET | `/overdue` · `/backlog` | Overdue tasks / backlog-by-process dashboard (admin monitoring) |
| GET | `/history` · `/history/{id}` | Historical tasks (archive tables) |
| POST | `/urge/{id}` | Urge (notify the task handler to process it as soon as possible) |
| POST | `/{id}/claim` · `/{id}/unclaim` | Claim / unclaim (grab mode) |
| POST | `/{id}/approve` | **Approve** (with a comment) |
| POST | `/{id}/reject` | Reject |
| POST | `/{id}/return` | Return (only supports returning to the previous completed approval node) |
| POST | `/{id}/transfer` | Transfer |
| POST | `/{id}/delegate` | Delegate |
| POST | `/{id}/resolve` | Resolve a delegation (the delegatee resolves it and hands it back to the original approver) |
| POST | `/{id}/add-sign` · `/{id}/reduce-sign` | Add-sign / reduce-sign |
| POST | `/{id}/withdraw` | Withdraw (the applicant withdraws a submitted application; the instance is located via the task and terminated) |
| POST | `/{id}/suspend` · `/{id}/activate` | Suspend / resume the task |
| POST | `/{id}/complete` | Complete (non-approval tasks) |
| POST | `/{id}/reassign` | Reassign a task (admin) |
| DELETE | `/{id}` | Delete a task |
| GET/POST | `/{id}/candidates` | Candidate list / add candidates (admin) |
| POST | `/{id}/candidates/remove` | Remove candidates |
| GET | `/{id}/variables` | List task variables |
| POST | `/{id}/variables` | Batch set task variables |
| PUT/DELETE | `/{id}/variables/{variableName}` | Update / delete a single task variable |
| GET/POST | `/{id}/comments` | Task comment list / add a comment |

## Example: Start a Leave Request

```bash
curl -X POST http://localhost:8080/api/v1/workflow/process-instances/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processKey": "leave_approval",
    "businessKey": "leave-2026-0819-001",
    "variables": { "days": 5, "reason": "Family matters", "managerId": "u_zhangwei" }
  }'
```

## Example: An Approver Handles a To-do

```bash
# Query my to-dos
curl -H "Authorization: Bearer $TOKEN2" \
  "http://localhost:8080/api/v1/workflow/tasks?assignee=u_zhangwei&status=pending,active"

# Approve
curl -X POST http://localhost:8080/api/v1/workflow/tasks/{taskId}/approve \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{ "comment": "Approved. Please arrange the work handover." }'
```

## Other Module APIs

This page lists only the three core approval endpoint groups. Other modules:

- **Rule chains / agents**: bridged through the embedded rulego-server under `/rulego/api/v1/*` (rules, logs, skills, components, etc.), with RBAC mapped through gflow permission points; plus the gflow-native `GET /api/v1/components?scope=bpm|rulechain`. For the full contract and permission mapping, see `docs/规则链模块API接口文档.md` in the repository
- **Forms / skills / LLM / notifications**: also under `/api/v1`, sharing JWT authentication and the `{code, data, message}` envelope with the approval endpoints above; paths are listed in `gflow/internal/router/router.go`

## Go API

In embedded scenarios, use the engine services directly without going through HTTP: `ProcessService` (definitions/deployment), `RuntimeService` (instances/recovery), `TaskService` (tasks/approval actions). See [Engine Quick Start in Three Minutes](/en/guide/getting-started/quickstart) for usage.
