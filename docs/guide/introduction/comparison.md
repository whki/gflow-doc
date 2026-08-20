# 与其他方案对比

<div class="lead">
选型看三件事：中国式语义是否原生、技术栈是否匹配、模型是否可控。GFlow Engine 在这三点上都给出了不同的答案。
</div>

## 引擎层对比

图例：<b class="mk-yes">✓</b> 支持 · <b class="mk-part">△</b> 部分/需自行实现 · <b class="mk-no">✗</b> 不支持

| 维度 | GFlow Engine | Activiti / Flowable | 钉钉/飞书审批 |
|---|---|---|---|
| **中国式审批语义**（会签/加签/退回/转办/委托/撤回） | <b class="mk-yes">✓</b> 原生一等公民 | <b class="mk-part">△</b> 需扩展开发 | <b class="mk-yes">✓</b> 支持 |
| **规则引擎联动**（流程即规则链，automation 调任意链） | <b class="mk-yes">✓</b> 原生 | <b class="mk-no">✗</b> 无 | <b class="mk-no">✗</b> 无 |
| **AI 审批**（aiAgent 节点） | <b class="mk-yes">✓</b> 内置 | <b class="mk-part">△</b> 自行集成 | <b class="mk-part">△</b> 有限 |
| **多租户** | <b class="mk-yes">✓</b> 全链路 tenant_id | <b class="mk-part">△</b> 自行实现 | <b class="mk-yes">✓</b> 平台级 |
| **嵌入现有系统**（库 + 7 张表） | <b class="mk-yes">✓</b> 引一个库 | <b class="mk-no">✗</b> 重中间件 | <b class="mk-no">✗</b> 不可嵌入 |
| **部署形态** | <b class="mk-yes">✓</b> 单二进制，无必须中间件 | <b class="mk-part">△</b> JVM 应用 | — SaaS |
| 流程定义格式 | RuleGo 规则链 DSL（JSON） | BPMN 2.0 XML | 闭源 |
| 技术栈 | Go | Java | SaaS 闭源 |

## 为什么不解析 BPMN 2.0 XML

BPMN 是为「画图」设计的标准，而中国式审批的核心是**任务语义**（加签的父子链、会签的规则、退回的快照回带）。GFlow Engine 直接以 JSON 描述节点与连线，把审批语义放在节点 `configuration` 里：

- 少一层 XML↔对象模型的转换，DSL 即存储格式，所见即所得；
- 与 RuleGo 规则链完全同构，网关/并行/包容分支直接复用规则引擎的原生节点；
- 前端设计器（树形可视化）与 DSL 之间无信息损耗。

## 为什么表这么少

 Activiti 全家桶动辄二三十张表；GFlow Engine 只有 7 张。原因见[数据模型：为什么只有 7 张表](/guide/data-model/)——任务间的先后关系不需要「转移表」来记录，它就编码在规则链的连线里；候选人解析不需要冗余展开表，存原始引用、查询时经身份服务展开即可。

## 与 gflow 商业版的关系

引擎开源免费（Apache-2.0），平台商用明码。简单说：**把引擎嵌进自己系统，免费；要一个能直接给业务管理员用的完整平台，一次付费拿全部源码**（流程/表单/规则链三大设计器 + 智能体 + 前端应用），详见[价格](/pricing)。
