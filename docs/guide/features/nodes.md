# 节点说明

<div class="lead">
流程由节点组成：在画布上拖入节点、点击节点在右侧抽屉里配置。本文按"什么时候用、怎么配、运行时行为、注意什么"说明每类节点。
</div>

## BPM 审批节点

### 发起节点（起点）

流程的起点标记，由设计器自动生成。抽屉里可修改节点显示名称，并配置**发起范围**：全员可发起（默认）/ 指定成员 / 指定角色。范围由后端强校验——范围外的用户发起会被拒绝（403），发起页对应流程置灰；指定范围内不能为空，否则流程发布后无人能发起。

### 审批节点（userTask）

核心节点：流程走到这里时给审批人创建待办，审批通过才继续往下走。

**谁来审批（七种方式）**：

| 方式 | 说明 |
|---|---|
| 指定成员 | 固定名单，发布前必须选好人 |
| 指定角色 | 运行时按角色展开成员，产生"待认领"任务 |
| 指定部门 | 运行时按部门展开成员，产生"待认领"任务 |
| 直属主管 | 发起人的第 N 级主管（默认 1 级）；**组织层级不足时流程失败**，不会静默跳过 |
| 多级主管 | 第 1 到 N 级主管逐级全审；可选"直到最上层"（有几级审几级） |
| 发起人自选 | 发起人在发起页挑选审批人（必须至少选 1 人），支持多选 |
| 发起人本人 | 审批人就是发起人自己 |

**多人怎么算过（审批方式）**：单人 / 或签（任一通过） / 依次（按顺序逐个审） / 会签（全员通过） / 票签（达阈值通过，默认按百分比且未填时按 50%）。详见[审批语义](/guide/features/approval-semantics)。

**其他配置**：

- 驳回策略：终止流程 / 回发起人 / 上一节点 / 指定节点
- 自审策略：审批人恰好是发起人时——允许自审 / 自动跳过 / 转交主管 / 转交部门负责人
- 字段权限：控制该审批人对表单字段的 可编辑 / 只读 / 隐藏（提交时只读和隐藏字段不会被覆盖）
- 动作权限：转交、加签、退回、催办等按钮的显隐

### 抄送节点（ccTask）

把流程知会给相关人员，**不阻塞流程**。两种名单方式：固定成员；或"发起人自选"——发起人在发起页自行挑选（可跳过不抄送）。

**表单权限**：控制抄送人查看详情时能看到的表单字段（只读 / 隐藏，默认全部只读）。抄送是知会性质，没有"编辑"语义。

### AI 智能体节点（aiAgent）

调用智能体对申请做初审：按输出末尾的 `AI_DECISION` 标记自动路由，判定不出来或调用失败时**默认转人工兜底**（给兜底负责人建待办，人工同意后流程继续，不会重复调用 AI）。上下文（表单/附件/流程信息/前序意见/发起人）按勾选拼装，完整 AI 输出始终保留在流程变量 `_ai` 供人查看。详见[智能体（AI 审批）](/guide/features/ai-approval)。

## 系统动作节点

### HTTP 调用（httpCall）

流程中同步调用外部接口（查物流、查汇率等）。

- 地址、请求头、请求体都支持 `${msg.字段}` 变量，输入框上方可点击插入表单字段
- **请求失败（超时 / 非 2xx）会终止整个流程实例，无自动重试**——调不稳定的第三方接口请谨慎
- 响应合并两个配置：
  - **输出模式**：平铺到流程变量（默认，查接口补数据最常用；与表单同名的字段会覆盖申请人填写的内容）/ 隔离（完整响应只放在流程变量 `_http`，不碰表单）
  - **字段映射**：把响应字段提取成指定流程变量，两种模式下都生效、优先级最高

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
- 审批/服务节点之后：`Success` / `Failure`（拒绝时优先走 `rejectStrategy`，跳转失败才落到 `Failure` 出边）
- 分支汇合处用 `join` 节点；每条 DSL 必须有可达的 `end` 节点（设计器与部署都会自动补全）

## 附录：userTask 引擎字段速查

面向直接编写 DSL 的开发者；设计器保存时会同时写入 `setType`/`examineMode` 等前端字段，引擎只读下列字段，二者并存互不干扰。

```json
{
  "id": "node_manager_approval",
  "type": "userTask",
  "name": "经理审批",
  "configuration": {
    "candidateType": "user",
    "candidateConfig": { "userIds": ["480356539643727872"] },
    "approvalType": "single",
    "selfApprovalType": "allow",
    "rejectStrategy": "rejectToStarter"
  },
  "additionalInfo": {
    "actionPermissions": { "transfer": true, "return": true, "addSign": true, "urge": true },
    "formPermissions": { "field1": "r", "field2": "w", "field3": "h" }
  }
}
```

- `candidateType`：`user` / `role` / `dept` / `direct_manager` / `multi_level_manager` / `initiator_select` / `initiator_self`
- `candidateConfig`：按类型取 `userIds` / `roleIds` / `levels`（direct_manager 取第 N 级终点，multi_level_manager 逐级全审，负值表示到组织顶层）；`initiator_select` 场景 `selected` 支持 `${msg.xxx}` 从流程变量解析（gflow 写 `${msg.selectedUsers}`）
- `approvalType`：`single` / `or` / `sequential` / `countersign` / `vote`，配合 `approvalRule` 阈值
- `selfApprovalType`：`allow` / `skip` / `delegate_to_manager` / `delegate_to_department_manager`
- `rejectStrategy`：`terminate` / `rejectToStarter` / `rejectToPrev` / `rejectToNode`（配合 `rejectTargetNode`）

更多见[流程 DSL 规范](/guide/dsl)。
