# 流程 DSL 规范

<div class="lead">
流程定义是一条 RuleGo 规则链：<code>{ruleChain, metadata}</code>。ruleChain 承载流程元信息与表单，metadata 描述节点与连线。不解析 BPMN 2.0 XML。
</div>

## 顶层结构

```json
{
  "ruleChain": {
    "id": "leave_approval",
    "name": "请假审批",
    "root": true,
    "debugMode": false,
    "additionalInfo": {
      "description": "员工请假审批流程",
      "category": "hr",
      "icon": "Calendar",
      "processType": "main",
      "formType": "design",
      "form": { "title": "请假申请单", "fields": [ /* 表单 schema */ ] }
    }
  },
  "metadata": {
    "firstNodeIndex": 0,
    "nodes": [ /* 节点数组 */ ],
    "connections": [ /* 连线数组 */ ]
  }
}
```

- `processType: main` 主流程 / `sub` 子流程
- 表单三态：`formType: "design"`（默认，内嵌 `form` schema）/ `formType: "system"` + `formKey` 引用 `forms` 表里的共享模板 / `formType: "external"` + `formUrl` 挂外部表单（iframe 只读展示）

## 节点

```json
{
  "id": "node_manager_approval",
  "type": "userTask",
  "name": "经理审批",
  "configuration": { /* 节点配置，因 type 而异 */ },
  "additionalInfo": {
    "description": "节点说明",
    "actionPermissions": { "transfer": true, "return": true, "addSign": true, "urge": true, "uploadAttachment": true },
    "formPermissions": { "field1": "r", "field2": "w", "field3": "h" },
    "layoutX": 300, "layoutY": 50
  }
}
```

各类型节点的 `configuration` 详见[节点类型总览](/guide/features/nodes)。

## 连线

```json
{ "fromId": "node_s1", "toId": "node_manager_approval", "type": "manager_approval" }
```

`type` 语义：

- **switch 之后**：命中的分支名（条件路由）
- **审批/服务/自动化节点之后**：`Success`（通过/成功）或 `Failure`（拒绝/失败）
- **fork/join**：并行分支的汇聚关系

::: warning
每条流程必须有可达的 `end` 节点，否则实例永不完结。gflow 设计器保存时会自动补全 end 节点，后端部署时也会把悬垂尾节点接到 end——手写 DSL 时需要自己保证。
:::

## 条件表达式

gflow 设计器的「条件分支」产出原生 `switch` 节点，`cases` 用 RuleGo EL 表达式对 `msg` 求值，自上而下命中即走对应分支，全不命中走 `Default` 出边：

```json
{
  "id": "node_s1",
  "type": "switch",
  "configuration": {
    "cases": [
      { "case": "msg.days <= 3", "then": "manager_approval" },
      { "case": "msg.days > 3", "then": "sequential_approval" }
    ]
  }
}
```

也可使用 `jsSwitch` 节点（内联 JS 返回分支名数组），效果等价：

```json
{
  "id": "node_s1",
  "type": "jsSwitch",
  "configuration": {
    "jsScript": "var days = parseInt(msg.days); if (days <= 3) { return ['manager_approval']; } return ['sequential_approval'];"
  }
}
```

可用变量：

| 变量 | 说明 |
|---|---|
| `msg.<field>` | 流程变量（发起表单字段 + 运行中新增变量） |
| `metadata.instance_id` | 实例 ID |
| `metadata.process_key` / `process_id` | 流程键 / 定义版本 ID |
| `metadata.business_key` | 业务键 |
| `metadata.owner` | 发起人 |
| `metadata.tenant_id` | 租户 ID |

## 表达式占位符

节点配置中 `${msg.xxx}` / `${metadata.xxx}` 在运行时解析，例如：

```json
{ "url": "https://erp.example.com/api/orders/${msg.businessKey}", "body": "单号${msg.businessKey}已通过审批" }
```

发起人自选审批人场景下，`userTask` 候选配置的 `selected` 也支持 `${msg.xxx}` 从流程变量解析。

## 会签规则

```json
{
  "approvalType": "countersign",
  "approvalRule": "{\"type\":\"majority\",\"isSequential\":true}"
}
```

`approvalType`（single / or / countersign / sequential / vote 等）与 `approvalRule`（`type: all / any / majority / percent / count` + `value` + `isSequential`）的完整对照表见[中国式审批语义](/guide/features/approval-semantics)。

## 完整示例

请假审批（或签 + 并行会签 + 顺序会签 + 服务任务）见仓库 `examples/leave_approval/dsl.json`；gflow 侧的成品 DSL 示例（含表单 schema、抄送、多级路由）见 `gflow/docs/demo/`：请假、报销、采购、用章申请，均可直接导入。
