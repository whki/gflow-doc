# What is GFlow

<div class="lead">
GFlow Workflow Platform — approvals like the wind, flow at full speed. It orchestrates <strong>approval</strong> and <strong>automation</strong> in the same process, delivered in two forms: <strong>GFlow Engine</strong>, an embeddable Go approval engine (Apache-2.0 open source), and <strong>GFlow Platform</strong>, an out-of-the-box approval platform (<a href="/en/pricing.html">commercial license, source code delivered</a>).
</div>

> **Once approved, it runs itself.** This is the fundamental difference from other approval engines: `automation` (invokes rule chains) and `aiAgent` (invokes AI agents) are **engine-native nodes**, orchestrated in the same DSL as approval nodes — AI pre-screens, humans approve, execution follows automatically. Countersign, add-sign, return, and other Chinese-style approval semantics form a complete foundation; see [Chinese-style approval semantics](/en/guide/features/approval-semantics).

## Two Forms, One Core

GFlow Engine and GFlow Platform share the same DSL and data model; the only difference is the delivery form: embed the engine into your existing system, or deploy a complete, ready-to-use platform as is.

| | GFlow Engine | GFlow Platform (GFlow Workflow Platform) |
|---|---|---|
| Form | Go library (embeddable) | Complete application (server + frontend) |
| Audience | Developers | Enterprises / business administrators |
| License | Apache-2.0 open source | [Commercial license ¥7,500 · source code delivered](/en/pricing) |
| Repository | [Gitee](https://gitee.com/rulego/gflow-engine) · [GitHub](https://github.com/rulego/gflow-engine) | Delivered with the license |

**GFlow Engine** is a lightweight approval workflow engine built on the [RuleGo](https://rulego.cc) rule engine. Process definitions reuse the RuleGo rule chain DSL (JSON), and state such as approval tasks, process instances, and history archives is persisted by the engine to a relational database — no separate process middleware to deploy.

> The DSL is a JSON-format, BPMN-like approval flow; it does not parse BPMN 2.0 XML.

**GFlow Platform** adds everything an enterprise needs on top of the engine to put it to real use. At its core are **four self-developed components**: the Process Designer (tree-based), the Form Designer (gform-designer), the Rule Chain Designer (visually orchestrating automation), and the AI Agent (AI approval / skills / agent management). Plus a frontend application for initiate / todo / done / CC / statistics, an admin backend for organization structure and multi-tenancy, automation orchestration, monitoring, notifications, and multi-instance cluster deployment. **The frontend, the four designers, the AI agent, and automation are all built in-house — no third-party black boxes.**

## Core Features

- **Rule chain as process**: The process DSL reuses RuleGo rule chains, and native nodes such as the `switch` conditional gateway and `fork`/`inclusive`/`join` parallel branches can be orchestrated directly. A process is a rule chain; a rule chain is a process.
- **Complete Chinese-style approval semantics**: OR-sign (or), countersign (parallel/sequential, all-votes/majority/ratio/vote-count), dynamic add-sign/remove-sign, transfer, delegate, claim/grab, return to the previous node, withdraw, suspend/resume, and overdue reminders.
- **7 core tables**: Runtime and history are kept on separate tracks; the [data model](/en/guide/data-model/) is clear at a glance.
- **Multi-tenant**: `tenant_id` isolation across the entire chain, with rule chain execution pools partitioned by tenant.
- **Pluggable identity system**: Implement `IdentityService` to connect your real users/roles/departments (approvers resolved by role, department, or multi-level manager).
- **Pluggable database dialects**: PostgreSQL / MySQL are built in; other databases can be adapted on your own through the `DialectProvider` dialect extension point.
- **Process definition versioning**: The same `process_key` keeps multiple published versions with an increasing `version`; existing instances keep running on the old version.
- **Lightweight deployment**: No mandatory external middleware (Redis distributed locking is optional), a single Go binary — well suited for embedding into existing applications.

## Who It Is For

- **Teams adding approval capabilities to an existing system**: import one Go library, create 7 tables, and keep your business code as is.
- **Enterprises that want a complete approval platform**: deploy the GFlow Workflow Platform directly — a business administrator can configure a first process in 30 minutes.
- **Xinchuang (IT application innovation) / domestic-technology scenarios**: a single Go binary with no JVM dependency — independent and fully under your control.

## Live Demo

The demo environment is a complete, finished GFlow Platform deployment (with test data):

**URL**: <http://8.134.32.225:8081> · **Account**: `admin / admin123`

Demo users: `wangqiang / demo123456`, `zhangwei / demo123456` (they go through the multi-level approval paths).
