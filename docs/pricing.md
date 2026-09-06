---
sidebar: false
aside: false
---

<script setup>
// SealStamp 已在主题中全局注册
</script>

<div class="pricing-hero">
  <div class="pricing-title">
    <h1>开源免费，商用明码</h1>
    <div class="pricing-seal"><SealStamp :size="76" /></div>
  </div>
  <p>极风工作流平台 <s class="price-was">原价 ¥ 15,000</s> <b class="price-now">限时 5 折 ¥ 7,500</b> 一次性买断、源码交付——审批工作平台 + 规则编排平台 + 智能体平台，一套顶三套。<br/>GFlow Engine 引擎永久开源（Apache-2.0）——没有年费、没有按人数计费、没有功能黑箱、没有授权验证服务器。</p>
</div>

<div class="pricing-table-wrap">

<table class="price-table">
  <thead>
    <tr>
      <th style="width:46%">能力</th>
      <th style="width:27%">开源版 GFlow Engine</th>
      <th style="width:27%" class="col-paid">商业版 GFlow Platform<span class="pt-tag">推荐</span></th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="3" class="price-section-title">审批内核（两版相同）</td></tr>
    <tr><td>或签 / 会签（并行 · 顺序，全票 · 多数 · 比例 · 票数）</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>加签 / 减签 / 转办 / 委托 / 签收抢单</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>退回上一节点 / 退回发起人 / 撤回 / 挂起恢复 / 超时催办 / 抄送</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>条件 / 并行 / 包容分支（switch · fork · join · inclusive）</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>子流程 / 服务任务 / HTTP 调用 / 延迟等待 / aiAgent 节点</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>流程定义版本化 / 多租户 / REST API · Go API</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td colspan="3" class="price-section-title">四大自研设计器 / 智能体（商业版独有）</td></tr>
    <tr><td>流程设计器</td><td class="pt-no">— 手写流程 DSL</td><td class="pt-yes">✓ 树形可视化编排</td></tr>
    <tr><td>表单设计器</td><td class="pt-no">— 自行实现</td><td class="pt-yes">✓ gform-designer + 模板库</td></tr>
    <tr><td>规则链设计器</td><td class="pt-no">— 手写规则链 JSON</td><td class="pt-yes">✓ 可视化编排自动化规则链</td></tr>
    <tr><td>智能体（AI 审批）</td><td class="pt-no">— 自行实现</td><td class="pt-yes">✓ 模型 / 智能体 / 技能管理</td></tr>
    <tr><td colspan="3" class="price-section-title">产品化能力（商业版独有）</td></tr>
    <tr><td>前端应用</td><td class="pt-no">— 自行开发</td><td class="pt-yes">✓ 发起/待办/已办/抄送/统计/跟踪</td></tr>
    <tr><td>自动化编排界面</td><td class="pt-no">— 自行实现</td><td class="pt-yes">✓ 触发器 + HTTP/服务任务配置</td></tr>
    <tr><td>组织架构 / 用户 / 角色 / 岗位</td><td class="pt-no">— 自行实现 IdentityService</td><td class="pt-yes">✓ 完整后台</td></tr>
    <tr><td>监控 / 通知 / 操作审计</td><td class="pt-no">— 监听器回调自建</td><td class="pt-yes">✓ 内置</td></tr>
    <tr><td>多实例集群部署</td><td class="pt-no">— 锁 / 救援原语内嵌，编排自建</td><td class="pt-yes">✓ 双实例 active-active · 选主 / 自动救援 / 配置热生效</td></tr>
    <tr><td colspan="3" class="price-section-title">交付与服务</td></tr>
    <tr><td>许可证</td><td>Apache-2.0</td><td>商业授权（一次性）</td></tr>
    <tr><td>交付物</td><td>开源仓库</td><td>服务端 + 前端全部源码</td></tr>
    <tr><td>代码限制</td><td>无</td><td>无加密 / 无混淆 / 无验证服务器</td></tr>
    <tr><td>技术支持</td><td>社区 Issue</td><td>一年远程支持 · 工单响应</td></tr>
    <tr><td>价格</td><td><b>¥ 0</b></td><td class="col-paid"><s class="pt-was">¥ 15,000</s> <b>¥ 7,500 一次性</b><span class="pt-tag">限时 5 折</span></td></tr>
  </tbody>
</table>

<div class="price-actions">
  <a class="gf-btn gf-btn-primary" href="http://8.134.32.225:8081" target="_blank" rel="noopener">先逛演示环境 →</a>
  <a class="gf-btn gf-btn-ghost ghost-light" href="https://gitee.com/rulego/gflow-engine" target="_blank" rel="noopener">Gitee 获取源码</a>
</div>

</div>

## 常见问题

**Q：开源版能直接用吗？**

能。引擎、REST API、全部审批语义都开源。但你需要按 [DSL 规范](/guide/dsl)手写流程 JSON、自己实现 `IdentityService` 和前端页面——适合已有系统只想加审批能力的团队。

**Q：¥7,500 之后还有费用吗？**

没有。一次性买断，含一年技术支持。第二年起可自愿续保获取新版本优先支持；不续保，已交付的代码永久是你的。

**Q：限时 5 折持续到什么时候？**

折扣结束后恢复原价 ¥ 15,000。折扣期内完成购买即按 ¥ 7,500 一次性买断，已交付的授权与源码不受调价影响。

**Q：代码更新权限是怎样的？**

引擎（GFlow Engine）开源，代码永久免费更新。商业版购买后 12 个月内的平台版本更新免费获取（新功能 + 缺陷修复，同步开源引擎升级）；到期后可自愿续费继续获取平台更新。无论是否续费，已交付的代码永久归你、照常运行，只是不再收到平台新版本。

**Q：授权按什么计？服务器台数？用户数？**

都不按。一次授权，内部任意部署，不限实例数、不限用户数。

**Q：拿到的源码可以改吗？**

可以。改界面、改流程、改引擎都行——无加密、无混淆、无运行时授权校验，供应商消失系统照跑。

**Q：源码可以分发给客户或第三方吗？**

不可以。商业授权仅限购买方自身使用，源码不得对外分发。对外提供服务（SaaS、内部部署）完全不受影响——只要不把源码交付给你的客户。注意：若 A 购买后将源码分发给 B，则 B 也需要单独获得我们的授权。

**Q：能开发票吗？对公转账吗？**

可以，联系商务获取报价单与合同。

**Q：引擎以后升级，商业版跟得上吗？**

GFlow Platform 与 GFlow Engine 同内核演进，商业授权含引擎更新同步。

## 联系商务

- **演示环境**：<http://8.134.32.225:8081>（admin / admin123）
- **QQ**：[2215016127](tencent://message/?uin=2215016127&Site=&Menu=yes)
- **微信**：`rulegoteam`
- **邮箱**：[rulego@outlook.com](mailto:rulego@outlook.com)
- **Gitee**：[rulego/gflow-engine](https://gitee.com/rulego/gflow-engine)

> 添加烦请注明来意（GFlow 商业版采购 / 授权咨询）。

<style scoped>
/* 收紧 VitePress 内容容器的顶部内边距，页头印章与导航栏之间不留大段空白：
   内层 .container 之外，.VPDoc 自身还有 48px 顶部 padding，同样要覆盖 */
:global(.VPContent .container:has(.pricing-hero)) {
  padding-top: 8px;
}

:global(.VPDoc:has(.pricing-hero)) {
  padding-top: 12px;
}

/* VitePress 对无侧栏页面默认 .container 1104px / .content 784px，
   会把对比表压到 744px 导致大量换行，这里放开到与表格同宽 */
:global(.VPDoc:has(.pricing-hero) .container) {
  max-width: 1280px !important;
}

:global(.VPDoc:has(.pricing-hero) .content) {
  max-width: 100% !important;
}

.pricing-hero {
  text-align: center;
  padding: 4px 20px 0;
}

.pricing-hero h1 {
  font-family: var(--gf-serif);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 900;
  margin: 6px 0 12px;
}

/* 印章贴在标题右上角，不单独占一行 */
.pricing-title {
  position: relative;
  display: inline-block;
}

.pricing-seal {
  position: absolute;
  top: -22px;
  right: -92px;
  opacity: 0.9;
}

@media (max-width: 820px) {
  .pricing-seal {
    display: none;
  }
}

.pricing-hero p {
  font-size: 15.5px;
  line-height: 1.9;
  opacity: 0.72;
  margin: 0 auto 8px;
  max-width: 860px;
}

/* hero 划线原价 + 折扣价（折扣价提亮、加深，跳出段落灰） */
.price-was {
  color: #8a8577;
}

.price-now {
  color: var(--gf-seal);
  font-size: 17px;
}

/* 对比表价格行：原价划线弱化，折扣价保持加粗印章红 */
.pt-was {
  font-weight: 400;
  color: #8a8577;
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(194, 55, 47, 0.55);
}

/* 对比表主体：拉宽到与视口协调的宽度，单元格不换行、压低总高 */
.pricing-table-wrap {
  max-width: 1240px;
  margin: 32px auto 56px;
  padding: 0 20px;
  overflow-x: auto;
}

.price-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

:global(h2) {
  font-family: var(--gf-serif);
}
</style>
