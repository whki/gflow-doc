<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn } = useI18n()

const layers = computed(() =>
  isEn.value
    ? [
        {
          en: 'Design Layer',
          cn: 'Designers',
          items: [
            { t: 'Process Designer (tree-based)', hot: true },
            { t: 'gform-designer Form Designer', hot: true },
            { t: 'Rule Chain Designer (automation orchestration)', hot: true },
            { t: 'AI Agent (AI approval · skill management)', hot: true },
            { t: 'Node config drawer · conditional routing · form permissions' },
          ],
        },
        {
          en: 'Application · GFlow Platform',
          cn: 'Application',
          items: [
            { t: 'Initiate / todo / done / CC / statistics', hot: true },
            { t: 'Organization · roles & positions · multi-tenant console' },
            { t: 'Monitoring · notifications · audit' },
            { t: 'AI agent management · skills · model config' },
          ],
        },
        {
          en: 'Engine · GFlow Engine',
          cn: 'Approval Engine',
          items: [
            { t: '8 BPM node types: startTask / userTask / ccTask / serviceTask …' },
            { t: 'Countersign · add-sign · return · transfer task state machine' },
            { t: 'IdentityService pluggable identity' },
            { t: 'Versioned deployment · recovery · suspension' },
          ],
        },
        {
          en: 'Rule Engine · RuleGo',
          cn: 'Rule Engine',
          items: [
            { t: 'Rule chain DSL (ruleChain + metadata)' },
            { t: 'switch / fork / join / inclusive / delay' },
            { t: 'automation node cross-chain calls' },
          ],
        },
        {
          en: 'Storage',
          cn: 'Storage',
          items: [
            { t: 'PostgreSQL / MySQL' },
            { t: '7 core tables · optional Redis distributed lock' },
          ],
        },
      ]
    : [
        {
          en: 'Design Layer',
          cn: '设计层',
          items: [
            { t: '流程设计器（树形）', hot: true },
            { t: 'gform-designer 表单设计器', hot: true },
            { t: '规则链设计器（自动化编排）', hot: true },
            { t: '智能体（AI 审批 · 技能管理）', hot: true },
            { t: '节点配置抽屉 · 条件路由 · 表单权限' },
          ],
        },
        {
          en: 'Application · GFlow Platform',
          cn: '应用层',
          items: [
            { t: '发起 / 待办 / 已办 / 抄送 / 统计', hot: true },
            { t: '组织架构 · 角色岗位 · 多租户后台' },
            { t: '监控 · 通知 · 审计' },
            { t: '智能体管理 · 技能 · 模型配置' },
          ],
        },
        {
          en: 'Engine · GFlow Engine',
          cn: '引擎层',
          items: [
            { t: 'startTask / userTask / ccTask / serviceTask 等 8 类 BPM 节点' },
            { t: '会签·加签·退回·转办 任务状态机' },
            { t: 'IdentityService 可插拔身份' },
            { t: '版本化部署 · 恢复 · 挂起' },
          ],
        },
        {
          en: 'Rule Engine · RuleGo',
          cn: '规则引擎',
          items: [
            { t: '规则链 DSL（ruleChain + metadata）' },
            { t: 'switch / fork / join / inclusive / delay' },
            { t: 'automation 节点跨链调用' },
          ],
        },
        {
          en: 'Storage',
          cn: '存储层',
          items: [
            { t: 'PostgreSQL / MySQL' },
            { t: '7 张核心表 · 可选 Redis 分布式锁' },
          ],
        },
      ]
)

const head = computed(() =>
  isEn.value
    ? {
        title: 'Top to bottom, all in-house',
        desc: 'Designers, frontend app, approval engine and rule orchestration — four layers, all our own code, no black-box dependencies. Each layer stands on its own: the engine embeds into your system without gflow, and gflow never locks in your data.',
      }
    : {
        title: '自上而下，全栈自研',
        desc: '设计器、前端应用、审批引擎、规则编排四层均为自研代码，无黑盒依赖；每层可单独取用 —— 引擎能脱离 gflow 嵌入你的系统，gflow 也不会锁死你的数据。',
      }
)
</script>

<template>
  <section class="home-section dark-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 05 · Architecture"
        :title="head.title"
        :desc="head.desc"
      />

      <div class="arch-stack">
        <template v-for="(l, i) in layers" :key="l.en">
          <div class="arch-layer">
            <div class="arch-layer-name">
              <div class="en">{{ l.en }}</div>
              <div class="cn">{{ l.cn }}</div>
            </div>
            <div class="arch-layer-body">
              <span v-for="it in l.items" :key="it.t" class="arch-item" :class="{ hot: it.hot }">
                {{ it.t }}
              </span>
            </div>
          </div>
          <div v-if="i < layers.length - 1" class="arch-arrow">▼</div>
        </template>
      </div>
    </div>
  </section>
</template>
