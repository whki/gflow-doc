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
        contact: 'Contact us',
        wechat: 'WeChat',
        email: 'Email',
      }
    : {
        title: '别看了，去盖章',
        desc: '演示环境是一套完整成品：用 admin / admin123 登录，从表单设计到审批盖章走一遍，你会知道 7,500 元买到的是什么。',
        demo: '进入在线演示 →',
        license: '商业授权说明',
        code: 'Gitee 源码',
        contact: '联系商务',
        wechat: '微信',
        email: '邮箱',
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
        <div class="cta-contact">
          <span class="cc-label">{{ T.contact }}</span>
          <span class="cc-item">{{ T.wechat }} <b>rulegoteam</b></span>
          <span class="cc-dot">·</span>
          <a class="cc-item" href="mailto:rulego@outlook.com">{{ T.email }} <b>rulego@outlook.com</b></a>
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

.cta-contact {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 30px;
  font-size: 15px;
  color: rgba(255, 246, 238, 0.62);
  letter-spacing: 0.5px;
}

.cta-contact .cc-label {
  color: rgba(255, 246, 238, 0.45);
}

.cta-contact .cc-item {
  color: rgba(255, 246, 238, 0.86);
  text-decoration: none;
}

.cta-contact a.cc-item:hover b {
  color: #e8b64c;
}

.cta-contact .cc-item b {
  color: rgba(255, 246, 238, 0.95);
  font-weight: 600;
  transition: color 0.2s;
}

.cta-contact .cc-dot {
  color: rgba(255, 246, 238, 0.3);
}
</style>
