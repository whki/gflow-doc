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
          title: 'A WYSIWYG tree-style designer',
          desc: 'Our in-house process designer: tree structure, node drawers, conditional branches with automatic default routes — business admins write zero code. The form designer is built on the same stack.',
        },
        winUrl: 'GFlow · Process Designer / Expense Approval',
        shotAlt: 'GFlow process designer — expense approval flow with the approver drawer open',
        cta: 'Drag your own process in the live demo →',
      }
    : {
        head: {
          title: '所见即所得的树形设计器',
          desc: '自研流程设计器：树形结构、节点抽屉、条件分支自动带默认路由，业务管理员不写一行代码。表单设计器同源自研。',
        },
        winUrl: 'GFlow · 流程设计器 / 费用报销申请',
        shotAlt: 'GFlow 流程设计器 —— 费用报销审批流，右侧为节点配置抽屉',
        cta: '到演示环境亲手拖一个流程 →',
      }
)
</script>

<template>
  <section class="home-section dark-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 03 · Designer"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <div class="designer-frame">
        <!-- 窗口栏 -->
        <div class="win-bar">
          <span class="win-dot r"></span><span class="win-dot y"></span><span class="win-dot g"></span>
          <span class="win-url">{{ T.winUrl }}</span>
        </div>

        <!-- 线上演示环境真实截图 -->
        <div class="shot">
          <img
            class="shot-img"
            src="/designer-light.png"
            :alt="T.shotAlt"
            loading="lazy"
          />
        </div>
      </div>

      <div class="preview-cta">
        <a class="gf-btn gf-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener">{{ T.cta }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.designer-frame {
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

.shot {
  display: flex;
  justify-content: center;
  line-height: 0;
  background: #f5f7fa;
}

.shot-img {
  display: block;
  max-width: 100%;
  max-height: 60vh;
  width: auto;
  height: auto;
}

.preview-cta {
  margin-top: 30px;
  text-align: center;
}
</style>
