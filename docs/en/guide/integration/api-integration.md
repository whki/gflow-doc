# External System Integration

<div class="lead">
Embed GFlow approval capabilities into your own system: service-account authentication, idempotent initiation, approval actions, webhook terminal-state push, and client code generation — the full server-to-server integration path on one page. Endpoint reference: [REST API](/en/guide/api).
</div>

## Three Integration Forms

| Form | How | Fits |
| --- | --- | --- |
| **Server-to-server API** | Your backend calls the GFlow REST API to start processes, drive approvals, and receive terminal-state events | ERP / OA / CRM systems delegating approvals to GFlow |
| **Login-free deep link** | Users click a link in your system and land on the GFlow approval form without signing in again | Human approval happens in the GFlow UI |
| **Directory sync** | GFlow periodically pulls an org-structure snapshot from your system and auto-binds accounts | Accounts live in your own system, not DingTalk / WeCom / Feishu |

Login-free access (IM cards, SSO JWT trust) and the directory-snapshot contract are covered in [IM Work Notifications](/en/guide/features/im-notify). Keeping forms in your own system: see the external-form section of the Chinese docs.

## Authentication: Three Options

All three exchange for the same JWT; subsequent requests carry `Authorization: Bearer <token>`.

| Option | Caller | Exchange endpoint |
| --- | --- | --- |
| Username / password | Quick tests, scripts | `POST /api/v1/auth/login` → `data.token` |
| JWT mutual trust | Web systems acting for a logged-in user | `POST /api/v1/auth/exchange/trusted`, body `{"external_jwt": "<your JWT>"}` (RS256, `aud=gflow`, TTL ≤ 5 min) |
| **API-Key** (recommended) | Unattended service accounts | `POST /api/v1/auth/exchange/api-key` |

### API-Key (service account)

Create under System → Integration Configuration → API-Key (Webhook and API-Key are platform-level sections of that page, visible to system administrators only): pick a name and a bound service user; the full `gk_`-prefixed key is returned **only once** — store it immediately in your secret manager. Exchange it for a token:

```bash
curl -X POST http://localhost:8080/api/v1/auth/exchange/api-key \
  -H "Content-Type: application/json" \
  -d '{ "apiKey": "gk_xxxxxxxxxxxxxxxxxxxxxxx" }'
# → data.token
```

Permissions equal the bound user's roles. Give each service account a **dedicated role** with only the permission codes it needs — a typical approval service account uses three codes: `workflow:instance:start` (start / start-on-behalf), `approval:operate` (approve / reject / transfer / sign), and `workflow:instance:view` (query instances and to-dos; `approval:todo` also unlocks the `/todo` endpoint). Keys can be disabled or deleted at any time; plaintext is never stored.

**Whose identity the key carries**: an API-Key is a machine credential — the exchanged token speaks as the bound service user and can only act on tasks assigned to that user (approvals enforce task ownership). To act on behalf of different natural users, do not create one key per person: use **JWT trust** above (per-user short-lived JWTs, 5-minute expiry). For occasional substitution, `proxy-approve` / `proxy-reject` (requires `workflow:task:proxy`) acts for the task's current assignee and records both in the audit trail.

## Start & Idempotency

```bash
curl -X POST http://localhost:8080/api/v1/workflow/process-instances/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "processKey": "purchase_order", "businessKey": "PO-20261010-0001", "variables": { "amount": 58000 } }'
# → { "code": 200, "data": { "instanceId": "7459…", "duplicated": false } }
```

`businessKey` is your business order number — the reconciliation anchor between the two systems.

| Scenario | Result |
| --- | --- |
| Same process + same `businessKey` sent again | **HTTP 200 idempotent return**: same `instanceId`, `duplicated: true` — no second instance |
| Same `businessKey` claimed by a different process definition | **HTTP 409** |
| Empty `businessKey` | Auto-generated, not part of idempotency |
| Instance reached a terminal state | `businessKey` is released with archiving; the same number can start a new instance |

**Starting on behalf of an employee (`startUserId`)** — the standard pattern when the employee submits the form in *your* system and your backend starts the GFlow instance: pass the employee's GFlow user ID as `startUserId`. The instance's initiator becomes that employee — approval chains such as "the initiator's direct manager" route correctly, and the timeline / CC / my-applications all land under their name. The service account is only the actor. Requires `workflow:instance:start` on the service account's role, and the target user must exist in the same tenant and be enabled. Omit `startUserId` to start as the service account itself (for document-type flows unrelated to any person).

Retry safely: on timeout or message replay just call start again and trust the returned `instanceId`.

## Approval Loop

Poll to-dos, then act (approval actions live under `/api/v1/workflow/tasks`, permission `approval:operate`; full list in [REST API](/en/guide/api)):

```bash
# My to-dos (same route as the Java demo): GET /api/v1/workflow/process-instances/todo
# permission workflow:instance:view or approval:todo;
# data.items[] carries each in-flight instance plus currentUserTaskId (the task ID to act on)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/workflow/process-instances/todo?page=1&pageSize=50"

# Approve
curl -X POST http://localhost:8080/api/v1/workflow/tasks/{taskId}/approve \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "comment": "Approved" }'
```

All list endpoints share the pagination shape `data: { items, total, page, pageSize, pages }` (`page` is 1-based; request params `page` / `pageSize`).

Task-level filtering is also available via `GET /api/v1/workflow/tasks` (permission `workflow:task:view`), with filters such as `assignee`, `instanceStatus`, `queryHistory`, and `dueDateBefore`:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/workflow/tasks?assignee=svc_order"
```

Other actions: `reject`, `return`, `transfer`, `delegate`, `resolve`, `add-sign` / `reduce-sign`, `claim` / `unclaim`, `urge`, `withdraw`, and instance-level `recall`.

## Terminal-State Awareness

| Option | How | Latency | Fits |
| --- | --- | --- | --- |
| Polling | Periodically query the instance status | Depends on interval | Callers that cannot expose an endpoint |
| **Webhook subscription** | GFlow POSTs events to your endpoint as they happen | Seconds | Recommended for server-to-server |
| DSL `httpCall` | An in-flow HTTP node calls your API at a designed point | In-sync with the flow | Callbacks embedded in the process orchestration |

### Webhook Subscription

Configure under System → Integration Configuration → Webhooks (a platform-level section of that page, visible to system administrators only): URL, signing secret, and the event set per endpoint.

- Events: `instance.completed`, `instance.terminated` (status distinguishes `terminated` / `cancelled` / `failed`), `task.assigned`.
- Payload: `{event, eventId, tenantId, instanceId, businessKey, processKey, processName, status, operator, reason, occurredAt}`. Four conditional fields ride along by event type: `source` (only on `instance.terminated`, distinguishes `api` / `withdraw` / `reject`, may be empty) and `taskId` / `taskName` / `assignees` (only on `task.assigned`; `taskId` is the task ID approval actions use). `eventId` is a bare UUID — identify events by the `event` field, not by any prefix (only the management-page `test` event uses the `evt-test-` prefix).
- Headers: `X-GFlow-Event`, `X-GFlow-EventId` (**deduplicate by this**), `X-GFlow-Timestamp` (Unix seconds), `X-GFlow-Signature: sha256=<hex(HMAC-SHA256(secret, rawBody))>`.

Verify the signature over the **raw request body bytes**:

```text
expected = "sha256=" + lowercase(hex(HMAC_SHA256(secret, raw_body)))
if not constant_time_eq(expected, headers["X-GFlow-Signature"]): reject
```

Delivery is **at-least-once**: failed pushes retry automatically (up to 3 times) without blocking the approval chain, so consumers must deduplicate by `eventId`. Callback URLs must be public `http`/`https` addresses. Management APIs: `GET /api/v1/integrations/webhooks`, `PUT /api/v1/integrations/webhooks/{name}` (create/update; body `{url, events[], enabled, secret}`, secret omitted on update keeps the current value, required and ≥16 chars on create, endpoint name ≤32 chars), `DELETE /api/v1/integrations/webhooks/{name}`, and `POST /api/v1/integrations/webhooks/{name}/test` (sends a `test` event).

## Errors

| Symptom | Fix |
| --- | --- |
| `401` expired token | Refresh via `POST /api/v1/auth/refresh`, or re-exchange an API-Key token |
| `403` forbidden | Check the service account's role permission codes (`workflow:instance:start` / `approval:operate` / `workflow:instance:view`) |
| `409` on start | `businessKey` is held by an in-flight instance of a different process — use a new number |
| Webhook signature fails | You must HMAC the raw body bytes, not a re-serialized JSON |

## OpenAPI Client Generation

With `server.swagger_enabled: true` (env `GFLOW_SERVER_SWAGGER_ENABLED=true`), browse `/swagger/index.html` and fetch the spec at `/swagger/doc.json`:

```bash
openapi-generator-cli generate \
  -i http://gflow-host:8080/swagger/doc.json \
  -g java \
  -o gflow-java-client
```

Any generator target works (`-g go / typescript-axios / python …`). Swagger stays off by default in production since the spec discloses the full API surface.

## Java Example

A runnable Maven/JDK-17 reference lives in the gflow repository at `examples/java-demo/`: API-Key login, JWT-trust login, idempotent start (asserts `duplicated: true` on the second call), an approve-to-terminal loop, and a webhook receiver with signature verification.
