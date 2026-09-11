# 节点说明

<div class="lead">
流程由节点组成：在画布上拖入节点、点击节点在右侧抽屉里配置。本文按"什么时候用、怎么配、运行时行为、注意什么"说明每类节点。
</div>

## BPM 审批节点

### 发起节点（起点）

流程的起点标记，由设计器自动生成。抽屉里可修改节点显示名称，并配置**发起范围**：全员可发起（默认）/ 指定成员 / 指定角色。范围由后端强校验——范围外的用户发起会被拒绝（403），发起页对应流程置灰；指定范围内不能为空，否则流程发布后无人能发起。

### 审批节点（userTask）

核心节点：流程走到这里时给审批人创建待办，审批通过才继续往下走。

**谁来审批（`approver`，七种类型）**：

| type | 说明 |
|---|---|
| `user` 指定成员 | `userIds` 固定名单，发布前必须选好人 |
| `role` 指定角色 | 运行时按 `roleIds` 展开成员，产生"待认领"任务 |
| `dept` 指定部门 | 运行时按 `deptIds` 展开成员，产生"待认领"任务 |
| `manager` 直属主管 | 发起人的第 `levels` 级主管（默认 1 级）；**组织层级不足时流程失败**，不会静默跳过 |
| `multiLevelManager` 多级主管 | `levels > 0` 固定审批到第 N 级；`levels < 0` 逐级向上直到最上层（组织到顶自然停止） |
| `initiatorSelect` 发起人自选 | `expression` 为表达式模板（如 `${msg.selectedUsers}`），发起时从流程变量解析审批人，必须至少解析出 1 人，支持多选 |
| `initiatorSelf` 发起人本人 | 审批人就是发起人自己 |

**多人怎么算过（`approveMode`）**：`single` 单人（缺省）/ `any` 或签（任一通过）/ `all` 会签（全员通过，一票否决）/ `sequential` 顺序审批（按顺序逐个审）/ `vote` 票签（按 `voteRule` 阈值通过：`majority` 过半 / `percent` 百分比 / `count` 固定票数，未配时按过半）。详见[审批语义](/guide/features/approval-semantics)。

**其他配置**：

- 超时（`timeout`）：`dueInMinutes` 截止时长 + `action` 逾期动作（`remind` 提醒 / `autoApprove` 自动通过 / `autoReject` 自动拒绝），相对每个任务创建时刻计时，由平台逾期巡检统一处理
- 驳回（`reject`）：`strategy` 取 `terminate` 终止流程（缺省）/ `toStarter` 回发起人 / `toPrev` 上一节点 / `toNode` 指定节点（配 `target`）；跳转目标不可达时按节点 Reject/Failure 出边兜底，无出边则终止
- 自审（`selfApproval`）：审批人恰好是发起人时——`none` 不过滤（缺省）/ `skip` 移除发起人 / `autoApprove` 保留发起人 / `delegateToManager` 转交直接上级 / `delegateToDeptManager` 转交部门负责人
- 字段权限：控制该审批人对表单字段的 可编辑 / 只读 / 隐藏（提交时只读和隐藏字段不会被覆盖）
- 动作权限：转办、委派、加签、退回、催办等按钮的显隐

### 抄送节点（ccTask）

把流程知会给相关人员，**不阻塞流程**。抄送名单 `ccUserIds` 支持两种写法：静态 userId 列表；或 `${msg.xxx}` 表单变量表达式模板项——发起时按流程变量求值，结果为字符串取单值、为数组则自动摊平逐个抄送（如 `"${msg.ccList}"`，由发起人在发起页决定抄给谁，名单为空时不抄送）。

**表单权限**：控制抄送人查看详情时能看到的表单字段（只读 / 隐藏，默认全部只读）。抄送是知会性质，没有"编辑"语义。

### AI 智能体节点（aiAgent）

调用智能体对申请做初审：按输出末尾的 `AI_DECISION` 标记自动路由，判定不出来或调用失败时**默认转人工兜底**（给兜底负责人建待办，人工同意后流程继续，不会重复调用 AI）。上下文（表单/附件/流程信息/前序意见/发起人）按勾选拼装，完整 AI 输出始终保留在流程变量 `_ai` 供人查看。详见[智能体（AI 审批）](/guide/features/ai-approval)。

## 系统动作节点

### HTTP 调用（httpCall）

流程中同步调用外部接口（查物流、查汇率等）。

- 地址、请求头、请求体都支持 `${msg.字段}` 变量，输入框上方可点击插入表单字段
- **请求失败（超时 / 非 2xx）会终止整个流程实例，无自动重试**——调不稳定的第三方接口请谨慎
- 响应合并两个配置：
  - **输出模式（`flattenOutput`）**：隔离（缺省，完整响应只放在流程变量 `_http`，不碰表单）/ 平铺（写 `true`，响应顶层字段并入流程变量，**与表单同名的字段会覆盖申请人填写的内容**，查接口补数据时常用）
  - **字段映射（`outputMappings`）**：把响应字段提取成指定流程变量，两种模式下都生效、优先级最高

### 服务任务（serviceTask）

调用平台注册的 Go 函数（如查征信、算评分）。选中函数后参数表单按函数声明自动渲染，文本参数支持 `${msg.字段}` 模板并可点击插入变量。函数执行失败会终止整个流程实例。函数由平台开发者注册，集成方注册方法见[引擎文档·服务任务函数注册](https://github.com/rulego/gflow-engine)。

### 自动化（automation）

触发一条自动化规则链（发通知、写日志等），**触发后不等结果、不回流输出**。注意：目标链触发失败会终止整个流程实例，请确保所选自动化稳定可用；已选目标被下线时抽屉会提示。

### 子流程（subProcess）

启动另一条已发布流程作为子流程：**主流程在此挂起**，等子流程实例走完后继续。候选列表为当前租户激活中的流程（自动排除当前流程自身，防止自引用）；流程变量默认全部传入子实例。

### 延迟（delay）

流程在此挂起指定时长后自动继续。

## 分支与汇聚

- **条件分支**：自上而下匹配条件，命中即走对应分支；条件字段支持自动联想（表单字段 + 流程实例 ID / 发起人等内置变量）。"默认分支"只能设在末位分支
- **路由**：一个节点上配置多组"或/且"条件路由，条件字段联想同上
- **并行分支（fork）/ 包容分支（inclusive）**：多路同时或按条件执行
- **合流（join）**：等待并行分支完成后汇聚；并行/汇聚存在边界限制（如部分分支失败时的行为），详见引擎仓库文档 parallel-limitations

## 连线与分支（DSL 视角）

```json
{ "fromId": "node_s1", "toId": "node_manager_approval", "type": "manager_approval" }
```

- `switch` 之后：`type` = 命中的分支名
- 审批/服务节点之后：`Success` / `Failure`（拒绝时优先按节点 `reject` 驳回配置跳转，跳转失败才落到 `Failure` 出边）
- 分支汇合处用 `join` 节点；每条 DSL 必须有可达的 `end` 节点（设计器与部署都会自动补全）

## 附录：userTask 引擎字段速查

面向直接编写 DSL 的开发者；设计器保存时会同时写入 `setType`/`examineMode` 等前端字段，引擎只读下列字段，二者并存互不干扰。

```json
{
  "id": "node_manager_approval",
  "type": "userTask",
  "name": "经理审批",
  "configuration": {
    "taskName": "经理审批",
    "approver": { "type": "user", "userIds": ["480356539643727872"] },
    "approveMode": "single",
    "selfApproval": "none",
    "reject": { "strategy": "toStarter" },
    "timeout": { "dueInMinutes": 60, "action": "remind" }
  },
  "additionalInfo": {
    "actionPermissions": { "transfer": true, "return": true, "addSign": true, "urge": true },
    "formPermissions": { "field1": "r", "field2": "w", "field3": "h" }
  }
}
```

- `approver`：审批人，`type` 取 `user` / `role` / `dept` / `manager` / `multiLevelManager` / `initiatorSelect` / `initiatorSelf`，按类型消费 `userIds` / `roleIds` / `deptIds` / `levels`（`manager` 取第 N 级；`multiLevelManager` 正数固定到第 N 级、负数直到最上层）/ `expression`（`initiatorSelect` 填 `${msg.xxx}` 表达式模板，gflow 写 `${msg.selectedUsers}`）
- `approveMode`：`single`（缺省）/ `any` / `all` / `sequential` / `vote`；`vote` 配 `voteRule`：`{ "type": "majority|percent|count", "value": N }`（percent 取 0~100，count 为票数，majority 不消费 value，缺省按过半）
- `selfApproval`：`none`（缺省）/ `skip` / `autoApprove` / `delegateToManager` / `delegateToDeptManager`
- `reject`：`{ "strategy": "terminate|toStarter|toPrev|toNode", "target": "nodeId" }`，`terminate` 缺省；`toNode` 必填 `target`（链中存在的节点 ID），目标不可达按 Reject/Failure 出边兜底
- `timeout`：`{ "dueInMinutes": 60, "action": "remind|autoApprove|autoReject" }`，相对每个任务创建时刻计时，由宿主逾期巡检执行
- 部署/更新时配置非法（未知取值、必填缺失、互斥组合）会被直接拒绝并给出节点级错误信息

更多见[流程 DSL 规范](/guide/dsl)。
