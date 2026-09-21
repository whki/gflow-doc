# Deployment Guide

<div class="lead">
gflow is a single Go binary plus frontend static assets — 2 vCPU / 2 GB RAM is enough to get started. Bare-metal deployment with systemd is recommended; Docker Compose can also bring up the full stack in one command.
</div>

## Bare Metal / systemd (Recommended)

```bash
# Recommended: all-in-one single binary (frontend embedded; visit :8080/gflow/ directly, no nginx).
# Prerequisite: gflow-ui (pnpm) and rulego-editor (editor sources) cloned as siblings of gflow;
# dependencies are installed automatically on the first build.
cd gflow && make release      # produces dist/gflow-server

# Configure and start (the repo only ships a sample file — copy it first, then edit the
# database connection and other required fields)
cp configs/config.yaml.example configs/config.yaml
./dist/gflow-server           # run from the gflow directory; automatically loads configs/config.yaml

# Alternative: separated frontend/backend (when the frontend needs independent scaling) —
# `make build` produces the API-only binary; `make web` artifacts are served by nginx
# (five locations: /gflow/, /m/, /api/, /api/v1/ws/, /rulego/)
cd gflow && make build && make web
```

`deploy/systemd/` provides systemd service unit templates; `deploy/nginx/` provides the frontend reverse-proxy configuration (including `/rulego/` — the rule-chain/agent editor API). The server listens on `:8080` by default.

For a first deployment, run `make db-init` (scripts/init-db.sh) to create the database and tables — **program startup does not create the core tables; both scripts are required**; see [Database Initialization](#database-initialization) below. Note that init-db.sh takes its connection info from `DB_*` env vars (defaults: localhost + postgres/postgres/gflow; MySQL default account root) and does NOT read config.yaml.

## Docker Compose One-Command Deployment

```bash
cd gflow

# 1. Build the full-stack single image (frontend embedded; build host needs Node + Docker, no Go)
make docker-build

# 2. Configure environment variables (change at least GFLOW_JWT_SECRET (random, >=32 chars; weak keys are rejected in release mode) / POSTGRES_PASSWORD)
cp .env.example .env && vi .env

# 3. Start the full stack
docker compose up -d
```

Compose brings up three containers:

| Service | Description |
|---|---|
| `postgres` | On first startup, automatically executes the engine table-creation script `00.init_bpm_pg.sql` (7 `wf_*` tables) and `00.init_pg.sql` (host tables + seed data) in order |
| `redis` | Cache and (in multi-instance deployments) distributed lock |
| `gflow` | gflow-server all-in-one image: desktop `/gflow/`, mobile H5 `/m/`, REST API and WebSocket on a single port — no nginx needed |

Open `http://localhost/gflow/` and sign in with the default account **admin / admin123** (change the password on first login). If host port 80 is taken, set `APP_PORT` in `.env`; for access from other machines also update `GFLOW_APP_BASE_URL` (used by IM quick-login links and password-reset callbacks).

> Dual-instance / multi-replica cluster deployment is a **commercial-edition (GFlow Platform) capability** and does not use this compose file; see section 7 of `docs/deploy/deployment.md` in the repository.

## Cluster Deployment (Commercial Edition)

GFlow Platform supports multi-instance active-active cluster deployment: the same codebase serves both single-node and multi-replica forms with unchanged single-node behavior; if any replica crashes, in-flight process instances are rescued automatically and the service stays up. It fits rolling releases without downtime and automatic recovery from single-process failures (same-host dual-process form; it protects against process-level failures, not whole-machine failures).

Under the cluster form the platform handles cross-replica consistency automatically:

| Capability | Description |
|---|---|
| Leader election | Redis-lease based; recovery/sweeper background jobs run on the leader only |
| Cross-replica execution mutex | Per-instance distributed gate (renewed while held), layered on top of DB row locks |
| Stuck-instance auto rescue | After a replica crash, in-flight instances and overdue delay tasks are re-driven by the leader sweeper (≤7 min); repeated failures escalate to manual alerting |
| Scheduled tasks exactly once | Scheduled rule chains are deduplicated by planned fire time across replicas; misfires are skipped, not replayed |
| Real-time notifications across replicas | WebSocket pushes are broadcast via Redis; no sticky sessions needed at the load balancer |
| Hot config reload | Rule chain / LLM provider changes are broadcast and reloaded on every replica within seconds — no restarts |
| Snowflake ID collision guard | machine_id startup registration; a conflict refuses to boot and reports the holder |
| File storage, three options | local (shared path / NFS), s3 (self-hosted MinIO or cloud S3), oss (Aliyun alias) |

Dependencies: shared PostgreSQL/MySQL + Redis (AOF persistence recommended) + a fronting load balancer with HTTP health checks. The full checklist (Redis configuration and degradation semantics, storage switching, the uniqueness constraint for existing databases, auto-start on boot, verification items) is section 7 of `docs/deploy/deployment.md` in the repository. The open-source engine ships the distributed-lock and rescue primitives, but the cluster orchestration (election / sweeping / broadcasting / storage switching) is yours to build.

## Production Checklist

- [ ] Change `GFLOW_JWT_SECRET` (random, ≥32 chars — weak keys are rejected in release mode) and the database password — never keep the defaults
- [ ] `server.swagger_enabled: false` (Swagger exposes the full API surface without authentication) and `captcha.enable_universal_code: false`
- [ ] Change the default `admin / admin123` password on first login
- [ ] A production PostgreSQL instance with scheduled backups (history tables are append-only)
- [ ] HTTPS: terminate certificates at a fronting nginx
- [ ] In multi-instance deployments, set `cache.global.type: redis` + `cluster.enabled: true` (the distributed gate, leader election, WS broadcast and token blacklist share that Redis; AOF recommended) — see section 7 of the repository deployment doc
- [ ] Log collection; disk-usage alerting for the `logs/` directory
- [ ] Separate demo/production accounts; enable operation auditing for administrators

## Database Initialization

- **GFlow Platform**: the postgres container automatically executes `scripts/engine/00.init_bpm_pg.sql` (7 engine tables) and `scripts/00.init_pg.sql` (application system tables + seed data) in order on first startup; for bare-metal deployments, run `make db-init` (scripts/init-db.sh) to do the same — **program startup does not create the core tables; both scripts are required**
- **Engine only**: run gflow-engine's `scripts/00.init_bpm_pg.sql` / `00.init_bpm_mysql.sql`
- **Non-built-in databases (DM, KingbaseES, etc.)**: integrate via the `DialectProvider` extension point — see [Custom Database Dialects](/en/guide/deployment/custom-dialect)

## Requirements

See [Requirements](/en/guide/getting-started/requirements). For reference, the demo environment runs the full gflow stack stably on a 1.9 GB RAM cloud VM.
