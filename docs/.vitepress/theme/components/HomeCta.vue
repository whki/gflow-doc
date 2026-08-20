<script setup lang="ts">
import { computed } from 'vue'
import SealStamp from './SealStamp.vue'
import { useI18n } from '../composables/useI18n'

const DEMO_URL = 'http://8.134.32.225:8081'

const { isEn, link } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        title: 'Enough reading — go stamp something',
        desc: 'The demo environment is a complete production build: log in with admin / admin123 and walk from form design to the final approval stamp — you will know exactly what ¥7,500 buys.',
        demo: 'Enter the live demo →',
        license: 'Commercial license details',
        code: 'Gitee source',
      }
    : {
        title: '别看了，去盖章',
        desc: '演示环境是一套完整成品：用 admin / admin123 登录，从表单设计到审批盖章走一遍，你会知道 7,500 元买到的是什么。',
        demo: '进入在线演示 →',
        license: '商业授权说明',
        code: 'Gitee 源码',
      }
)
</script>

<template>
  <section class="home-section dark-section" style="padding-bottom: 110px">
    <div class="home-inner">
      <div class="cta-box">
        <div class="cta-seal">
          <SealStamp :size="72" />
        </div>
        <h2 class="cta-title">{{ T.title }}</h2>
        <p class="cta-desc">{{ T.desc }}</p>
        <div class="cta-actions">
          <a class="gf-btn gf-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener">{{ T.demo }}</a>
          <a :href="link('/pricing')" class="gf-btn gf-btn-ghost">{{ T.license }}</a>
          <a class="gf-btn gf-btn-ghost" href="https://gitee.com/rulego/gflow-engine" target="_blank" rel="noopener">{{ T.code }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-seal {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
