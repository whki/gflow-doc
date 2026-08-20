# Environment Requirements

## Engine (GFlow Engine)

| Dependency | Requirement |
|---|---|
| Go | 1.24+ |
| RuleGo | v0.37+ |
| Database | PostgreSQL / MySQL built in; other databases (DM, KingbaseES, etc.) are supported via DialectProvider extensions — see [Custom Database Dialect](/en/guide/deployment/custom-dialect). Unit tests run against an in-memory SQLite database through a custom dialect, so no database installation is required |

## Platform (gflow)

| Dependency | Requirement |
|---|---|
| Operating system | Linux / Windows / macOS (switch freely via Go cross-compilation) |
| Go | 1.25+ (to build the server from source) |
| Node.js | ≥ 20.19 (the minimum for Vite 7; 24.x recommended). The frontend repo gflow-ui uses pnpm (enforced by a preinstall check — npm will simply fail) |
| Database | PostgreSQL (recommended for production) or MySQL; domestic Chinese databases and others connect via dialect extensions — see [Custom Database Dialect](/en/guide/deployment/custom-dialect) |
| Hardware | 2 CPU cores and 2 GB RAM are enough to get started (the demo environment runs rock-solid on a cloud instance with 1.9 GB of memory) |
| Optional | Redis (distributed locking for multi-instance deployments) |

## Ports

- The gflow server listens on `:8080` by default (REST API; the `make release` single binary with the embedded frontend also serves the frontend static assets)
- Frontend dev mode (when customizing the frontend): `:9521`
