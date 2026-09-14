<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SectionHead from './SectionHead.vue'
import { useI18n } from '../composables/useI18n'

const DEMO_URL = 'http://8.134.32.225:8081'

const { isEn, link } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        head: {
          title: 'The product, in pictures',
          desc: 'Real screens from the live demo: from designing the flow to approving it on a phone — no mockups.',
        },
        slides: [
          { src: '/images/screens/d-dashboard.webp', title: 'Workbench', desc: 'Today’s pending tasks, recent activity and quick actions at a glance' },
          { src: '/images/screens/d-todo.webp', title: 'Approval Inbox', desc: 'Inbox-style to-do list: summary cards, batch actions, keyboard navigation' },
          { src: '/images/screens/d-detail.webp', title: 'Approval Detail', desc: 'Form, flow canvas and timeline — with every upcoming approver predicted' },
          { src: '/images/screens/d-create.webp', title: 'New Request', desc: 'Pick a template, fill the form, submit — done in one minute' },
          { src: '/images/screens/d-designer.webp', title: 'Process Designer', desc: 'Tree-style designer: approvers, approval mode and fallback rules in one drawer' },
          { src: '/images/screens/d-formdesigner.webp', title: 'Form Designer', desc: 'Drag-and-drop fields with field-level permissions' },
        ],
        phones: [
          { src: '/images/screens/m-todos.webp', title: 'Approve on mobile' },
          { src: '/images/screens/m-detail.webp', title: 'Detail & timeline' },
          { src: '/images/screens/m-create.webp', title: 'Start a request' },
        ],
        phonesTitle: 'Mobile H5, out of the box',
        more: 'Browse all screenshots →',
        demo: 'Open Live Demo',
        prev: 'Previous screenshot',
        next: 'Next screenshot',
        goto: 'Go to screenshot',
      }
    : {
        head: {
          title: '界面一览',
          desc: '全部来自线上演示环境的真实截图：从设计流程到手机上审批，不是设计稿。',
        },
        slides: [
          { src: '/images/screens/d-dashboard.webp', title: '工作台', desc: '今日待办、最近活动、快捷操作，一屏掌握' },
          { src: '/images/screens/d-todo.webp', title: '审批中心 · 待办', desc: '收件箱式待办：摘要卡、批量操作、键盘流式处理' },
          { src: '/images/screens/d-detail.webp', title: '审批详情', desc: '表单、流程画布、时间线，后续每个环节谁来审一目了然' },
          { src: '/images/screens/d-create.webp', title: '发起申请', desc: '选模板、填表单、提交，一分钟发起' },
          { src: '/images/screens/d-designer.webp', title: '流程设计器', desc: '树形设计器：审批人、审批方式、驳回规则集中一处配置' },
          { src: '/images/screens/d-formdesigner.webp', title: '表单设计器', desc: '拖拽字段搭建表单，支持字段级权限' },
        ],
        phones: [
          { src: '/images/screens/m-todos.webp', title: '手机上审批' },
          { src: '/images/screens/m-detail.webp', title: '详情与时间线' },
          { src: '/images/screens/m-create.webp', title: '手机上发起' },
        ],
        phonesTitle: '移动端 H5，开箱即用',
        more: '查看全部界面截图 →',
        demo: '打开在线演示',
        prev: '上一张截图',
        next: '下一张截图',
        goto: '跳转到第',
      }
)

const idx = ref(0)
const dir = ref(1)
let timer: ReturnType<typeof setInterval> | null = null
const paused = ref(false)
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function step(d: number) {
  const n = T.value.slides.length
  idx.value = (idx.value + d + n) % n
}

function tick() {
  if (paused.value || reduced) return
  // 钟摆式：到两端自动反向，避免大跨度回绕跳动
  if (idx.value >= T.value.slides.length - 1) dir.value = -1
  else if (idx.value <= 0) dir.value = 1
  step(dir.value)
}

onMounted(() => {
  timer = setInterval(tick, 4200)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const cur = computed(() => T.value.slides[idx.value])
</script>

<template>
  <section class="home-section paper-section">
    <div class="home-inner">
      <SectionHead
        eyebrow="Section 04 · Screenshots"
        :title="T.head.title"
        :desc="T.head.desc"
      />

      <!-- 桌面端轮播 -->
      <div
        class="shot-frame"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @touchstart="paused = true"
        @touchend="paused = false"
      >
        <div class="win-bar">
          <span class="win-dot r"></span><span class="win-dot y"></span><span class="win-dot g"></span>
          <span class="win-url">GFlow · {{ cur.title }}</span>
        </div>

        <div class="carousel">
          <div class="track" :style="{ transform: `translateX(-${idx * 100}%)` }">
            <div v-for="s in T.slides" :key="s.src" class="slide">
              <img :src="s.src" :alt="`${s.title} — ${s.desc}`" loading="lazy" width="1600" height="900" />
            </div>
          </div>
          <button class="nav prev" :aria-label="T.prev" @click="step(-1)">‹</button>
          <button class="nav next" :aria-label="T.next" @click="step(1)">›</button>
          <div class="cap-bar">
            <span class="cap-title">{{ cur.title }}</span>
            <span class="cap-desc">{{ cur.desc }}</span>
          </div>
        </div>

        <div class="dots" role="tablist">
          <button
            v-for="(s, i) in T.slides"
            :key="i"
            class="dot"
            :class="{ on: i === idx }"
            :aria-label="`${T.goto} ${i + 1}`"
            @click="idx = i"
          ></button>
        </div>
      </div>

      <!-- 移动端并排 -->
      <div class="phones-block">
        <h3 class="phones-title">{{ T.phonesTitle }}</h3>
        <div class="phones">
          <figure v-for="p in T.phones" :key="p.src" class="phone">
            <div class="phone-screen">
              <span class="phone-notch"></span>
              <img :src="p.src" :alt="p.title" loading="lazy" width="585" height="996" />
            </div>
            <figcaption class="phone-cap">{{ p.title }}</figcaption>
          </figure>
        </div>
      </div>

      <div class="preview-cta">
        <a class="gf-btn gf-btn-primary" :href="link('/screenshots')">{{ T.more }}</a>
        <a class="gf-btn gf-btn-ghost" :href="DEMO_URL" target="_blank" rel="noopener">{{ T.demo }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shot-frame {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(15, 42, 82, 0.12);
  background: #fff;
  box-shadow: 0 40px 80px -46px rgba(15, 42, 82, 0.45);
}

.win-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  background: #f2f5f9;
  border-bottom: 1px solid rgba(15, 42, 82, 0.08);
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
  color: #7d8f9f;
}

.carousel {
  position: relative;
  overflow: hidden;
  background: #f5f7fa;
}

.track {
  display: flex;
  transition: transform 0.55s cubic-bezier(0.33, 0.9, 0.3, 1);
}

.slide {
  flex: 0 0 100%;
  line-height: 0;
}

.slide img {
  width: 100%;
  height: auto;
  display: block;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.92);
  color: #1f3a5f;
  font-size: 22px;
  line-height: 1;
  box-shadow: 0 4px 14px rgba(15, 42, 82, 0.22);
  opacity: 0;
  transition: opacity 0.2s;
}

.carousel:hover .nav {
  opacity: 1;
}

.nav.prev { left: 14px; }
.nav.next { right: 14px; }

.cap-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 18px;
  background: linear-gradient(transparent, rgba(10, 25, 47, 0.78));
  color: #fff;
}

.cap-title {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}

.cap-desc {
  font-size: 13px;
  opacity: 0.85;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 0 14px;
  background: #fff;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: #c9d6e4;
  transition: all 0.25s;
}

.dot.on {
  width: 22px;
  border-radius: 4px;
  background: var(--gf-brand, #2456d6);
}

.phones-block {
  margin-top: 54px;
}

.phones-title {
  text-align: center;
  font-size: 18px;
  margin: 0 0 26px;
  color: var(--vp-c-text-1);
}

.phones {
  display: flex;
  justify-content: center;
  gap: 34px;
  flex-wrap: wrap;
}

.phone {
  margin: 0;
  text-align: center;
}

.phone-screen {
  position: relative;
  width: 196px;
  margin: 0 auto;
  border-radius: 26px;
  border: 5px solid #10233f;
  background: #10233f;
  overflow: hidden;
  box-shadow: 0 26px 48px -26px rgba(15, 42, 82, 0.55);
}

.phone-screen img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 20px;
}

.phone-notch {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 9px;
  border-radius: 6px;
  background: #10233f;
  z-index: 1;
}

.phone-cap {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.preview-cta {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .cap-desc { display: none; }
  .nav { opacity: 1; width: 34px; height: 34px; }
  .phone-screen { width: 168px; }
}
</style>
