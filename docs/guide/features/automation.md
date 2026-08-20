# 自动化编排

<div class="lead">
审批不只是「人点通过」。automation 节点调用 RuleGo 规则链，把审批通过后的入账、开权限、发通知、写第三方系统全部自动化——这就是流程即规则链的威力。
</div>

## automation 节点

调用任意 RuleGo 规则链（`flow` 为兼容别名）。规则链里可用的节点生态全部可用：数据库写入、消息队列、邮件、脚本转换、HTTP…… 在 gflow 里用**规则链设计器**（商业版四大自研部件之一）可视化编排这些能力，不用手写规则链 JSON。

```json
{
  "id": "node_auto_1",
  "type": "automation",
  "name": "报销自动入账",
  "configuration": {
    "targetId": "expense_auto_book"
  }
}
```

`targetId` 为目标规则链 ID（`flow` 为旧版别名）。触发是**非阻塞**的：节点发起调用即成功向下流转，不等规则链执行结果。

## 服务任务 serviceTask

无需规则链，直接调用 Go 函数（经 `components.Services.Register` 注册，内部委托 `action.Functions`；gflow 内置 `test` / `genSerialNo` 两个演示函数，业务函数由宿主应用注册）：

```go
// 宿主应用注册函数（元数据 + 实现一起声明，设计器按 Def 动态渲染参数表单）
components.Services.Register(components.ServiceFuncDef{
    Name:  "sendApprovalNotification", // 即节点 functionName 取值
    Label: "发送审批通知",
}, func(ctx rulegoTypes.RuleContext, msg rulegoTypes.RuleMsg) {
    // ...
})
```

```json
{ "type": "serviceTask", "configuration": { "functionName": "sendApprovalNotification", "param": { "channel": "wecom" } } }
```

## HTTP 调用 httpCall

同步请求外部接口，响应按映射合并进流程变量（`from` 取响应字段，`to` 写入 `msg.Data` 顶层或 `metadata.k`）：

```json
{
  "type": "httpCall",
  "configuration": {
    "method": "POST",
    "url": "https://erp.internal/api/expense",
    "body": "报销单 ${metadata.business_key}，金额 ${msg.amount}，已通过审批",
    "headers": { "X-Api-Version": "2" },
    "timeoutMs": 10000,
    "outputMappings": [{ "from": "data.orderNo", "to": "erpOrderNo" }]
  }
}
```

## 子流程 subProcess

启动独立子流程实例（`wf_instance.parent_id` 关联），子流程结束后回到主流程继续：

- 大流程拆模块：主「采购申请」挂子「合同审批」「入库验收」
- 子流程有自己的表单与审批人，闭环后把结果变量带回主流程

## 延迟等待

到达节点后挂起等待指定时长再继续（如「试用期转正流程：入职后 90 天自动发起评估」）。

## 场景选型

| 业务时刻 | 推荐节点 | 典型例子 |
|---|---|---|
| 批完后执行一组系统动作（多步、可复用、要可视化维护） | `automation` | 报销通过后：生成单号 → 写费控系统 → 发企微通知，整段编成一条规则链 |
| 平台/宿主内置的轻量 Go 能力 | `serviceTask` | 内置 `genSerialNo` 生成业务单号；宿主注册的查征信、算评分 |
| 调外部 HTTP，且要把响应带回流程继续用 | `httpCall` | 采购通过后调 ERP 下单，返回的 `orderNo` 映射进流程变量供后续节点读取 |
| 审批里还要嵌一段独立审批闭环 | `subProcess` | 采购主流程挂「合同会签」子流程，有自己的表单与审批人，走完回主流程 |
| 走到某节点需要等一段时间 | `delay` | 试用期转正：入职 90 天后自动继续到评估节点 |
| 按任务生命周期驱动通知/审计（非节点） | 事件回调 | `TaskEventListener` 写站内通知与审计日志，Webhook 回写由宿主扩展 |

选型口诀：**动作复用选 automation，进程内轻量选 serviceTask，要拿外部结果选 httpCall，还要人审选 subProcess，要等时间选 delay**。

## 典型组合

```
发起 → 直属主管 → 条件分支
                      ├─ msg.amount ≤ 5000 → automation(入账) → 抄送财务 → 结束
                      └─ 默认 → 部门经理会签 → aiAgent(风险预审)
                                   ├─ low  → automation(入账)   → 结束
                                   └─ high → 财务总监 → httpCall(ERP) → 结束
```

时间维度的组合（试用期转正）：

```
发起(入职) → HR 审批 → delay(90 天) → 直属主管(转正评估)
                         ├─ 通过 → httpCall(开通 IT 账号) → automation(同步花名册 + 通知) → 结束
                         └─ 驳回(rejectToStarter) → 发起人修改后重新提交
```

## 事件回调

gflow 把任务生命周期事件（分配/完成/拒绝等）经 `TaskEventListener` 分发给宿主应用，内置站内通知与审计日志；需要 Webhook 回写业务系统或事件触发规则链时，宿主在监听器里自行扩展。
