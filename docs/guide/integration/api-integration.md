# 外部系统对接指南

<div class="lead">
把 GFlow 的审批能力嵌进你自己的系统：服务账号认证、幂等发起、审批闭环、webhook 终态推送、客户端代码生成——服务间对接的全部环节，本页一次讲清。端点速查见 [REST API](/guide/api)。
</div>

## 三种集成形态

| 形态 | 做法 | 适合 |
| --- | --- | --- |
| **服务间 API 集成** | 你的后端服务调 GFlow REST API 发起流程、驱动审批、接收终态事件 | ERP / OA / CRM 等业务系统把审批环节交给 GFlow，用户无感 |
| **免登直达** | 用户在你系统里点链接，免登录直达 GFlow 审批单 | 人审发生在 GFlow 界面，入口留在你的系统或 IM |
| **身份源同步** | GFlow 定时拉取你系统的组织架构快照，自动建绑定 | 账号体系在客户自建系统，不在钉钉 / 企微 / 飞书 |

- **服务间 API 集成**：本页主线，认证、幂等、审批闭环、终态感知、排错、代码生成依次展开。
- **免登直达**：IM 卡片免登与 SSO JWT 互信见[IM 工作通知与免登审批](/guide/features/im-notify)。
- **身份源同步**：通用身份源（组织快照接口契约）同样见[IM 工作通知与免登审批](/guide/features/im-notify)末两节。
- 表单留在自己系统、发起时 iframe 嵌入：见[外部表单接入](/guide/features/external-form)。

## 认证：三选一

三种凭证按调用方性质选择，最终都换得同一个 JWT，后续请求带 `Authorization: Bearer <token>`，与 GFlow 界面使用完全相同的 API 与权限体系。

| 方式 | 调用方 | 换发接口 | 说明 |
| --- | --- | --- | --- |
| 账密登录 | 快速验证、脚本 | `POST /api/v1/auth/login` | 响应 token 在 `data.token`；不适合无人值守服务长期持有 |
| JWT 互信 | 有用户体系的 Web 系统 | `POST /api/v1/auth/exchange/trusted`（body：`external_jwt`） | 替**已登录的真实用户**操作 GFlow |
| **API-Key** | 无人值守的服务账号（推荐） | `POST /api/v1/auth/exchange/api-key` | 见下节，服务间集成的标准姿势 |

### 账密登录

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "svc_order", "password": "…" }'
# → data.token / data.refreshToken
```

验证码字段可选（部署开启验证码且该接口被要求校验时才必填）。token 过期用 `POST /api/v1/auth/refresh` 换新（旧 token 放 Authorization 头，过期后宽限期内仍可刷新）。

### JWT 互信

你的系统用 **RS256 私钥**签发一个短期 JWT，GFlow 用录入的公钥验签后换发登录态。签发规则：

- 签名算法 RS256（非对称，GFlow 只持公钥，私钥不出你的系统）；
- `sub` = 用户 ID（与 GFlow 用户绑定关系对应）；
- `aud` = `gflow`；
- 有效期 **≤ 5 分钟**——短票据、一次性消费，泄露窗口极小；
- 换发：`POST /api/v1/auth/exchange/trusted`，请求体 `{"external_jwt": "<你签发的JWT>"}`。

公钥录入入口（「SSO JWT 互信」卡片）与绑定优先级见[IM 工作通知与免登审批](/guide/features/im-notify)。JWT 互信面向「替某个真实用户操作」的场景；无人值守的服务账号请用 API-Key。

### API-Key（服务账号）

服务间集成的推荐方式：一个 key 一个服务身份，不共享密码、可独立停用。

**创建**：系统管理 → 集成配置 → API-Key → 创建（Webhook 与 API-Key 是「集成配置」页内的两个平台级区块，仅系统管理员可见）。填名称、绑定一个服务用户，创建成功返回 `gk_` 前缀的完整 key——**明文只显示这一次**，请立即存入你的密钥管理（列表页此后只展示前缀、绑定用户与启停状态）。

**换发 token**：

```bash
curl -X POST http://localhost:8080/api/v1/auth/exchange/api-key \
  -H "Content-Type: application/json" \
  -d '{ "apiKey": "gk_xxxxxxxxxxxxxxxxxxxxxxx" }'
# → data.token（按平台 token 有效期签发，到期重新换发即可）
```

**权限模型**：API-Key 的权限 = 绑定用户的角色权限，不引入独立 scope。给服务账号建**专用角色**，只勾它需要的权限码——典型审批服务账号三枚即可：

| 权限码 | 能做什么 |
| --- | --- |
| `workflow:instance:start` | 发起 / 代发起实例 |
| `approval:operate` | 通过 / 驳回 / 转办 / 加减签等审批动作 |
| `workflow:instance:view` | 查实例与我的待办（`/todo` 端点；也可用 `approval:todo` 与该端点配对授权） |

**代表谁行事（重要边界）**：API-Key 是机器凭证，换发的 token 身份 = 绑定的服务用户，**只能办理该用户名下的待办**（审批动作有任务归属校验）。需要代表不同自然人各自审批时，不要为每人建 key，改用上方 **JWT 互信**——按人签发短期 JWT 换 token，天然支持任意用户且时效仅 5 分钟；偶发替办可用持 `workflow:task:proxy` 的账号调 `proxy-approve` / `proxy-reject`（代替任务当前办理人，审计记原办理人与代审标记）。

**安全语义**：key 明文不落库（只存哈希）；连续错误的 key 会被锁定（防爆破）；key 可随时停用或删除，绑定用户被停用时换发立即失败。

**管理 API**（权限 `system:config:list` / `system:config:edit`）：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/integrations/api-keys` | 列表（只显前缀与绑定用户，不回明文） |
| POST | `/api/v1/integrations/api-keys` | 创建（body：`name` / `userId` / `expiresAt?`；**响应返回完整 key，仅此一次**。建议设置 `expiresAt` 有效期，到期自动失效） |
| PUT | `/api/v1/integrations/api-keys/{id}` | 启停 / 改名 / 调整有效期（停用后已换发的 token 也立即失效） |
| DELETE | `/api/v1/integrations/api-keys/{id}` | 删除 |

## 发起与幂等

```bash
curl -X POST http://localhost:8080/api/v1/workflow/process-instances/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processKey": "purchase_order",
    "businessKey": "PO-20261010-0001",
    "variables": { "amount": 58000, "supplier": "华信科技" }
  }'
# → { "code": 200, "data": { "instanceId": "7459…", "duplicated": false } }
```

`businessKey` 是你的业务单号（采购单号 / 报销单号…），是两个系统对同一张单的对账锚点。发起语义：

| 场景 | 结果 |
| --- | --- |
| 同流程定义 + 同 `businessKey` 再次发起 | **HTTP 200 幂等返回**：`instanceId` 与首次相同、`duplicated: true`，不产生新实例 |
| 不同流程定义撞同一 `businessKey` | **HTTP 409**：businessKey 在同租户内被另一流程的在途实例占用，属于配置错误，明确报错而非静默吞并 |
| `businessKey` 留空 | 系统自动生成，天然唯一，不参与幂等 |
| 实例到达终态（通过 / 终止 / 拒绝 / 撤回…） | **终态宽限窗口内**（默认 24 小时，可配）同 `businessKey` 再次发起仍幂等返回既有终态实例（`instanceStatus` 携带其终态），防止外部系统延迟重试开出第二张审批单；窗口过后 `businessKey` 随归档释放，同一单号可发起新实例 |

**代员工发起（`startUserId`）**——外部系统代替员工提单的标准姿势：员工在你的系统里提交单据，你的后端用服务账号 key 发起时带上 `startUserId`（该员工在 GFlow 里的用户 ID）：

```bash
curl -X POST http://localhost:8080/api/v1/workflow/process-instances/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processKey": "expense",
    "businessKey": "EXP-20261010-0042",
    "startUserId": "10001",
    "variables": { "amount": 480, "reason": "客户拜访差旅" }
  }'
```

实例的发起人 = 该员工：审批链按「发起人的直属主管」等规则正确路由，时间轴 / 抄送 / 我的申请都归到他名下；服务账号只是经手人。前提：服务账号角色持 `workflow:instance:start`（三枚推荐权限码之一），且被指定用户存在、同租户、处于启用状态。留空 `startUserId` 时以服务账号自己为发起人（适用于与个人无关的单据类流程）。

幂等返回让「网络超时重试」「消息队列重放」都安全：拿不准第一次发起有没有成功，**直接再发一次**，以响应里的 `instanceId` 为准继续后续逻辑，不需要先查后发。

## 审批闭环

服务账号驱动审批的典型循环：**查待办 → 执行动作 → 感知终态**。

**查我的待办**（推荐路线，与 Java demo 一致）：

| 方法 | 路径 | 权限 | 响应要点 |
| --- | --- | --- | --- |
| GET | `/api/v1/workflow/process-instances/todo` | `workflow:instance:view` 或 `approval:todo` | `data.items[]`，每项为一条进行中实例并附 `currentUserTaskId`（当前用户名下的待办任务 ID，执行审批动作直接用它）；候选待签收项另带 `needsClaim: true`，须先 `claim` 再审批 |

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/workflow/process-instances/todo?page=1&pageSize=50"
# → data.items[]：[ { "id": "实例ID", "businessKey": "…", "currentUserTaskId": "任务ID", … } ]
```

所有列表端点的分页响应形状统一为 `data: { items, total, page, pageSize, pages }`（`items` 为数组，`page` 从 1 起，请求参数同名 `page` / `pageSize`）。

也可按任务维度过滤：`GET /api/v1/workflow/tasks`（权限 `workflow:task:view`），可用过滤参数含 `assignee`（办理人）、`instanceStatus`（实例状态桶，如 active / completed）、`queryHistory`（查历史归档任务）、`dueDateBefore`（到期时间早于）：

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/workflow/tasks?assignee=svc_order"
```

按业务单号查实例状态（businessKey 对账、终态轮询兜底）：

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/workflow/process-instances?businessKey=PO-20261010-0001"
```

常用审批动作（均挂 `/api/v1/workflow/tasks`，权限 `approval:operate`；完整清单见 [REST API](/guide/api)）：

| 动作 | 端点 | body 要点 |
| --- | --- | --- |
| 通过 | `POST /{id}/approve` | `{ "comment": "同意" }` |
| 驳回 | `POST /{id}/reject` | `{ "comment": "…" }` |
| 退回上一已办节点 | `POST /{id}/return` | `{ "targetActivityId": "node_xxx", "reason": "…" }` |
| 转办 | `POST /{id}/transfer` | `{ "assigneeUserId": "u_lina", "reason": "…" }` |
| 委派 | `POST /{id}/delegate` | `{ "assigneeUserId": "…", "reason": "…" }` |
| 归还委派 | `POST /{id}/resolve` | 无请求体 |
| 加签 / 减签 | `POST /{id}/add-sign` · `/{id}/reduce-sign` | `{ "assigneeUserIds": ["u_wangwu"], "reason": "…" }` |
| 签收 / 取消签收 | `POST /{id}/claim` · `/{id}/unclaim` | 无请求体（候选池抢单） |
| 催办 | `POST /urge/{id}` | 通知当前办理人尽快处理 |
| 撤回在途申请 | `POST /{id}/withdraw` | 申请人按任务定位实例并终止 |
| 收回自己的一票 | `POST /api/v1/workflow/process-instances/{id}/recall` | `{ "reason": "…" }`（收回语义见[审批动作指南](/guide/features/approval-actions)） |
| 管理员代审 | `POST /{id}/proxy-approve` · `/{id}/proxy-reject` | `{ "comment": "…" }`（comment 必填，权限 `workflow:task:proxy`） |

## 终态感知：三方案对比

你的系统怎么知道「这单批完了」？三个方案按需选择，可组合：

| 方案 | 原理 | 实时性 | 适用 |
| --- | --- | --- | --- |
| 轮询 | 定时调实例查询接口看状态 | 取决于轮询间隔 | 调用方无法暴露回调端点（如纯内网客户端），或对时效不敏感 |
| **Webhook 订阅** | GFlow 在实例到达终态等事件点**主动 POST 推送** | 秒级 | 服务间集成的推荐方案 |
| DSL `httpCall` | 在流程图指定位置放 HTTP 调用节点，流程推进到该节点即同步回调你的接口 | 与流程同步 | 回调点在流程编排内、且要把响应带回流程继续用（见[自动化编排](/guide/features/automation)） |

三者的边界：webhook 报「实例级终态事实」（面向事件），`httpCall` 是流程图里的一个执行步骤（面向编排），轮询是兜底手段。

### Webhook 订阅

**配置**：系统管理 → 集成配置 → Webhook → 添加（「集成配置」页内的平台级区块，仅系统管理员可见）。每个端点独立配置：名称、回调 URL、签名 secret、订阅事件集（勾选）、启停。

**事件集**：

| 事件 | 触发时机 | 载荷 `status` |
| --- | --- | --- |
| `instance.completed` | 实例审批通过完成 | `completed` |
| `instance.terminated` | 实例到达非完成终态 | `terminated` / `cancelled` / `failed`（终止、撤回、驳回级联等） |
| `task.assigned` | 新审批任务到达（量随审批数线性增长，确需感知中间待办时再订阅） | 任务所在实例状态 |

**推送协议**：`POST` 到你配置的 URL，JSON 载荷：

```json
{
  "event": "instance.completed",
  "eventId": "7f3a1c2e-5b64-4d8a-9f21-c0a8b7d6e5f4",
  "tenantId": "t_1001",
  "instanceId": "7459…",
  "businessKey": "PO-20261010-0001",
  "processKey": "purchase_order",
  "processName": "采购订单审批",
  "status": "completed",
  "operator": "u_finance_lao",
  "reason": "同意，按合同付款",
  "occurredAt": "2026-10-10T14:32:05+08:00"
}
```

以上为实例事件的基础 11 字段。另有 4 个条件字段，按事件类型出现：

| 字段 | 出现条件 | 含义 |
| --- | --- | --- |
| `source` | 仅 `instance.terminated`（可空） | 终止来源：`api`（接口终止）/ `withdraw`（发起人撤回）/ `reject`（驳回级联） |
| `taskId` | 仅 `task.assigned` | 新到达任务的 ID——对该任务执行审批动作用的就是它 |
| `taskName` | 仅 `task.assigned` | 任务名（通常为节点名） |
| `assignees` | 仅 `task.assigned` | 办理人用户 ID 数组 |

`eventId` 为裸 UUID，不要按前缀识别事件类型（事件类型看 `event` 字段）；仅管理页 `/{name}/test` 发出的测试事件为 `evt-test-` 前缀。

请求头：

| Header | 含义 |
| --- | --- |
| `X-GFlow-Event` | 事件类型（同载荷 `event`） |
| `X-GFlow-EventId` | 事件唯一 ID——**消费方按它幂等去重** |
| `X-GFlow-Timestamp` | 推送时间戳（Unix 秒，**参与签名**） |
| `X-GFlow-Signature` | `sha256=` + `hex(HMAC-SHA256(secret, timestamp + "." + 原始请求体))` |

**签名校验（消费方必做）**：对**时间戳头 + "." + 原始请求体字节**（不要先解析再序列化）重算 HMAC 比对，比较用常数时间比较；时间戳在签名面内，篡改即验签失败，建议同时校验与当前时差在 5 分钟内（防过期重放）：

```text
ts = headers["X-GFlow-Timestamp"]
if abs(now() - ts) > 300: return 401          # 时间戳超出 ±5 分钟容差，拒绝（防重放）
base = ts + "." + raw_body                     # 原始请求体字节，不要先解析再序列化
expected = "sha256=" + lowercase(hex(HMAC_SHA256(secret, base)))
if not constant_time_eq(expected, headers["X-GFlow-Signature"]):
    return 401   # 签名不符，拒绝处理
```

**投递语义**：

- **at-least-once**：投递失败自动重试，最多 3 次，由后台任务驱动，不阻塞审批主链路；4xx 永久错误（404/403 等，除 408/429）不重试直接终态化；
- 因此消费方必须**按 `X-GFlow-EventId`（或载荷 `eventId`）幂等去重**——收到重复事件是正常情况，处理一次即可；
- 每次投递的对端响应码与失败原因留存在投递日志中，重试耗尽的失败行可在管理页「投递记录」按原文手动重发；
- 回调 URL 仅接受 `http` / `https` 且解析到公网 IP 的地址（环回、内网地址与解析到内网的域名会被拒绝），拨号时还会按实际连接 IP 二次校验。

**管理 API**（权限 `system:config:list` / `system:config:edit`）：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/integrations/webhooks` | 端点列表（secret 只写不读） |
| PUT | `/api/v1/integrations/webhooks/{name}` | 创建 / 更新（URL、secret、事件集、启停） |
| DELETE | `/api/v1/integrations/webhooks/{name}` | 删除 |
| POST | `/api/v1/integrations/webhooks/{name}/test` | 发一条 `test` 测试事件，验证连通与签名链路 |
| GET | `/api/v1/integrations/webhook-deliveries` | 投递日志（按端点/状态过滤，含对端响应码与失败原因） |
| GET | `/api/v1/integrations/webhook-deliveries/{id}` | 单条投递详情（含推送载荷原文） |
| POST | `/api/v1/integrations/webhook-deliveries/{id}/redeliver` | 手动重发一次（失败/死信行的人工补偿通道） |

创建与更新走同一路径（按 `{name}` 是否已存在区分），细则：

- 请求体 `{ url, events, enabled, secret }`；
- `secret` 只写不读：**更新时留空 = 保留原值**；创建时必填，且不少于 16 字符；
- 端点名即路径中的 `{name}`：非空且不超过 32 字符；
- `url` 仅接受 `http` / `https` 地址，环回与内网地址会被拒绝。

## 错误码与排错

所有端点共用 `{code, data, message}` 信封，响应信封 `code` 与 HTTP 状态码同值（200 / 400 / 401 / 403 / 404 / 409 / 429 / 500），勿按 0 判成功：

| 现象 | 原因与处理 |
| --- | --- |
| `401` token 无效 / 过期 | 账密与 JWT 互信 token：`POST /api/v1/auth/refresh` 换新（宽限期内旧 token 可刷）；API-Key token：直接重新调 `exchange/api-key` 换发，无需 refresh |
| `401` API-Key 换发失败 | key 被停用 / 删除，或绑定用户被停用；连续输错会触发锁定，稍后再试或联系管理员 |
| `429` 登录 / 换发被限流 | 账密或 API-Key 连续错误 5 次触发锁定（15 分钟），稍后再试或联系管理员 |
| `403` 权限不足 | 服务账号专用角色漏配权限码：发起要 `workflow:instance:start`，审批动作要 `approval:operate`，查实例 / 待办要 `workflow:instance:view`（`/todo` 端点亦可用 `approval:todo`） |
| `409` 发起冲突 | 同 `businessKey` 被另一流程定义的进行中实例占用：换单号，或确认该单应走哪个流程 |
| webhook 收不到推送 | 确认端点已启用且勾选了对应事件；URL 为解析到公网 IP 的地址；先调 `/{name}/test` 验证连通；投递失败有重试，重试耗尽的失败行在管理页「投递记录」可查并手动重发 |
| webhook 签名校验不过 | 校验对象必须是**原始请求体字节**（解析再序列化会改变字节序列导致验签失败）；secret 与端点配置一致 |

## OpenAPI 客户端生成

部署配置 `server.swagger_enabled: true`（或环境变量 `GFLOW_SERVER_SWAGGER_ENABLED=true`）开启后：

- 浏览器打开 `/swagger/index.html` 在线调试全部接口；
- `GET /swagger/doc.json` 返回完整 OpenAPI 规范，直接喂给代码生成器。

```bash
# 安装一次
npm install @openapitools/openapi-generator-cli -g

# 生成 Java 客户端
openapi-generator-cli generate \
  -i http://gflow-host:8080/swagger/doc.json \
  -g java \
  -o gflow-java-client \
  --additional-properties=groupId=com.myco,artifactId=gflow-client,dateLibrary=java17

# 其他技术栈同理：-g go / -g typescript-axios / -g python …
```

生成的客户端内置认证、信封解析与全部端点签名，省去手写 HTTP 样板。生产环境默认关闭 swagger（规范会暴露完整 API 面），按需开启或在 CI 内网环境拉取 spec 后关闭。

## Java 示例

gflow 仓库 `examples/java-demo/`（Maven，JDK 17，仅依赖 `com.auth0:java-jwt` 与 JDK 自带 HttpClient）提供可运行参考实现：

- **PasswordLogin**：账密登录换发 token；
- **ApiKeyLogin**：API-Key 换发 token；
- **JwtTrustLogin**：RS256 签发 + `exchange/trusted` 换发；
- **StartInstanceDemo**：携带 `businessKey` 发起并连发两次，断言第二次 `duplicated: true`；
- **ApproveLoopDemo**：轮询 `/todo` 待办 → 通过，直至待办清空或实例终态；
- **WebhookReceiver**：内置 HTTP 服务接收推送，完成 `X-GFlow-Signature` 签名校验后处理载荷。

从认证到终态感知的完整链路照抄即可跑通。
