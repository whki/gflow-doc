# REST API

<div class="lead">
引擎的审批核心能力经 REST 暴露，基础路径 <code>/api/v1</code>。gflow 界面的审批流转全部跑在这套 API 上，没有私有接口，二开时你的系统与 gflow 地位平等。本页覆盖审批核心（流程定义 / 流程实例 / 任务）；规则链、智能体、表单、技能等模块的 API 见下方「其他模块 API」。
</div>

## 认证

JWT Bearer Token（`Authorization: Bearer <token>`），登录接口换取。所有请求携带租户上下文。例外：站内通知 WebSocket `GET /api/v1/ws/notifications`（浏览器 WS 无法携带 Authorization 头，改用 query 参数传 token 自鉴权）。

审批动作类接口（签收 / 通过 / 驳回 / 转办 / 委派 / 加减签等）要求 `approval:operate` 权限；发起实例要求 `workflow:instance:start` 或 `approval:create`（任一即可）；管理类接口各有独立权限码。

## 流程定义 `/api/v1/workflow/process-definitions`

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | 分页查询定义列表 |
| GET | `/categories` | 可发起的审批流程按分类分组（发起页数据源） |
| GET | `/key/{processKey}` | 按 key 查当前生效版本 |
| GET | `/key/{processKey}/versions` | 按 key 查全部版本 |
| GET | `/{id}` | 按 ID 查定义 |
| GET | `/{id}/versions` | 按 ID 查全部版本 |
| POST | `/deploy` | 部署 DSL（新版本 version+1，旧 active 版本自动退役） |
| POST | `/import` | 导入 DSL JSON 文件（同名 key 自动升版本） |
| POST | `/validate-conditions` | 校验 DSL 里的条件表达式（保存/发布前预检） |
| POST | `/` | 创建草稿 |
| PUT | `/{id}` | 更新草稿 |
| DELETE | `/{id}` | 删除 |
| POST | `/{id}/activate` | 启用 |
| POST | `/{id}/retire` | 停用 |

## 流程实例 `/api/v1/workflow/process-instances`

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | 分页查询（运行表与归档表自动合并返回） |
| GET | `/{id}` | 实例详情 |
| POST | `/start` | **发起实例**（processKey + businessKey + variables；返回 `data.instanceId`） |
| POST | `/{id}/submit-draft` | **提交草稿**（仅 draft 实例可提交；创建者/发起人范围由引擎强校验，权限 `workflow:instance:start` 或 `approval:create`） |
| POST | `/{id}/suspend` · `/{id}/activate` | 挂起 / 恢复 |
| POST | `/{id}/force-resume` | 强制恢复（管理员兜底：并行分支卡死救援） |
| GET | `/stuck` | 卡死实例对账（active 但无未决任务） |
| POST | `/{id}/re-drive` | 重驱动卡死实例（从当前节点补跑引擎推进） |
| POST | `/{id}/terminate` | 终止 |
| POST | `/{id}/complete` | 完成 |
| POST | `/{id}/withdraw` | 发起人撤回（实例终止，end_reason 记「申请人撤回」） |
| DELETE | `/{id}` · `/batch` | 删除 / 批量删除 |
| GET | `/{id}/variables` | 流程变量列表 |
| GET | `/{id}/variables/{variableName}` | 查单个流程变量 |
| POST | `/{id}/variables` | 批量设置流程变量 |
| PUT | `/{id}/variables/{variableName}` | 更新单个流程变量 |
| DELETE | `/{id}/variables/{variableName}` | 删除单个流程变量 |
| GET | `/todo` `/done` `/cc` `/applications` | 我的待办 / 已办 / 抄送 / 我发起的 |
| GET | `/{id}/detail` | 审批详情（轨迹 + 表单 + 权限） |

## 任务 `/api/v1/workflow/tasks`

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/` | 任务查询（assignee / status / 到期等条件） |
| GET | `/{id}` | 任务详情 |
| GET | `/statistics` | 审批统计（待办徽章等） |
| GET | `/overdue` · `/backlog` | 超时任务 / 按流程积压看板（管理员监控） |
| GET | `/history` · `/history/{id}` | 历史任务（归档表） |
| POST | `/urge/{id}` | 催办（通知任务办理人尽快处理） |
| POST | `/{id}/claim` · `/{id}/unclaim` | 签收 / 取消签收（抢单） |
| POST | `/{id}/approve` | **通过**（带意见） |
| POST | `/{id}/reject` | 拒绝 |
| POST | `/{id}/return` | 退回（仅支持退回上一个已办审批节点） |
| POST | `/{id}/transfer` | 转办 |
| POST | `/{id}/delegate` | 委托 |
| POST | `/{id}/resolve` | 归还委派（被委派人处理后归还原审批人） |
| POST | `/{id}/add-sign` · `/{id}/reduce-sign` | 加签 / 减签 |
| POST | `/{id}/withdraw` | 撤回（申请人撤回已提交的申请，按任务定位实例并终止） |
| POST | `/{id}/suspend` · `/{id}/activate` | 任务挂起 / 恢复 |
| POST | `/{id}/complete` | 完成（非审批类任务） |
| POST | `/{id}/reassign` | 任务重分配（管理员） |
| DELETE | `/{id}` | 删除任务 |
| GET/POST | `/{id}/candidates` | 候选人列表 / 添加候选人（管理员） |
| POST | `/{id}/candidates/remove` | 移除候选人 |
| GET | `/{id}/variables` | 任务变量列表 |
| POST | `/{id}/variables` | 批量设置任务变量 |
| PUT/DELETE | `/{id}/variables/{variableName}` | 更新 / 删除单个任务变量 |
| GET/POST | `/{id}/comments` | 任务评论列表 / 新增评论 |

## 示例：发起一个请假

```bash
curl -X POST http://localhost:8080/api/v1/workflow/process-instances/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processKey": "leave_approval",
    "businessKey": "leave-2026-0819-001",
    "variables": { "days": 5, "reason": "家中事务", "managerId": "u_zhangwei" }
  }'
```

## 示例：审批人处理待办

```bash
# 查我的待办
curl -H "Authorization: Bearer $TOKEN2" \
  "http://localhost:8080/api/v1/workflow/tasks?assignee=u_zhangwei&status=pending,active"

# 通过
curl -X POST http://localhost:8080/api/v1/workflow/tasks/{taskId}/approve \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{ "comment": "同意，注意工作交接" }'
```

## 其他模块 API

本页只列审批核心三组端点，其余模块：

- **规则链 / 智能体**：内嵌 rulego-server 桥接，挂在 `/rulego/api/v1/*`（规则、日志、技能、组件等），RBAC 经 gflow 权限点映射；另有 gflow 原生的 `GET /api/v1/components?scope=bpm|rulechain`。完整契约与权限映射见仓库 `docs/规则链模块API接口文档.md`
- **表单 / 技能 / LLM / 通知**：同样在 `/api/v1` 下，与上述审批端点共用 JWT 认证与 `{code, data, message}` 信封，路径见 `gflow/internal/router/router.go`

## Go API

嵌入场景直接用引擎服务，不走 HTTP：`ProcessService`（定义/部署）、`RuntimeService`（实例/恢复）、`TaskService`（任务/审批动作）。用法见[引擎三分钟入门](/guide/getting-started/quickstart)。
