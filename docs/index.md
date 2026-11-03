---
layout: page
sidebar: false
aside: false
notice:
  version: v1.4.1
  date: 2026-11-03
  title: GFlow v1.4.1 发布
  items:
    - 审批流转全程留痕：转办、委派、改派、收回在时间轴与打印单保留每一任办理人
    - 审批消息直达 IM：钉钉 / 企业微信 / 飞书卡片一键免密办理，通讯录同步与免登打通
    - 开放外部系统集成：API-Key 凭证 + Webhook 事件推送，幂等发起、投递失败一键重发
    - 终态收回与任意上游退回：末节点审批人窗口期内整单重开，退回放宽到任意已完成节点
    - 表单快照与时间轴修改标记：提交时点可还原，字段修改前后值看得见
  link: /changelog
  linkText: 查看完整更新日志
---

<script setup>
import { onMounted } from 'vue'
</script>

<HomeHero />
<HomeDemo />
<HomeRepos />
<HomeCapabilities />
<HomeProducts />
<HomePreview />
<HomeShots />
<HomeDataModel />
<HomeArchitecture />
<HomeQuickstart />
<HomePricingTeaser />
<HomeCta />

<style scoped>
:global(.main .container) {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

:global(.content) {
  padding: 0 !important;
  padding-bottom: 0 !important;
}

:global(.content-container) {
  max-width: 100% !important;
}
</style>
