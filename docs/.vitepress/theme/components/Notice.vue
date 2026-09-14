<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { useI18n } from '../composables/useI18n'

// 从当前页 frontmatter 读取 notice 字段（在 index.md / en/index.md 中配置）
const { frontmatter, page } = useData()
const { isEn } = useI18n()
const notice = computed(() => frontmatter.value.notice)

const expandText = computed(() =>
  isEn.value
    ? { expand: (n: number) => `Show all (${n}) ▾`, collapse: 'Collapse ▴' }
    : { expand: (n: number) => `展开全部（${n} 条）▾`, collapse: '收起 ▴' }
)

// 仅首页（中文 index.md / 英文 en/index.md）弹出
const isHome = computed(() => {
  const p = page.value.relativePath.replaceAll('\\', '/')
  return p === 'index.md' || p === 'en/index.md'
})

// 统一格式化为 YYYY-MM-DD
// 注意：VitePress 把 YAML 里的 Date 对象经 SSR 序列化后，到客户端会变成
// ISO 字符串（如 "2026-06-30T00:00:00.000Z"），所以字符串也要处理
const dateText = computed(() => {
  const d = notice.value?.date
  if (!d) return ''
  if (typeof d === 'string') {
    const s = d.trim()
    // 以 YYYY-MM-DD 开头的（含 ISO 字符串）直接截取前 10 位，避免时区解析偏差
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
    return s
  }
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return String(d)
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const visible = ref(false)
// 默认矮卡；点击「展开全部」长高查看全部条目
const expanded = ref(false)

onMounted(() => {
  if (!isHome.value) return
  const n = notice.value
  if (!n || !n.version) return
  // 已静音该版本 → 永久不弹
  if (localStorage.getItem(`notice-muted:${n.version}`)) return
  // 本会话已弹过 → 不再弹
  if (sessionStorage.getItem(`notice-shown:${n.version}`)) return
  visible.value = true
  sessionStorage.setItem(`notice-shown:${n.version}`, '1')
})

// 仅关闭：本会话不再弹
function close() {
  const v = notice.value?.version
  if (v) sessionStorage.setItem(`notice-shown:${v}`, '1')
  visible.value = false
}

// 永久静音该版本（下次发版 version 变化后会自动重新弹）
function mute() {
  const v = notice.value?.version
  if (v) {
    localStorage.setItem(`notice-muted:${v}`, '1')
    sessionStorage.setItem(`notice-shown:${v}`, '1')
  }
  visible.value = false
}
</script>

<template>
  <Transition name="notice-pop">
    <div v-if="isHome && notice && visible" class="home-notice">
      <div class="notice-card">
        <button class="notice-close" aria-label="关闭" @click="close">×</button>
        <div class="notice-header">
          <span class="notice-badge">NEW</span>
          <h3 class="notice-title">{{ notice.title }}</h3>
        </div>
        <span v-if="dateText" class="notice-date">{{ dateText }}</span>
        <button
          v-if="notice.items && notice.items.length > 1"
          class="notice-expand"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          {{ expanded ? expandText.collapse : expandText.expand(notice.items.length) }}
        </button>
        <div class="notice-list-wrap" :class="{ 'is-collapsed': !expanded }">
          <ul v-if="notice.items && notice.items.length" class="notice-items" :class="{ expanded }">
            <li v-for="(item, i) in notice.items" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="notice-footer">
          <a v-if="notice.link" :href="notice.link" class="notice-link">
            {{ notice.linkText || (isEn ? 'Details' : '查看详情') }} →
          </a>
          <button class="notice-mute" @click="mute">{{ notice.muteText || (isEn ? "Don't show again" : '不再提示') }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.home-notice {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  width: 360px;
  max-width: calc(100vw - 32px);
}

.notice-card {
  position: relative;
  padding: 20px 22px 16px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 14px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.notice-close {
  position: absolute;
  top: 2px;
  right: 2px;
  /* 36px 触屏热区（视觉仍是 20px 的 ×），z-index 压过下方标题行避免被遮 */
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  z-index: 1;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.notice-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 给右上角 36px 关闭热区让位，标题不伸到按钮下面 */
  padding-right: 40px;
}

.notice-badge {
  flex-shrink: 0;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  border-radius: 20px;
}

.notice-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.notice-date {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.notice-expand {
  display: inline-block;
  margin-top: 6px;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: none;
  cursor: pointer;
}

.notice-expand:hover {
  text-decoration: underline;
}

.notice-list-wrap {
  position: relative;
}

/* 收起态列表底部渐隐，提示下方还有内容 */
.notice-list-wrap.is-collapsed::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 34px;
  background: linear-gradient(transparent, var(--vp-c-bg));
  pointer-events: none;
}

.notice-items {
  /* 卡片锚定右下向上生长：默认限高矮卡少遮内容，点击「展开全部」后再长高看全部 */
  max-height: 144px;
  margin: 12px 0 0;
  padding-left: 20px;
  overflow-y: auto;
  list-style: disc;
  color: var(--vp-c-text-2);
  line-height: 1.85;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
  overscroll-behavior: contain;
  transition: max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.notice-items.expanded {
  max-height: min(62vh, 620px);
}

.notice-items ::marker {
  color: var(--vp-c-brand-1);
}

.notice-items li {
  font-size: 13.5px;
}

.notice-items::-webkit-scrollbar {
  width: 4px;
}

.notice-items::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 2px;
}

.notice-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.notice-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.notice-link:hover {
  text-decoration: underline;
}

.notice-mute {
  font-size: 13px;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.notice-mute:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
}

/* 进入/离开动画 */
.notice-pop-enter-active,
.notice-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notice-pop-enter-from,
.notice-pop-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 768px) {
  .home-notice {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .notice-pop-enter-active,
  .notice-pop-leave-active {
    transition: none;
  }

  .notice-items {
    transition: none;
  }
}
</style>
