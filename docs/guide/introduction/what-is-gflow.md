# 什么是 GFlow

<div class="lead">
GFlow 极风工作流平台——AI 先审 · 人再签 · 签完自动办。它把<strong>审批</strong>与<strong>自动化</strong>编排在同一条流程里，以两种形态交付：<strong>GFlow Engine</strong> 是可嵌入的 Go 审批引擎（Apache-2.0 开源），<strong>GFlow Platform</strong> 是开箱即用的审批平台（<a href="/pricing.html">商业授权，源码交付</a>）。
</div>

> **批完，自动办。** 这是与其他审批引擎的根本差异：`automation`（调规则链）与 `aiAgent`（调智能体）是**引擎原生节点**，和审批节点写在同一条 DSL 里编排——AI 先审、人再签、签完自动执行。会签、加签、退回等中国式审批语义是完备的地基，见[中国式审批语义](/guide/features/approval-semantics)。

## 两种形态，同一内核

GFlow Engine 与 GFlow Platform 共享同一套 DSL 与数据模型，区别只在交付形态：把引擎嵌进你现有的系统，或者直接部署一个能用的完整平台。

| | GFlow Engine | GFlow Platform（极风工作流平台） |
|---|---|---|
| 形态 | Go 库（可嵌入） | 完整应用（服务端 + 前端） |
| 面向 | 开发者 | 企业 / 业务管理员 |
| 许可 | Apache-2.0 开源 | [商业授权 ¥7,500 · 源码交付](/pricing) |
| 仓库 | [Gitee](https://gitee.com/rulego/gflow-engine) · [GitHub](https://github.com/rulego/gflow-engine) | 随授权交付 |

**GFlow Engine** 是基于 [RuleGo](https://rulego.cc) 规则引擎的轻量级审批工作流引擎。流程定义复用 RuleGo 规则链 DSL（JSON），审批任务、流程实例、历史归档等状态由引擎持久化到关系数据库——无需部署独立的流程中间件。

> DSL 为 JSON 格式的类 BPMN 审批流，不解析 BPMN 2.0 XML。

**GFlow Platform** 在引擎之上补齐了一个企业能用起来的全部东西，核心是**四大自研部件**：流程设计器（树形可视化）、表单设计器（gform-designer）、规则链设计器（可视化编排自动化）、智能体（AI 审批/技能/智能体管理）。外加发起/待办/已办/抄送/统计的前端应用、组织架构与多租户后台、自动化编排、监控与通知、多实例集群部署。**前端、四大设计器、智能体、自动化全部自研，无第三方黑盒。**

## 核心特性

- **规则链即流程**：流程 DSL 复用 RuleGo 规则链，`switch` 条件网关、`fork`/`inclusive`/`join` 并行分支等原生节点可直接编排。流程即规则、规则即流程。
- **完整中国式审批语义**：或签（or）、会签（并行/顺序，全票/多数/比例/票数）、动态加签/减签、转办、委托、签收/抢单、退回上一节点、撤回、挂起/恢复、超时催办。
- **7 张核心表**：运行时与历史双轨分离，[数据模型](/guide/data-model/) 一眼看懂。
- **多租户**：全链路 `tenant_id` 隔离，规则链执行池按租户划分。
- **可插拔身份体系**：实现 `IdentityService` 对接真实用户/角色/部门（按角色、部门、多级主管解析审批人）。
- **可插拔数据库方言**：内置 PostgreSQL / MySQL，其他数据库可经 `DialectProvider` 方言扩展点自行适配。
- **流程定义版本化**：同一 `process_key` 按 `version` 递增保留多个发布版本，存量实例继续运行旧版本。
- **轻量部署**：无必须的外部中间件（Redis 分布式锁为可选项），Go 单二进制，适合嵌入现有应用。

## 适合谁

- **想给现有系统加审批能力的团队**：引一个 Go 库、建 7 张表，业务代码照旧。
- **想要一套完整审批平台的企业**：直接部署 GFlow 极风工作流平台，业务管理员 30 分钟配置出第一个流程。
- **信创 / 国产化场景**：Go 技术栈单二进制、无 JVM 依赖，自主可控。

## 在线演示

演示环境是一套完整的 GFlow Platform 成品（含测试数据）：

**地址**：<http://8.134.32.225:8081> · **账号**：`admin / admin123`

演示用户：`wangqiang / demo123456`、`zhangwei / demo123456`（走多级审批路径）。
