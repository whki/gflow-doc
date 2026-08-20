<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const { isEn, link } = useI18n()

const goCode = computed(() =>
  isEn.value
    ? `import (
    "github.com/rulego/gflow-engine/config"
    "github.com/rulego/gflow-engine/service"
)

// 1. Connect the database and the engine is live — 7 tables auto-provisioned
engine := service.NewWorkflowEngine("demo", &config.Config{
    Database: &config.DatabaseConfig{
        Driver: "postgres",
        Dsn:    "host=127.0.0.1 dbname=rulego_bpm ...",
    },
})
engine.Start(ctx)

// 2. Deploy a process (the DSL is just a RuleGo rule chain)
engine.GetProcessService().Deploy(ctx, &model.WfProcess{
    ProcessKey:     "expense_approval",
    Name:           "Expense Approval",
    DefinitionJSON: expenseDSL,
}, true)

// 3. Start an instance — form data goes into msg
engine.GetRuntimeService().StartProcessInstanceByKey(
    ctx, identity, "expense_approval", bizKey, vars, false)`
    : `import (
    "github.com/rulego/gflow-engine/config"
    "github.com/rulego/gflow-engine/service"
)

// 1. 连库即引擎，7 张表自动就绪
engine := service.NewWorkflowEngine("demo", &config.Config{
    Database: &config.DatabaseConfig{
        Driver: "postgres",
        Dsn:    "host=127.0.0.1 dbname=rulego_bpm ...",
    },
})
engine.Start(ctx)

// 2. 部署流程（DSL 就是一条 RuleGo 规则链）
engine.GetProcessService().Deploy(ctx, &model.WfProcess{
    ProcessKey:     "expense_approval",
    Name:           "报销审批",
    DefinitionJSON: expenseDSL,
}, true)

// 3. 发起实例，表单数据装进 msg
engine.GetRuntimeService().StartProcessInstanceByKey(
    ctx, identity, "expense_approval", bizKey, vars, false)`
)

const T = computed(() =>
  isEn.value
    ? {
        head: {
          title: 'Your first approval flow in three minutes',
          desc: 'No middleware to install, no scaffolding to generate. Create the database, connect it, start an instance — you write business code, not workflow code.',
        },
        points: [
          'The engine has zero external dependencies: the Redis lock and message notifications are both optional',
          'The DSL interoperates with the RuleGo ecosystem — rule chains can be reused directly as processes',
          'Unit tests run on an in-memory SQLite database, no real database needed',
        ],
        more: 'Read the Quick Start →',
      }
    : {
        head: {
          title: '三分钟，跑通第一个审批流',
          desc: '没有中间件要装，没有脚手架要生成。建库、连库、发实例 —— 你写的是业务代码，不是流程代码。',
        },
        points: [
          '引擎零外部依赖：Redis 锁、消息通知都是可选项',
          'DSL 与 RuleGo 生态互通，规则链可直接复用为流程',
          '单元测试跑 SQLite 内存库，不依赖真实数据库',
        ],
        more: '阅读快速开始 →',
      }
)
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 06 · Quick Start"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <div class="qs-grid">
        <div class="qs-code">
          <div class="terminal">
            <div class="terminal-bar">
              <i></i><i></i><i></i>
              <span class="terminal-title">main.go</span>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="terminal-body go-code" v-html="goCode.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('\n', '<br>')"></div>
          </div>
        </div>

        <div class="qs-term">
          <div class="terminal">
            <div class="terminal-bar">
              <i></i><i></i><i></i>
              <span class="terminal-title">engine.log</span>
            </div>
            <div class="terminal-body">
              <div><span class="ln-prompt">$ </span>go run .</div>
              <div class="ln-info">[BPM] engine started · tables migrated (6)</div>
              <div class="ln-info">[BPM] deploy expense_approval v1 · active</div>
              <div class="ln-ok">[BPM] instance i-2026…started · task → mgr001</div>
              <div class="ln-ai">[AI&nbsp;] expense ≤ 5000 · auto-approved ✦</div>
              <div class="ln-warn">[BPM] instance completed · 1.2s</div>
              <div><span class="ln-prompt">$ </span><span class="term-cursor"></span></div>
            </div>
          </div>

          <ul class="qs-points">
            <li v-for="p in T.points" :key="p">{{ p }}</li>
          </ul>
        </div>
      </div>

      <div class="qs-more">
        <a :href="link('/guide/getting-started/quickstart')" class="gf-btn gf-btn-primary">{{ T.more }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.qs-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .qs-grid { grid-template-columns: 1fr; }
}

.qs-points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.qs-points li {
  position: relative;
  padding: 6px 0 6px 22px;
  font-size: 13.5px;
  line-height: 1.7;
  color: #4c5a51;
}

.qs-points li::before {
  content: '▸';
  position: absolute;
  left: 2px;
  color: var(--gf-green);
}

.qs-more {
  margin-top: 28px;
  text-align: center;
}
</style>
