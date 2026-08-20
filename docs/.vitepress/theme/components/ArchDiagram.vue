<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

// 单张 SVG 架构图：固定 1000×530 视图，任意屏宽下完整一屏显示。
// 文本宽度按字宽估算（CJK 全宽、ASCII 0.62 倍），据此自动排布右侧标签芯片。

const { isEn } = useI18n()

const W = 1000
const H = 530

type Chip = { t: string; hot?: boolean }
type Layer = {
  en: string
  cn: string
  icon: keyof typeof iconPaths
  tag: string
  tone: 'biz' | 'oss' | 'neutral'
  chips: Chip[]
  note?: string
  noteMono?: boolean
}

const iconPaths = {
  design:
    'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
  app: 'M3 3h18v18H3zM3 9h18M9 21V9',
  engine:
    'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
  rule: 'M8 9a3 3 0 100-6 3 3 0 000 6zM16 9a3 3 0 100-6 3 3 0 000 6zM12 21a3 3 0 100-6 3 3 0 000 6zM9.5 8.5l1.8 6.5M14.5 8.5l-1.8 6.5',
  storage:
    'M21 5c0 1.66-4 3-9 3S3 6.66 3 5M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
} as const

const layers = computed<Layer[]>(() =>
  isEn.value
    ? [
        {
          en: 'Design',
          cn: 'Design Layer',
          icon: 'design',
          tag: 'Commercial · 4 designers',
          tone: 'biz',
          chips: [
            { t: 'Process Designer', hot: true },
            { t: 'Form Designer', hot: true },
            { t: 'Rule Chain Designer', hot: true },
            { t: 'AI Agent', hot: true },
          ],
          note: 'Tree-style designer · 29 field types · visual automation · AI approval & skills',
        },
        {
          en: 'Application',
          cn: 'Application · GFlow Platform',
          icon: 'app',
          tag: 'Commercial',
          tone: 'biz',
          chips: [
            { t: 'Initiate / todo / done / CC / stats', hot: true },
            { t: 'Organization · multi-tenant' },
            { t: 'Monitoring · notify · audit' },
          ],
        },
        {
          en: 'Engine',
          cn: 'Engine · GFlow Engine',
          icon: 'engine',
          tag: 'Open source · Apache-2.0',
          tone: 'oss',
          chips: [
            { t: '8 BPM node types', hot: true },
            { t: 'Countersign · add-sign · return' },
            { t: 'IdentityService' },
            { t: 'Versioned deployment' },
          ],
          note: 'startTask / userTask / ccTask / serviceTask / automation / subProcess / aiAgent / httpCall',
          noteMono: true,
        },
        {
          en: 'Rule Engine',
          cn: 'Rule Engine · RuleGo',
          icon: 'rule',
          tag: 'Open source',
          tone: 'oss',
          chips: [
            { t: 'Rule chain DSL', hot: true },
            { t: 'switch / fork / join / inclusive / delay' },
            { t: 'automation cross-chain calls' },
          ],
        },
        {
          en: 'Storage',
          cn: 'Storage Layer',
          icon: 'storage',
          tag: '',
          tone: 'neutral',
          chips: [{ t: 'PostgreSQL / MySQL' }, { t: '7 core tables' }, { t: 'Redis distributed lock (optional)' }],
        },
      ]
    : [
        {
          en: 'Design',
          cn: '设计层',
          icon: 'design',
          tag: '商业版 · 四大自研部件',
          tone: 'biz',
          chips: [
            { t: '流程设计器', hot: true },
            { t: '表单设计器', hot: true },
            { t: '规则链设计器', hot: true },
            { t: '智能体管理', hot: true },
          ],
          note: '树形设计器 · 29 种字段 · 可视化编排自动化 · AI 审批与技能',
        },
        {
          en: 'Application',
          cn: '应用层 · GFlow Platform',
          icon: 'app',
          tag: '商业版',
          tone: 'biz',
          chips: [
            { t: '发起 / 待办 / 已办 / 抄送 / 统计', hot: true },
            { t: '组织架构 · 角色岗位 · 多租户' },
            { t: '监控 · 通知 · 审计' },
          ],
        },
        {
          en: 'Engine',
          cn: '引擎层 · GFlow Engine',
          icon: 'engine',
          tag: '开源 · Apache-2.0',
          tone: 'oss',
          chips: [
            { t: '8 类 BPM 节点', hot: true },
            { t: '会签 · 加签 · 退回 · 转办 · 撤回' },
            { t: 'IdentityService' },
            { t: '版本化部署' },
          ],
          note: 'startTask / userTask / ccTask / serviceTask / automation / subProcess / aiAgent / httpCall',
          noteMono: true,
        },
        {
          en: 'Rule Engine',
          cn: '规则引擎 · RuleGo',
          icon: 'rule',
          tag: '开源',
          tone: 'oss',
          chips: [
            { t: '规则链 DSL', hot: true },
            { t: 'switch / fork / join / inclusive / delay' },
            { t: 'automation 跨链调用' },
          ],
        },
        {
          en: 'Storage',
          cn: '存储层',
          icon: 'storage',
          tag: '',
          tone: 'neutral',
          chips: [{ t: 'PostgreSQL / MySQL' }, { t: '7 张核心表' }, { t: 'Redis 分布式锁（可选）' }],
        },
      ]
)

const flows = computed(() =>
  isEn.value
    ? [
        'DSL · definition_json as the single source of truth',
        'REST / Go API',
        'Rule chain execution · per-tenant pools',
        'GORM dialects',
      ]
    : [
        'DSL · definition_json 唯一真相',
        'REST / Go API',
        '规则链执行 · 按租户分池',
        'GORM 方言',
      ]
)

const legend = computed(() =>
  isEn.value
    ? {
        biz: 'GFlow Platform (commercial)',
        oss: 'Apache-2.0 open source · the boundary is the engine layer',
        aria: 'GFlow five-layer architecture diagram',
      }
    : {
        biz: 'GFlow Platform 商业版',
        oss: 'Apache-2.0 开源 · 分界线在引擎层',
        aria: 'GFlow 五层架构图',
      }
)

const FS = 12.5
function textWidth(s: string, fs: number = FS): number {
  let w = 0
  for (const ch of s) w += ch.charCodeAt(0) > 0xff ? fs : fs * 0.62
  return w
}

// 几何：图例 + 5 层（高 74）+ 4 个流间隙（高 26）
const legendY = 26
const bandH = 74
const gap = 26
const top = 46
const bandX = 14
const bandW = W - 28
const sideW = 196
const chipsX = bandX + sideW

function bandY(i: number): number {
  return top + i * (bandH + gap)
}

function chipWidth(c: Chip): number {
  return textWidth(c.t) + 20
}

function chipsRow(l: Layer): { chip: Chip; x: number; w: number }[] {
  const out: { chip: Chip; x: number; w: number }[] = []
  let x = chipsX
  for (const c of l.chips) {
    const w = chipWidth(c)
    out.push({ chip: c, x, w })
    x += w + 8
  }
  return out
}

function tagWidth(t: string): number {
  return textWidth(t, 10.5) + 18
}
</script>

<template>
  <svg
    class="archimg"
    :viewBox="`0 0 ${W} ${H}`"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="legend.aria"
  >
    <defs>
      <pattern id="archgrid" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M28 0H0V28" fill="none" stroke="rgba(255,246,238,0.035)" stroke-width="1" />
      </pattern>
    </defs>

    <!-- 底板 -->
    <rect x="0.5" y="0.5" :width="W - 1" :height="H - 1" rx="14" fill="#0b1512" stroke="rgba(255,246,238,0.14)" />
    <rect x="1" y="1" :width="W - 2" :height="H - 2" rx="13" fill="url(#archgrid)" />

    <!-- 图例 -->
    <rect x="286" :y="legendY - 10" width="10" height="10" rx="3" fill="#c2372f" />
    <text class="legend-t" x="301" :y="legendY - 1">{{ legend.biz }}</text>
    <rect :x="301 + textWidth(legend.biz) + 16" :y="legendY - 10" width="10" height="10" rx="3" fill="#04784f" />
    <text class="legend-t" :x="301 + textWidth(legend.biz) + 31" :y="legendY - 1">{{ legend.oss }}</text>

    <!-- 层 -->
    <g v-for="(l, i) in layers" :key="l.en">
      <rect
        :x="bandX"
        :y="bandY(i)"
        :width="bandW"
        :height="bandH"
        rx="10"
        fill="rgba(255,246,238,0.03)"
        stroke="rgba(255,246,238,0.13)"
      />
      <!-- 左侧色条 -->
      <rect
        :x="bandX"
        :y="bandY(i) + 6"
        width="3"
        :height="bandH - 12"
        rx="1.5"
        :fill="l.tone === 'biz' ? '#c2372f' : l.tone === 'oss' ? '#2dd48a' : 'rgba(255,246,238,0.3)'"
      />
      <!-- 图标 -->
      <g
        :transform="`translate(${bandX + 18},${bandY(i) + 13}) scale(0.83)`"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="'icon-' + l.tone"
      >
        <path :d="iconPaths[l.icon]" />
      </g>
      <!-- 层名 -->
      <text class="en-t" :x="bandX + 46" :y="bandY(i) + 22">{{ l.en }}</text>
      <text class="cn-t" :x="bandX + 46" :y="bandY(i) + 43">{{ l.cn }}</text>
      <!-- 徽章 -->
      <g v-if="l.tag">
        <rect
          :x="bandX + 16"
          :y="bandY(i) + 52"
          :width="tagWidth(l.tag)"
          height="17"
          rx="8.5"
          class="tag-box"
          :class="'tag-' + l.tone"
        />
        <text class="tag-t" :class="'tag-' + l.tone" :x="bandX + 16 + tagWidth(l.tag) / 2" :y="bandY(i) + 64">{{
          l.tag
        }}</text>
      </g>

      <!-- 右侧芯片 -->
      <g v-for="c in chipsRow(l)" :key="c.chip.t">
        <rect
          :x="c.x"
          :y="bandY(i) + 14"
          :width="c.w"
          height="24"
          rx="7"
          class="chip-box"
          :class="[{ hot: c.chip.hot }, 'chip-' + l.tone]"
        />
        <text class="chip-t" :x="c.x + c.w / 2" :y="bandY(i) + 30">{{ c.chip.t }}</text>
      </g>
      <!-- 注释行 -->
      <text v-if="l.note" class="note-t" :class="{ mono: l.noteMono }" :x="chipsX + 2" :y="bandY(i) + 58">{{
        l.note
      }}</text>
    </g>

    <!-- 层间数据流 -->
    <text v-for="(f, i) in flows" :key="f" class="flow-t" :x="W / 2" :y="bandY(i) + bandH + 17">▼ {{ f }}</text>
  </svg>
</template>

<style scoped>
.archimg {
  display: block;
  width: 100%;
  height: auto;
  max-width: 1040px;
  margin: 16px auto;
}

.en-t {
  font-family: var(--gf-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  fill: #8fa89a;
}

.cn-t {
  font-family: var(--gf-serif);
  font-size: 16px;
  font-weight: 700;
  fill: #fff6ee;
}

.icon-biz { color: #f0b9b3; }
.icon-oss { color: #9fe8c8; }
.icon-neutral { color: #f7f5f0; }

.tag-box.tag-biz { fill: rgba(194, 55, 47, 0.16); stroke: rgba(224, 101, 92, 0.5); }
.tag-box.tag-oss { fill: rgba(0, 168, 107, 0.13); stroke: rgba(45, 212, 160, 0.45); }
.tag-t {
  font-family: var(--gf-mono);
  font-size: 10.5px;
  text-anchor: middle;
  letter-spacing: 0.04em;
}
.tag-t.tag-biz { fill: #f0b9b3; }
.tag-t.tag-oss { fill: #9fe8c8; }

.chip-box {
  fill: rgba(255, 246, 238, 0.045);
  stroke: rgba(255, 246, 238, 0.16);
}
.chip-box.hot.chip-biz { fill: rgba(194, 55, 47, 0.12); stroke: rgba(224, 101, 92, 0.45); }
.chip-box.hot.chip-oss { fill: rgba(0, 168, 107, 0.1); stroke: rgba(45, 212, 160, 0.42); }
.chip-t {
  font-size: 12.5px;
  text-anchor: middle;
  fill: #e8e2d5;
}

.note-t {
  font-size: 11px;
  fill: #97a89c;
}
.note-t.mono {
  font-family: var(--gf-mono);
  font-size: 10.5px;
  fill: #7fae93;
}

.flow-t {
  font-family: var(--gf-mono);
  font-size: 11px;
  text-anchor: middle;
  letter-spacing: 0.05em;
  fill: #7fae93;
}

.legend-t {
  font-size: 12px;
  fill: #c3d4c8;
}
</style>
