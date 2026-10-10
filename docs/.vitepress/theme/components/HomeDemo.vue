<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const DEMO_URL = 'http://8.134.32.225:8081'

const { isEn } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        head: {
          title: 'Watch GFlow run end to end',
          desc: 'Start an expense request, watch the amount pick the approval chain, the manager and finance sign in turn, and the admin dashboard close the loop — recorded live from the demo environment.',
        },
        winUrl: 'GFlow · Product demo',
        cta: 'Try it yourself in the live demo →',
      }
    : {
        head: {
          title: '看 GFlow 跑一遍',
          desc: '从发起报销、金额自动决定审批链，到部门经理与财务逐级审批，再到管理员效率看板——一条完整流程，真实环境实录。',
        },
        winUrl: 'GFlow · 产品演示',
        cta: '到演示环境亲手走一遍 →',
      }
)
</script>

<template>
  <section class="home-section dark-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 01 · Demo"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <div class="demo-frame">
        <!-- 窗口栏 -->
        <div class="win-bar">
          <span class="win-dot r"></span><span class="win-dot y"></span><span class="win-dot g"></span>
          <span class="win-url">{{ T.winUrl }}</span>
        </div>
        <video
          class="demo-video"
          controls
          preload="none"
          playsinline
          poster="/demo/poster.jpg"
          src="/demo/gflow-demo.mp4"
        ></video>
      </div>

      <div class="demo-cta">
        <a class="gf-btn gf-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener">{{ T.cta }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-frame {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #101c16;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.9);
}

.win-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  background: rgba(255, 255, 255, 0.045);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.win-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.win-dot.r { background: #e4584f; }
.win-dot.y { background: #e0a63e; }
.win-dot.g { background: #4fbf7e; }

.win-url {
  margin-left: 10px;
  font-family: var(--gf-mono);
  font-size: 12px;
  color: #7d8f84;
}

.demo-video {
  display: block;
  width: 100%;
  max-height: 66vh;
  background: #0b1512;
}

.demo-cta {
  margin-top: 30px;
  text-align: center;
}
</style>
