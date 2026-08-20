<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn } = useI18n()

const repos = computed(() => [
  {
    name: 'gflow-engine',
    cn: isEn.value ? 'GFlow Engine approval workflow engine' : 'GFlow Engine 审批工作流引擎',
    links: [
      { label: 'Gitee', url: 'https://gitee.com/rulego/gflow-engine' },
      { label: 'GitHub', url: 'https://github.com/rulego/gflow-engine' },
    ],
    license: 'Apache-2.0',
    desc: isEn.value
      ? 'An embeddable Go approval engine: a rule chain DSL is the process definition, 7 tables hold all runtime state — no separate workflow middleware needed.'
      : '可嵌入的 Go 审批引擎：规则链 DSL 即流程定义，7 张表管全部运行状态，无需独立流程中间件。',
    cmd: 'go get github.com/rulego/gflow-engine',
  },
  {
    name: 'RuleGo',
    cn: isEn.value ? 'The rule engine underneath' : '底层规则引擎',
    links: [
      { label: 'Gitee', url: 'https://gitee.com/rulego/rulego' },
      { label: 'GitHub', url: 'https://github.com/rulego/rulego' },
    ],
    license: 'Apache-2.0',
    desc: isEn.value
      ? 'A lightweight, high-performance, embeddable component-based Go rule engine — the shared foundation for orchestration, data cleansing and message routing.'
      : '轻量级、高性能、可嵌入的 Go 组态式规则引擎，流程编排、数据清洗、消息路由的统一底座。',
    cmd: 'go get github.com/rulego/rulego',
  },
])

const head = computed(() =>
  isEn.value
    ? {
        title: 'An open-source core, ready for commercial use',
        desc: 'The engine layer, GFlow Engine, is fully open source (Apache-2.0) and free to embed into your systems; the GFlow Workflow Platform builds a complete out-of-the-box product on top of it.',
      }
    : {
        title: '开源底座，商用应用',
        desc: '引擎层 GFlow Engine 完全开源（Apache-2.0），可自由嵌入你的系统；GFlow 极风工作流平台在引擎之上提供开箱即用的完整产品。',
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 00 · Open Source"
        :title="head.title"
        :desc="head.desc"
      />

      <div class="product-grid">
        <div v-for="r in repos" :key="r.name" class="product-card opensource">
          <div class="product-name">{{ r.name }} · {{ r.license }}</div>
          <h3 class="product-title">{{ r.cn }}</h3>
          <p class="product-desc">{{ r.desc }}</p>
          <div class="terminal" style="margin-bottom: 16px">
            <div class="terminal-bar">
              <i></i><i></i><i></i>
              <span class="terminal-title">terminal</span>
            </div>
            <div class="terminal-body">
              <span class="ln-prompt">$ </span>{{ r.cmd }}
            </div>
          </div>
          <div class="repo-links">
            <a
              v-for="l in r.links"
              :key="l.label"
              class="gf-btn gf-btn-ghost ghost-light repo-link"
              :href="l.url"
              target="_blank"
              rel="noopener"
            >{{ l.label }} ↗</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.repo-links {
  display: flex;
  gap: 10px;
}

.repo-link {
  padding: 9px 18px;
  font-size: 13.5px;
}
</style>
