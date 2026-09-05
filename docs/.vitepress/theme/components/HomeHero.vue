<script setup lang="ts">
import { computed } from 'vue'
import SealStamp from './SealStamp.vue'
import { useI18n } from '../composables/useI18n'

const DEMO_URL = 'http://8.134.32.225:8081'

const { isEn, link } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        announce: 'Once approved, it runs itself — see approval as automation',
        titleA: 'AI pre-screens · Humans approve ·',
        titleB: 'automation follows.',
        subtitle: 'GFlow Workflow Platform',
        descLines: [
          { s: 'AI pre-screens', t: ': LLMs judge the risk; low-risk items pass straight through' },
          { s: 'Humans approve', t: ': countersign, add-sign, return anywhere — every Chinese-style approval action' },
          { s: 'Automation follows', t: ': the moment it is approved, booking, notifications and ERP write-back run on rule chains' },
        ],
        notePre: 'Built on the Apache-2.0 open-source GFlow Engine (on a ',
        notePost: ' base), with the GFlow Workflow Platform on top providing process, form, rule chain and AI agent designers.',
        demoBtn: 'Live demo environment',
        repoBtn: 'Gitee open-source repo',
        docTitle: 'Leave Approval Form',
        docNo: 'GFLOW-2026-0819-0001 · process_key: leave_approval',
        rowApplicant: 'Applicant',
        rowApplicantV: 'Wang Qiang · R&D',
        rowReason: 'Reason',
        rowReasonV: 'Family matters, 5 days of leave',
        rowVars: 'Variables',
        rowVarsV: 'msg.days = 5 · msg.reason = "Family matters"',
        flowStart: 'Start',
        flowManager: 'Direct Manager',
        flowAI: 'AI Pre-screen',
        flowAuto: 'Auto Booking',
        rowAfter: 'After approval',
        rowAfterV: '✓ Leave ledger updated · ✉ Notifications sent · 0.8s',
        stats: [
          { num: '6', unit: '', label: 'core data tables · runtime/history split' },
          { num: '12', unit: '+', label: 'Chinese-style approval actions: add-sign · reject · countersign …' },
          { num: '7', unit: '', label: 'BPM extension node types + RuleGo native node library' },
          { num: '4', unit: '', label: 'in-house components: process/form/rule chain designers + AI agent' },
        ],
      }
    : {
        announce: '批完，自动办 —— 了解「审批即自动化」',
        titleA: 'AI 先审 · 人再签 ·',
        titleB: '签完自动办。',
        subtitle: 'GFlow 极风工作流平台',
        descLines: [
          { s: 'AI 先审', t: '：大模型判风险，低风险自动直通' },
          { s: '人再签', t: '：会签、加签、任意退回，中国式审批一个不少' },
          { s: '签完自动办', t: '：通过那一刻，入账、通知、回写 ERP 由规则链执行' },
        ],
        notePre: '底层 Apache-2.0 开源引擎 GFlow Engine（',
        notePost: ' 底座），其上 GFlow 极风工作流平台提供流程、表单、规则链与智能体。',
        demoBtn: '在线演示环境',
        repoBtn: 'Gitee 开源仓库',
        docTitle: '请假审批单',
        docNo: 'GFLOW-2026-0819-0001 · process_key: leave_approval',
        rowApplicant: '申请人',
        rowApplicantV: '王强 · 研发部',
        rowReason: '请假事由',
        rowReasonV: '家中事务，需请假 5 天',
        rowVars: '流程变量',
        rowVarsV: 'msg.days = 5 · msg.reason = "家中事务"',
        flowStart: '发起',
        flowManager: '直属主管',
        flowAI: 'AI 预审',
        flowAuto: '自动入账',
        rowAfter: '批完自动',
        rowAfterV: '✓ 薪假台账已登记 · ✉ 通知已发 · 0.8s',
        stats: [
          { num: '6', unit: '张', label: '核心数据表，运行/历史双轨分离' },
          { num: '12', unit: '+', label: '中国式审批动作：加签·驳回·会签…' },
          { num: '7', unit: '类', label: 'BPM 扩展节点 + RuleGo 原生节点库' },
          { num: '4', unit: '大', label: '自研部件：流程/表单/规则链设计器 + 智能体' },
        ],
      }
)
</script>

<template>
  <header class="hero-wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <a class="hero-announce" :href="link('/guide/features/automation')">
          <span class="dot"></span>
          {{ T.announce }}
          <span aria-hidden="true">→</span>
        </a>

        <h1 class="hero-title">
          {{ T.titleA }}<span class="accent">{{ T.titleB }}</span>
        </h1>
        <p class="hero-subtitle">{{ T.subtitle }}</p>

        <p class="hero-desc">
          <template v-for="(l, i) in T.descLines" :key="i">
            <strong>{{ l.s }}</strong>{{ l.t }}<br v-if="i < T.descLines.length - 1" />
          </template>
        </p>
        <p class="hero-note">
          {{ T.notePre }}<a href="https://rulego.cc" target="_blank" rel="noopener">RuleGo</a>{{ T.notePost }}
        </p>

        <div class="hero-actions">
          <a class="gf-btn gf-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener">
            {{ T.demoBtn }}
            <span aria-hidden="true">→</span>
          </a>
          <a class="gf-btn gf-btn-ghost" href="https://gitee.com/rulego/gflow-engine" target="_blank" rel="noopener">
            {{ T.repoBtn }}
          </a>
        </div>

        <div class="hero-meta">
          <span class="hero-chip">Go <b>1.24+</b></span>
          <span class="hero-chip">PostgreSQL / MySQL</span>
          <span class="hero-chip">{{ isEn ? 'Multi-tenant' : '多租户' }}</span>
          <span class="hero-chip">{{ isEn ? 'Single-binary deployment' : '单二进制部署' }}</span>
        </div>
      </div>

      <!-- 右侧：审批单 mockup -->
      <div class="hero-visual">
        <div class="doc-card">
          <div class="doc-head">
            <div class="doc-title">{{ T.docTitle }}</div>
            <div class="doc-no">{{ T.docNo }}</div>
          </div>

          <div class="doc-row"><span class="k">{{ T.rowApplicant }}</span><span class="v">{{ T.rowApplicantV }}</span></div>
          <div class="doc-row"><span class="k">{{ T.rowReason }}</span><span class="v">{{ T.rowReasonV }}</span></div>
          <div class="doc-row"><span class="k">{{ T.rowVars }}</span><span class="v">{{ T.rowVarsV }}</span></div>

          <div class="doc-flow">
            <span class="doc-node done">{{ T.flowStart }}</span>
            <span class="doc-link">→</span>
            <span class="doc-node done">{{ T.flowManager }}</span>
            <span class="doc-link">→</span>
            <span class="doc-node ai">{{ T.flowAI }}</span>
            <span class="doc-link">→</span>
            <span class="doc-node auto">{{ T.flowAuto }}</span>
          </div>

          <div class="doc-row">
            <span class="k">{{ T.rowAfter }}</span>
            <span class="v">{{ T.rowAfterV }}</span>
          </div>

          <div class="doc-seal-area">
            <SealStamp :size="96" />
          </div>
        </div>
      </div>
    </div>

    <!-- 数据条 -->
    <div class="stats-bar">
      <div class="stats-inner">
        <div v-for="s in T.stats" :key="s.label" class="stat-cell">
          <div class="stat-num">{{ s.num }}<em>{{ s.unit }}</em></div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </header>
</template>
