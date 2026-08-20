# Hands-On Tour of the GFlow Workflow Platform

<div class="lead">
Without writing a single line of code, walk the whole loop from form design to the final approval stamp. Two ways to do it: the online demo environment (5 minutes), or run a local copy (30 minutes).
</div>

## Option 1: Online Demo Environment (a good place to start browsing)

The production-ready demo environment comes pre-initialized with an org structure and sample processes:

- **URL**: <http://8.134.32.225:8081>
- **Administrator**: `admin / admin123`
- **Demo employees**: `wangqiang / demo123456` and `zhangwei / demo123456` (they follow different approval paths)

### Suggested Walkthrough

1. **Initiate an approval**: log in as wangqiang → Approval Center → initiate a "Leave Request", and submit with 2 days (short path) or 5 days (multi-level countersign path).
2. **Designers**: switch to admin → Workflow → Process Design: create a new process → form design (drag in fields) → Next → Process Designer (add approval/condition/CC/AI nodes) → publish.
3. **Todo approvals**: switch to lina (Engineering Department supervisor) → Todos → approve/reject/add-sign, and watch the parent-child task chain and the transition history (zhangwei is an initiator from the Engineering Department — follow the initiator's view).
4. **Process tracking**: back in the initiator's view, inspect the instance's node trajectory, time spent per node, and form snapshots.
5. **Monitoring and statistics**: the approval statistics dashboard and task monitoring.

> Demo data is reset periodically, so feel free to create whatever you like.

## Option 2: Local Deployment (run the binary directly)

```bash
# 1. Prepare PostgreSQL: create the gflow database and run the init scripts
#    Note: the engine's 7 wf_* tables live in scripts/engine/00.init_bpm_pg.sql
#    (the program does not create tables on startup — run both scripts)
psql -U postgres -c "CREATE DATABASE gflow"
psql -U postgres -d gflow -f gflow/scripts/engine/00.init_bpm_pg.sql
psql -U postgres -d gflow -f gflow/scripts/00.init_pg.sql

# 2. Build the single binary with the frontend embedded
#    (build the frontend first, then go build -tags embed)
cd gflow && make release        # produces dist/gflow-server

# 3. Update the database connection (dsn) in configs/config.yaml,
#    then start from the gflow directory
./dist/gflow-server             # listens on :8080 and reads configs/config.yaml automatically
```

> You can also set up the database with `make db-init` (which runs scripts/init-db.sh internally and locates the engine script automatically) or with Docker Compose (the postgres container runs both scripts in order automatically on first start).

Open `http://localhost:8080/gflow/` in a browser; the default account is `admin / admin123`. For Docker Compose deployment, see the [Deployment Guide](/en/guide/deployment/production).

## First Thing After Login: Configure a Process

gflow is designed so that **a business administrator can independently configure a 3-5 node approval flow within 30 minutes**.

1. **Basic settings**: process name, icon, category (e.g. "HR")
2. **Form design**: the in-house gform-designer — drag in fields such as leave type, start/end dates, and reason, mark them required or set default values; you can also start from a ready-made template in the template library
3. **Process design**: a tree-style visual designer
   - Initiator node: everyone or a specified scope
   - Approval nodes: choose "direct supervisor" or specific members, and configure OR-sign/countersign
   - Conditional branches: click the branch header to configure conditions; candidate variables auto-suggest both form fields (`msg.days`) and engine metadata (`metadata.process_key`, etc.) — remember to check one "default branch" as the fallback
   - You can also add CC / automation / subprocess / delay-wait / service task / HTTP call / AI Agent nodes
4. **Publish**: the version increments automatically; existing instances keep running on the old version

For detailed instructions, see the [Visual Process Designer](/en/guide/features/designer).
