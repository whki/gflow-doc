---
layout: page
sidebar: false
aside: false
notice:
  version: v1.2.0
  date: 2026-09-14
  title: GFlow v1.2.0 发布
  items:
    - 审批节点配置重构：审批人、审批方式、找不到审批人、驳回规则，统一在一处配置
    - 发起和审批时，可提前看到后续每个环节由谁来审批
    - 新增移动端：手机上直接发起申请、处理审批、查看进度
    - 审批中心收件箱式改版：待办 / 已办 / 我发起的 / 抄送我集中处理
    - AI 审批支持读取附件，图片和文档都能识别
  link: /changelog
  linkText: 查看完整更新日志
---

<script setup>
import { onMounted } from 'vue'
</script>

<HomeHero />
<HomeRepos />
<HomeCapabilities />
<HomeProducts />
<HomePreview />
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
