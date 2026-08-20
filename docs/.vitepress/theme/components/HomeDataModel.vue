<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn, link } = useI18n()

const runtime = computed(() =>
  isEn.value
    ? [
        {
          name: 'wf_process',
          cn: 'Process definition',
          fields: [
            ['process_key + version', 'business key + version, multiple versions per key'],
            ['definition_json', 'full rule chain DSL text'],
            ['status', 'active / retired'],
          ],
        },
        {
          name: 'wf_instance',
          cn: 'Runtime instance',
          fields: [
            ['process_id → wf_process', 'which version the instance runs'],
            ['business_key', 'business order no. (e.g. expense no.)'],
            ['variables', 'process variables (form data goes into msg)'],
            ['parent_id', 'sub-process back-link to its parent'],
          ],
        },
        {
          name: 'wf_task',
          cn: 'Runtime task',
          fields: [
            ['assignee / owner', 'handler / pre-delegation owner'],
            ['parent_id + sequence_order', 'parent-child chain for countersign & add-sign'],
            ['approval_type + approval_rule', 'OR-sign / countersign rules'],
          ],
        },
        {
          name: 'wf_task_assignee',
          cn: 'Candidate pool',
          fields: [
            ['task_id → wf_task', 'candidates attached to a task'],
            ['entity_type', 'role / department / person'],
            ['entity_id', 'raw reference, expanded via the identity service on query'],
          ],
        },
        {
          name: 'wf_task_comment',
          cn: 'Task comments',
          fields: [
            ['task_id → wf_task', 'still readable/writable after the task is archived'],
            ['content + user_id', 'who said what, and when'],
          ],
        },
      ]
    : [
        {
          name: 'wf_process',
          cn: '流程定义',
          fields: [
            ['process_key + version', '业务键 + 版本，同 key 多版本'],
            ['definition_json', '规则链 DSL 全文'],
            ['status', 'active / retired'],
          ],
        },
        {
          name: 'wf_instance',
          cn: '运行时实例',
          fields: [
            ['process_id → wf_process', '实例跑哪个版本'],
            ['business_key', '业务单号（报销单号等）'],
            ['variables', '流程变量（表单数据入 msg）'],
            ['parent_id', '子流程回链主流程'],
          ],
        },
        {
          name: 'wf_task',
          cn: '运行时任务',
          fields: [
            ['assignee / owner', '办理人 / 委托前拥有人'],
            ['parent_id + sequence_order', '会签、加签的父子链'],
            ['approval_type + approval_rule', '或签 / 会签规则'],
          ],
        },
        {
          name: 'wf_task_assignee',
          cn: '候选人池',
          fields: [
            ['task_id → wf_task', '挂在任务上的候选'],
            ['entity_type', 'role / department / person'],
            ['entity_id', '原始引用，查询时经身份服务展开'],
          ],
        },
        {
          name: 'wf_task_comment',
          cn: '任务处理意见',
          fields: [
            ['task_id → wf_task', '任务归档后仍可读写'],
            ['content + user_id', '谁在什么时候说了什么'],
          ],
        },
      ]
)

const history = computed(() =>
  isEn.value
    ? [
        {
          name: 'wf_hi_instance',
          cn: 'History instance',
          fields: [
            ['ended_at + duration', 'end time and elapsed time'],
            ['end_reason', 'completed / terminated / withdrawn reason'],
          ],
        },
        {
          name: 'wf_hi_task',
          cn: 'History task',
          fields: [
            ['comment + end_reason', 'approval comment and conclusion snapshot'],
            ['variables', 'form snapshot at the moment of completion'],
          ],
        },
      ]
    : [
        {
          name: 'wf_hi_instance',
          cn: '历史实例',
          fields: [
            ['ended_at + duration', '结束时间与耗时'],
            ['end_reason', '完成 / 终止 / 撤回原因'],
          ],
        },
        {
          name: 'wf_hi_task',
          cn: '历史任务',
          fields: [
            ['comment + end_reason', '审批意见与结论快照'],
            ['variables', '结束瞬间表单快照'],
          ],
        },
      ]
)

const T = computed(() =>
  isEn.value
    ? {
        head: {
          title: 'The whole engine is only 7 tables',
          desc: 'Runtime and history archiving on separate tracks: in-flight data stays minimal, and reporting/audit queries hit the history tables without dragging down production. No relational maze — each table is self-explanatory at a glance.',
        },
        laneRuntime: 'RUNTIME · in flight (5 tables)',
        laneHistory: 'HISTORY · archive (2 tables)',
        notePre: 'The moment an instance finishes, its rows move from ',
        noteMid: ' into ',
        notePost: ' and record elapsed time and conclusions; the runtime tables only ever hold "in flight" rows, while the history tables take any index you need for reports — neither disturbs the other.',
        more: 'Read "Data Model: why only 7 tables" →',
      }
    : {
        head: {
          title: '整个引擎，只有 7 张表',
          desc: '运行时与历史归档双轨分离：进行中的数据极致精简，报表审计查历史表不拖累线上。没有关系迷宫 —— 每张表的作用一眼看懂。',
        },
        laneRuntime: 'RUNTIME · 运行时（5 张）',
        laneHistory: 'HISTORY · 历史归档（2 张）',
        notePre: '实例结束的瞬间，行从 ',
        noteMid: ' 迁入 ',
        notePost: ' 并补记耗时与结论；运行表永远只存「进行中」，历史表随便加索引做报表，两不相扰。',
        more: '阅读《数据模型：为什么只有 7 张表》 →',
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 04 · Data Model"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <div class="er-wrap">
        <div>
          <div class="er-lane-title">{{ T.laneRuntime }}</div>
          <div v-for="t in runtime" :key="t.name" class="er-table">
            <div class="er-table-head">
              <span class="er-table-name">{{ t.name }}</span>
              <span class="er-table-cn">{{ t.cn }}</span>
            </div>
            <div class="er-table-body">
              <div v-for="f in t.fields" :key="f[0]" class="er-field">
                <span class="fname">{{ f[0] }}</span>
                <span class="fdesc">{{ f[1] }}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="er-lane-title">{{ T.laneHistory }}</div>
          <div v-for="t in history" :key="t.name" class="er-table">
            <div class="er-table-head">
              <span class="er-table-name">{{ t.name }}</span>
              <span class="er-table-cn">{{ t.cn }}</span>
            </div>
            <div class="er-table-body">
              <div v-for="f in t.fields" :key="f[0]" class="er-field">
                <span class="fname">{{ f[0] }}</span>
                <span class="fdesc">{{ f[1] }}</span>
              </div>
            </div>
          </div>

          <div class="er-note">
            <p>
              {{ T.notePre }}<code>wf_instance</code> / <code>wf_task</code>{{ T.noteMid
              }}<code>wf_hi_*</code>{{ T.notePost }}
            </p>
            <a :href="link('/guide/data-model/')" class="er-link">{{ T.more }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.er-note {
  border: 1px solid var(--gf-line);
  border-left: 3px solid var(--gf-green);
  border-radius: 8px;
  background: #fffdf9;
  padding: 16px 18px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #4c5a51;
}

.er-note code {
  font-family: var(--gf-mono);
  font-size: 12px;
  background: rgba(0, 168, 107, 0.08);
  color: #04784f;
  padding: 1px 6px;
  border-radius: 4px;
}

.er-link {
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
  color: #04784f;
  text-decoration: none;
}

.er-link:hover {
  text-decoration: underline;
}
</style>
