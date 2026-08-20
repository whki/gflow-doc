<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn, link } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        head: {
          title: 'Two shapes, one core',
          desc: 'Embed GFlow Engine into your existing systems, or take away a ready-to-use GFlow Workflow Platform.',
        },
        openTitle: 'Open-Source Approval Engine',
        openDesc:
          'For developers. One Go library plus 7 tables embeds Chinese-style approval into any existing system — Apache-2.0, modify it freely.',
        freeNote: 'Apache-2.0 · Free forever',
        openItems: [
          'Full approval-engine semantics: countersign / add-sign / reject / transfer / withdraw / suspend',
          'Rule chain DSL process definitions (ruleChain + metadata)',
          'Multi-tenant tenant_id isolation end to end',
          'Versioned process definitions — existing instances keep running the old version',
          'Pluggable identity via IdentityService',
          'Runtime / history table separation',
        ],
        viewSource: 'View source',
        badge: 'COMMERCIAL',
        paidTitle: 'GFlow Workflow Platform',
        paidDesc:
          'For enterprises. A ready-made product out of the box: server + frontend + designers, delivered with source — a business admin configures the first process in 30 minutes.',
        wasPrice: '¥ 15,000',
        offBadge: '50% OFF · Limited time',
        paidNote: 'One-time license · Source delivery · 1 year of support included',
        paidItems: [
          'Process Designer: tree-style visual orchestration (in-house)',
          'Form Designer: gform-designer + template library (in-house)',
          'Rule Chain Designer: visual automation orchestration (in-house)',
          'AI Agent: AI approval · skills · agent management (in-house)',
          'Complete frontend app: initiate / todo / done / CC / stats / tracking',
          'Automation orchestration: triggers, HTTP / service task configuration',
          'Organization, roles, positions and multi-tenant admin console',
          'Monitoring dashboards, notification center, operation audit',
          'Full source delivery of server + frontend, unlimited customization',
        ],
        compare: 'See the full comparison',
      }
    : {
        head: {
          title: '两种形态，一套内核',
          desc: '把 GFlow Engine 嵌进你现有的系统，或者直接拿走一个能用的 GFlow 极风工作流平台。',
        },
        openTitle: '开源审批引擎',
        openDesc:
          '面向开发者。一个 Go 库加 7 张表，把中国式审批能力嵌进任何现有系统，Apache-2.0 随便改。',
        freeNote: 'Apache-2.0 · 永久免费',
        openItems: [
          '审批引擎全部语义：会签/加签/驳回/转办/撤回/挂起',
          '规则链 DSL 流程定义（ruleChain + metadata）',
          '多租户 tenant_id 全链路隔离',
          '流程定义版本化，存量实例继续跑旧版',
          '可插拔身份体系 IdentityService',
          '运行时/历史双表分离',
        ],
        viewSource: '查看源码',
        badge: '商 用',
        paidTitle: '极风工作流平台',
        paidDesc:
          '面向企业。开箱即用的成品：服务端 + 前端 + 设计器，源码交付，业务管理员 30 分钟配出第一个流程。',
        wasPrice: '¥ 15,000',
        offBadge: '限时 5 折',
        paidNote: '一次性授权 · 源码交付 · 含一年支持',
        paidItems: [
          '流程设计器：树形可视化编排（自研）',
          '表单设计器：gform-designer + 模板库（自研）',
          '规则链设计器：可视化编排自动化规则链（自研）',
          '智能体：AI 审批 · 技能 · 智能体管理（自研）',
          '完整前端应用：发起/待办/已办/抄送/统计/跟踪',
          '自动化编排：触发器、HTTP/服务任务配置',
          '组织架构、角色、岗位、多租户管理后台',
          '监控大盘、通知中心、操作审计',
          '服务端 + 前端全部源码交付，二开无限制',
        ],
        compare: '查看完整对比',
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 02 · Products"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <div class="product-grid">
        <div class="product-card opensource">
          <div class="product-name">GFLOW / ENGINE</div>
          <h3 class="product-title">{{ T.openTitle }}</h3>
          <p class="product-desc">{{ T.openDesc }}</p>
          <div class="product-price">
            <span class="price-num free">¥ 0</span>
            <span class="price-note">{{ T.freeNote }}</span>
          </div>
          <ul class="product-list">
            <li v-for="i in T.openItems" :key="i">{{ i }}</li>
          </ul>
          <a class="gf-btn gf-btn-ghost ghost-light" style="justify-content: center"
             href="https://gitee.com/rulego/gflow-engine" target="_blank" rel="noopener">
            {{ T.viewSource }}
          </a>
        </div>

        <div class="product-card commercial">
          <span class="corner-badge">{{ T.badge }}</span>
          <div class="product-name">GFLOW / PLATFORM</div>
          <h3 class="product-title">{{ T.paidTitle }}</h3>
          <p class="product-desc">{{ T.paidDesc }}</p>
          <div class="product-price">
            <s class="price-was">{{ T.wasPrice }}</s>
            <span class="price-num paid">¥ 7,500</span>
            <span class="price-badge">{{ T.offBadge }}</span>
            <span class="price-note" style="flex-basis: 100%">{{ T.paidNote }}</span>
          </div>
          <ul class="product-list">
            <li v-for="i in T.paidItems" :key="i">{{ i }}</li>
          </ul>
          <a :href="link('/pricing')" class="gf-btn gf-btn-primary" style="justify-content: center">
            {{ T.compare }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
