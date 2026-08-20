<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn, link } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        title: 'Open source is free, commercial pricing is clear',
        desc: 'GFlow Engine is open source and free forever; the GFlow Workflow Platform is a limited-time 50% off at ¥7,500 (was ¥15,000) with source delivery — no annual subscription, no per-seat billing, no feature black boxes.',
        more: 'See the full pricing →',
        demo: 'Take the demo for a spin',
      }
    : {
        title: '开源免费，商用明码',
        desc: 'GFlow Engine 永久开源免费；GFlow 极风工作流平台限时 5 折 ¥7,500（原价 ¥15,000）源码交付——没有按年订阅、没有按人数计费、没有功能黑箱。',
        more: '查看完整价格说明 →',
        demo: '先逛逛演示环境',
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 07 · Pricing"
        :title="T.title"
        :desc="T.desc"
      />

      <div class="price-actions">
        <a :href="link('/pricing')" class="gf-btn gf-btn-primary">{{ T.more }}</a>
        <a class="gf-btn gf-btn-ghost ghost-light" href="http://8.134.32.225:8081" target="_blank" rel="noopener">{{ T.demo }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.price-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
