<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn } = useI18n()

const caps = computed(() =>
  isEn.value
    ? [
        {
          icon: '✦',
          red: true,
          title: 'AI Approval',
          desc: 'The aiAgent node hands requests to an LLM: it recognizes amount/reason risk, auto-approves low risk and escalates high risk to humans.',
          tags: ['aiAgent', 'auto-approve'],
        },
        {
          icon: '☑',
          red: false,
          title: 'Countersign · OR-sign',
          desc: 'Parallel or sequential countersigning, unanimous or by ratio; with OR-sign the first approval settles it. Rules are stored as JSON on the task row.',
          tags: ['countersign', 'single', 'unanimous/majority'],
        },
        {
          icon: '✚',
          red: false,
          title: 'Dynamic add-sign / remove-sign',
          desc: 'Insert approvers before or after mid-flight, or remove extra countersigners — the parent-child task chain maintains itself.',
          tags: ['parent_id', 'sequence_order'],
        },
        {
          icon: '↩',
          red: true,
          title: 'Return anywhere',
          desc: 'Send a request back to the initiator or any past node; variables and form snapshots travel with it, and the flow stays editable after return.',
          tags: ['returned', 'return to initiator'],
        },
        {
          icon: '⇄',
          red: false,
          title: 'Transfer · Delegate',
          desc: 'Hand a task to someone else; after delegation the original owner stays traceable — every delegate step is recorded.',
          tags: ['owner', 'delegate_from'],
        },
        {
          icon: '⚑',
          red: false,
          title: 'Claim / Race-to-claim',
          desc: 'Tasks in the candidate pool (roles/departments) are claimed first-come-first-served, with claim time and handler fully recorded.',
          tags: ['claimed_at', 'candidate'],
        },
        {
          icon: '⌫',
          red: false,
          title: 'Withdraw · Retrieve',
          desc: 'Initiators can withdraw in-flight requests; completed tasks can be retrieved for rework before the next node acts on them.',
          tags: ['withdrawn', 'cancelled'],
        },
        {
          icon: '◎',
          red: false,
          title: 'CC · Communication',
          desc: 'The ccTask node produces CC records; listeners call back into the host app to drive in-app and email notifications.',
          tags: ['ccTask', 'CCTaskCreatedListener'],
        },
        {
          icon: '⑂',
          red: false,
          title: 'Conditional · Parallel · Inclusive',
          desc: 'jsSwitch gates branch on form variables; fork/join runs branches in parallel; inclusive activates only the matching subset.',
          tags: ['jsSwitch', 'fork', 'inclusive'],
        },
      ]
    : [
        {
          icon: '✦',
          red: true,
          title: 'AI 智能审批',
          desc: 'aiAgent 节点对接大模型审单：金额/事由风险识别，低风险自动通过，高风险转人工。',
          tags: ['aiAgent', '自动通过'],
        },
        {
          icon: '☑',
          red: false,
          title: '会签 · 或签',
          desc: '并行/顺序会签，全票或按比例通过；或签一人通过即过。规则 JSON 化存储于任务行。',
          tags: ['countersign', 'single', '全票/多数'],
        },
        {
          icon: '✚',
          red: false,
          title: '动态加签 / 减签',
          desc: '审批中途插入前置/后置审批人，或移除多余会签人，任务父子链自动维护。',
          tags: ['parent_id', 'sequence_order'],
        },
        {
          icon: '↩',
          red: true,
          title: '任意退回',
          desc: '可退回到发起人、任一历史节点，变量与表单快照随行带回，退回后流程继续可编辑。',
          tags: ['returned', '退回发起人'],
        },
        {
          icon: '⇄',
          red: false,
          title: '转办 · 委托',
          desc: '任务转办给他人；委托后原拥有人保留追溯，delegate 全程留痕。',
          tags: ['owner', 'delegate_from'],
        },
        {
          icon: '⚑',
          red: false,
          title: '签收 / 抢单',
          desc: '候选人池（角色/部门）任务先到先签收，签收时间与办理人完整记录。',
          tags: ['claimed_at', 'candidate'],
        },
        {
          icon: '⌫',
          red: false,
          title: '撤回 · 拿回',
          desc: '发起人撤回在途申请；已办任务在后续节点未处理前可拿回重办。',
          tags: ['withdrawn', 'cancelled'],
        },
        {
          icon: '◎',
          red: false,
          title: '抄送 · 沟通',
          desc: 'ccTask 节点生成抄送记录，经监听器回调宿主应用驱动站内信/邮件通知。',
          tags: ['ccTask', 'CCTaskCreatedListener'],
        },
        {
          icon: '⑂',
          red: false,
          title: '条件 · 并行 · 包容',
          desc: 'jsSwitch 条件网关引用表单变量；fork/join 并行分支；inclusive 部分激活包容分支。',
          tags: ['jsSwitch', 'fork', 'inclusive'],
        },
      ]
)

const head = computed(() =>
  isEn.value
    ? {
        title: 'Countersign everything, then let it run',
        desc: 'Countersign, add-sign, reject, transfer, withdraw — Chinese-style approval semantics are the complete foundation. What others cannot tell you is the automation that kicks in after approval.',
        kicker: 'DIFFERENTIATOR · AFTER APPROVAL',
        fcTitle: 'The moment a request is approved, the work is already running',
        fcDesc:
          'The automation node calls rule chains: booking, permission grants, notifications and ERP write-back execute together; AI nodes can even pre-screen the risk before a human signs — all written in the same DSL as the approval nodes.',
        steps: ['✦ AI judges risk', '✓ Humans sign', '⚙ Auto-execute'],
      }
    : {
        title: '会签会批，批完自动办',
        desc: '会签、加签、驳回、转办、撤回 —— 中国式审批语义是完备的地基；批完之后的自动化执行，才是别人讲不出的差异。',
        kicker: 'DIFFERENTIATOR · 批完之后',
        fcTitle: '审批通过的那一刻，活儿已经在干了',
        fcDesc:
          'automation 节点调用规则链：入账、开权限、发通知、回写 ERP 同步执行；AI 节点还能在人工审批之前先替你把风险审一遍 —— 全部与审批节点写在同一条 DSL 里。',
        steps: ['✦ AI 判风险', '✓ 人来签', '⚙ 自动执行'],
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 01 · Capabilities"
        :title="head.title"
        :desc="head.desc"
      />

      <!-- 差异化特写：批完自动办 -->
      <div class="featured-cap">
        <div class="fc-left">
          <div class="fc-kicker">{{ head.kicker }}</div>
          <h3 class="fc-title">{{ head.fcTitle }}</h3>
          <p>{{ head.fcDesc }}</p>
        </div>
        <div class="fc-steps">
          <span class="fc-step ai">{{ head.steps[0] }}</span>
          <span class="fc-arrow">→</span>
          <span class="fc-step human">{{ head.steps[1] }}</span>
          <span class="fc-arrow">→</span>
          <span class="fc-step auto">{{ head.steps[2] }}</span>
        </div>
      </div>

      <div class="gf-grid cols-3">
        <div v-for="c in caps" :key="c.title" class="gf-card">
          <div class="cap-icon" :class="{ red: c.red }">{{ c.icon }}</div>
          <h3><span class="ok-tick" aria-hidden="true">✓</span>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
          <div class="cap-tags">
            <span v-for="t in c.tags" :key="t" class="cap-tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-cap {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid rgba(0, 168, 107, 0.5);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 168, 107, 0.06), rgba(0, 168, 107, 0.015));
  padding: 24px 28px;
  margin-bottom: 34px;
}

.fc-kicker {
  font-family: var(--gf-mono);
  font-size: 11.5px;
  letter-spacing: 0.2em;
  color: #04784f;
  margin-bottom: 9px;
}

.fc-title {
  font-family: var(--gf-serif);
  font-size: 21px;
  font-weight: 900;
  margin: 0 0 9px;
  color: #152b21;
}

.fc-left p {
  font-size: 13.5px;
  line-height: 1.85;
  opacity: 0.75;
  margin: 0;
  max-width: 580px;
}

.fc-steps {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.fc-step {
  font-size: 13px;
  font-weight: 600;
  padding: 9px 15px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

.fc-step.ai {
  color: #5d3fb0;
  border-color: rgba(124, 92, 200, 0.4);
  background: rgba(124, 92, 200, 0.06);
}

.fc-step.human {
  color: #04784f;
  border-color: rgba(0, 168, 107, 0.4);
  background: rgba(0, 168, 107, 0.06);
}

.fc-step.auto {
  color: #2f6ba8;
  border-color: rgba(96, 150, 210, 0.45);
  background: rgba(96, 150, 210, 0.07);
}

.fc-arrow {
  color: #9aa89e;
  font-size: 15px;
}

.ok-tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  margin-right: 7px;
  border-radius: 50%;
  background: var(--gf-green);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  vertical-align: 1px;
}
</style>
