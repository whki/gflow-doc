# Changelog

## v1.4.4 · 2026-11-12

### GFlow Engine (Open-Source Engine)

#### New Features

- Comment attachments: Approve / Reject / Return comments can carry evidence files; attachments commit with the comment row in one transaction and surface on the timeline, reads go through authenticated endpoints

#### Bug Fixes

- Added signers received no arrival notification at all: add-sign subtasks now dispatch assigned events, restoring the in-app "Waiting for your approval" and IM card fan-out
- Reducing a countersign / vote node to zero signers by a participant no longer trips the instance-owner guard (403 rolling back the whole reduction)

### GFlow Platform (Commercial Edition)

#### New Features

- Default role for synced accounts: identity source configuration gains a "default role" dropdown (default USER, changeable or off); auto-provisioned accounts get the role at creation and existing role-less accounts are backfilled on the next sync — auto-created accounts no longer fail with 403 when starting approvals
- Startup versioned SQL auto-migration: replace the binary and restart to complete schema upgrades, replacing manual patch scripts; failed migrations refuse startup, multi-replica deployments run each version exactly once (`migration.mode`: auto / manual / off)
- Comment attachments end-to-end (desktop + mobile): the designer's "Upload attachment" action permission is now official; attachments render on the timeline with the comment row and preview / download through authenticated access; transfer / delegate / add-remove sign reject attachments server-side

#### Bug Fixes

- Add-sign on countersign / vote nodes failed with "invalid request" and remove-sign always showed no candidates: the UI now submits against the node aggregate row and lists removable signers directly
- Re-syncing after purging synced data failed the whole round: disabled auto-provisioned accounts are reclaimed by username instead of hitting the unique key
- Editing a synced account got stuck on username length / mandatory email: the username stays locked, name length and email are no longer enforced, and the dialog explains the sign-in path (IM login-free or mobile number)
- "Purge data" with nothing left now reports an idempotent "nothing to purge" hint; disabled departments appear greyed out with a "Disabled" tag in the department tree

## v1.4.3 · 2026-11-10

### GFlow Platform (Commercial Edition)

#### New Features

- Sign in with mobile number: the mobile number works as a login alias alongside the username, with the login page advertising both channels — a password sign-in path for IM-synced accounts that have no memorable username
- Post-save preflight for integration configs: saving samples the IM permission gaps (mobile / name field permissions) and reports on the spot what is missing and where to enable it, with sanitized error echoes
- Department membership of synced accounts reconciles on every sync: accounts provisioned before the org tree became visible get their memberships backfilled; purged bindings are restored by mobile number on re-sync

### GFlow Engine (Open-Source Engine)

- No engine changes in this version (engine pointer identical to v1.4.2)

## v1.4.2 · 2026-11-07

### GFlow Platform (Commercial Edition)

#### New Features

- Form data statistics: per-definition field statistics (count / sum / average / distinct count) with field filters, detail pagination and a three-section CSV report, windows up to one year; large datasets use keyset pagination (50k instances drop from 16 minutes to 18 seconds)
- Webhook private-network callback URLs allowed by default for private deployments (public deployments should explicitly disable `allow_private_callback`)

#### Bug Fixes

- S3 / OSS object storage downloads and previews returned empty bodies: lazy readers now bind the request context
- Init scripts set utf8mb4 session charset to prevent mojibake on import; the role-grant script no longer collides on primary keys when re-run
- A batch of performance and stability hardening: capped list variable payloads, definition caching for sweeps, tightened statistics projections

### GFlow Engine (Open-Source Engine)

#### Bug Fixes

- Add-sign subtasks inherit the parent's form snapshot: added signers no longer see a blank form, countersign aggregation is no longer overwritten by empty values, and the form is no longer flagged as "wholesale modified"
- Form submission filtering aligns with the permission table by data key: parasitic field-permission keys no longer leak visibility
- Fixed history-task variable column projection, statistics aggregate projection with duplicate detail resolution, fail-closed multi-level supervisor resolution, and delegate-return trace rows no longer carrying the comment (no more doubled timeline rows)

## v1.4.1 · 2026-10-27

### GFlow Engine (Open-Source Engine)

#### New Features

- Form snapshot history with row-level change markers on the timeline: instance details show the form as submitted, and field changes are marked with before/after values

#### Bug Fixes

- Upgraded x/net, x/crypto, x/image, pgx and other dependencies to eliminate reachable vulnerabilities

### GFlow Platform (Commercial Edition)

#### New Features

- First public release: linux-amd64 single binary with embedded frontend; Release artifacts and attachments publicly downloadable
- Template-referencing forms: published processes render printouts and mobile views from the referenced form template

#### Bug Fixes

- Release packages carry only example configs — no more dev-machine configs (with secrets) in release artifacts; without a config file the server starts in release mode, rejecting weak JWT secrets and placeholder strings at startup
- Mobile submission and approval views render on repaired data keys, aligned with the desktop
- Approval printout and attachment drill-down tab containers fixed: fields and attachments no longer vanish inside tabs
- History task init scripts gained the previous-assignee column and the transition trace index

## v1.4.0 · 2026-10-26

### GFlow Engine (Open-Source Engine)

#### New Features

- Transition trace rows for transfer, delegate return, reassignment and recall: the timeline and completed lists retain every handler, previous assignees keep visibility of the document, and trace rows anchor to real operation times
- Completed-task lists and instance union queries match transferees
- Terminal recall restored (whole-instance reopen): the last node's approver can reclaim the finished instance within the window for re-approval
- Return targets widened to any completed upstream node, with topology validation and parallel-gateway guards; voided tickets from returns carry a uniform void marker with the reason
- Idempotent grace window for business keys on start: retrying the same key on a terminal instance within the window returns the existing one

#### Bug Fixes

- Countersign variable merging strips engine reserved keys, the reduce-sign re-evaluation exit strips them too, and sub-ticket transfer trace rows attach to the parent task
- Task persistence and claim/awaken run their final check inside the instance row lock; tasks arriving late on a suspended instance are persisted frozen and activate with the resume cascade
- Reduce-sign restricted to the adder's own added subtasks with operator attribution; task variables reject writes to engine reserved keys, sealing reassignment and proxy-audit markers against handler tampering
- Terminations cascade to sub-instances with one terminated event each; deployment rejects topology cycles; transient task-persistence failures are marked with a sentinel for node-level retry

### GFlow Platform (Commercial Edition)

#### New Features

- Approval notifications straight to personal IM: DingTalk work notifications, WeCom app messages and Feishu cards deliver todos / CCs / rejections / reminders to the person, one tap opens the approval page login-free, links are one-time tickets immune to forwarding
- Directory sync and account integration: enter the enterprise app credentials to enable, sync departments and members in one click, auto-bind accounts by mobile number; nightly full sync with leavers auto-disabled
- Login-free entry: DingTalk / WeCom in-app opens as yourself, desktop supports DingTalk QR login (optional), and standard JWT trust with your own system jumps straight in (optional)
- IM channel configuration per tenant — each enterprise uses its own app credentials
- External system integration with API-Key and Webhook: external systems call approval APIs with a system identity and receive event callbacks; duplicate starts are idempotent within the grace window; keys support expiry and revocation, failed deliveries can be re-sent from the admin UI
- Transfer, delegate return and reassignment fully traced: timeline and printouts show every handler, previous assignees keep tracking the document
- Terminal recall restored: the last node's approver reclaims the finished instance within a window configured per flow in the designer
- Return targets widened to any completed upstream node, with the reason recorded on the document
- Login logging on its own table with configurable retention; audit action taxonomy unified

#### Bug Fixes

- Disabling or deleting a user invalidates their sessions immediately; password changes log out existing sessions
- System errors map to unified Chinese messages; notification delivery and runtime stability improved
- Fixed the form designer producing duplicate data keys via copy-paste or container drops that made filling one field update the whole column — fill, view and print all render on repaired unique keys
- Upgraded x/net, x/crypto, x/image, pgx and other dependencies to eliminate reachable vulnerabilities

## v1.2.0 · 2026-09-13

### GFlow Engine (Open-Source Engine)

#### New Features

- Approval node configuration reworked: approvers, approval mode (sequential / countersign / any-of), empty-approver handling, and rejection & return rules are now configured in one place — what the designer configures is exactly what the engine runs
- See who will approve each upcoming step, right when you start or approve a request
- When the approver is the initiator, the step is skipped automatically — no more approving your own request
- Requests can only be returned to earlier steps, never across parallel branches; invalid configurations are blocked at publish time, and existing processes have a safe fallback
- Request lists support filtering and statistics by status
- AI approval can read attachments — images and documents are both recognized
- Stricter multi-tenant isolation: cross-tenant access is always denied
- Multi-replica deployment support: distributed locks for cross-replica execution, cache invalidation broadcast across replicas, and per-slot deduplication for scheduled tasks

#### Bug Fixes

- Fixed a batch of permission issues; unauthorized operations are now always blocked
- Fixed the same request being processed twice in multi-server deployments
- Fixed approval states getting inconsistent after add-sign, reduce-sign, or termination
- Fixed visibility of claimable tasks and leftover claim states
- Fixed voided requests still showing in to-do, and delegated tasks missing approval comments after being returned
- Fixed AI being called twice when a process is re-driven

### GFlow Platform (Commercial Edition)

#### New Features

- New mobile app: start requests, handle approvals, and track progress on your phone
- Inbox-style approval center: to-do / done / initiated by me / cc'd on me in one place, with status filters and keyboard shortcuts
- Shared tasks can be claimed first-come-first-served — claim it, then approve it
- Fresh new UI: unified list-page layouts, a cleaner request-start page, a redesigned approval detail page, and a brand-new login look
- Cleaner forms and printouts: read-only content shown as plain text; printouts with tidy detail tables, thousand-separated amounts, and totals
- Workspace "recent activity" now shows updates related to you, clickable straight to the approval detail
- The process designer supports more approval settings: countersign / any-of, what to do when no approver is found, and return rules — all set directly in the designer
- Preview upcoming approvers when starting or approving, with an option to auto-skip when the approver is the initiator
- Connect your existing business forms: plug them into approvals and get results back automatically; embedding is more stable, and approval pages show form content by its business names

#### Bug Fixes

- Error messages for actions like rejection and return are now clear, plain Chinese
- Fixed requests already rejected by AI being rejectable again, and stale data after switching tabs
- Fixed auto-skip not working under countersign and sequential approval
