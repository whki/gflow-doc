<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { isEn, link } = useI18n()

const cols = computed(() =>
  isEn.value
    ? [
        {
          en: 'Definition',
          cn: 'Definition',
          cards: [
            { t: 'wf_process', d: 'Full DSL text + version', link: link('/guide/data-model/wf-process') },
          ],
        },
        {
          en: 'Runtime',
          cn: 'Runtime',
          cards: [
            { t: 'wf_instance', d: 'In-flight instances', link: link('/guide/data-model/wf-instance') },
            { t: 'wf_task', d: 'In-flight tasks', link: link('/guide/data-model/wf-task') },
            { t: 'wf_task_assignee', d: 'Candidate pool', link: link('/guide/data-model/wf-task-assignee') },
            { t: 'wf_task_comment', d: 'Task comments (persistent)', link: link('/guide/data-model/wf-task-comment') },
          ],
        },
        {
          en: 'History',
          cn: 'History',
          cards: [
            { t: 'wf_hi_instance', d: 'Archive of finished instances', link: link('/guide/data-model/wf-hi-instance') },
            { t: 'wf_hi_task', d: 'Archive of finished tasks (with snapshot)', link: link('/guide/data-model/wf-hi-task') },
          ],
        },
      ]
    : [
        {
          en: 'Definition',
          cn: '定义',
          cards: [
            { t: 'wf_process', d: 'DSL 全文 + 版本', link: '/guide/data-model/wf-process' },
          ],
        },
        {
          en: 'Runtime',
          cn: '运行时',
          cards: [
            { t: 'wf_instance', d: '进行中的实例', link: '/guide/data-model/wf-instance' },
            { t: 'wf_task', d: '进行中的任务', link: '/guide/data-model/wf-task' },
            { t: 'wf_task_assignee', d: '候选人池', link: '/guide/data-model/wf-task-assignee' },
            { t: 'wf_task_comment', d: '任务处理意见（持久）', link: '/guide/data-model/wf-task-comment' },
          ],
        },
        {
          en: 'History',
          cn: '历史',
          cards: [
            { t: 'wf_hi_instance', d: '已结束实例归档', link: '/guide/data-model/wf-hi-instance' },
            { t: 'wf_hi_task', d: '已结束任务归档（含快照）', link: '/guide/data-model/wf-hi-task' },
          ],
        },
      ]
)

const legend = computed(() =>
  isEn.value
    ? ['Definition ──process_id (pins the version)──▶ Runtime', 'Runtime ──archive on completion (full row migration)──▶ History']
    : ['定义 ──process_id（锁版本）──▶ 运行时', '运行时 ──结束归档（整行迁移）──▶ 历史']
)
</script>

<template>
  <div class="dmd">
    <div class="dmd-grid">
      <div v-for="c in cols" :key="c.en" class="dmd-col">
        <div class="dmd-head">
          <span class="en">{{ c.en }}</span>
          <span class="cn">{{ c.cn }}</span>
        </div>
        <a v-for="card in c.cards" :key="card.t" :href="card.link" class="dmd-card">
          <span class="t">{{ card.t }}</span>
          <span class="d">{{ card.d }}</span>
        </a>
      </div>
    </div>
    <div class="dmd-legend">
      <span v-for="l in legend" :key="l">{{ l }}</span>
    </div>
  </div>
</template>

<style scoped>
.dmd {
  background: #0b1512;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 20px;
  margin: 18px 0;
}

.dmd-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr 1fr;
  gap: 12px;
}

@media (max-width: 760px) {
  .dmd-grid {
    grid-template-columns: 1fr;
  }
}

.dmd-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dmd-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 2px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 2px;
}

.dmd-head .en {
  font-family: var(--gf-mono);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: #4fd596;
  text-transform: uppercase;
}

.dmd-head .cn {
  font-family: var(--gf-serif);
  font-size: 15px;
  font-weight: 700;
  color: #eef5ef;
}

.dmd-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgba(45, 212, 160, 0.35);
  background: rgba(0, 168, 107, 0.08);
  border-radius: 8px;
  padding: 9px 12px;
  text-decoration: none;
  transition: background 0.2s;
}

.dmd-card:hover {
  background: rgba(0, 168, 107, 0.18);
}

.dmd-card .t {
  font-family: var(--gf-mono);
  font-size: 13px;
  font-weight: 600;
  color: #9fe8c8;
}

.dmd-card .d {
  font-size: 12px;
  color: #c3d4c8;
}

.dmd-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.14);
  font-family: var(--gf-mono);
  font-size: 11.5px;
  color: #8fa89a;
}
</style>
