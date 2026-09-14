# Changelog

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
