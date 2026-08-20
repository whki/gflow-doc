<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { isEn } = useI18n()

const props = withDefaults(defineProps<{ text?: string; size?: number }>(), {
  text: '',
  size: 84
})

const label = computed(() => props.text || (isEn.value ? 'Approved' : '同意'))
const arc = computed(() => (isEn.value ? 'GFLOW APPROVAL SEAL' : 'GFLOW 审批专用章'))
const aria = computed(() => (isEn.value ? `Seal: ${label.value}` : `印章：${label.value}`))
</script>

<template>
  <svg
    class="seal-stamp"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    role="img"
    :aria-label="aria"
  >
    <!-- 圆形公章：外圈 + 五角星 + 环形文字 -->
    <circle cx="50" cy="50" r="47" fill="none" stroke="#c2372f" stroke-width="4.5" />
    <circle cx="50" cy="50" r="38.5" fill="none" stroke="#c2372f" stroke-width="1.4" opacity="0.7" />
    <path
      d="M50 26 l4.9 12.2 13.1 .8 -10.1 8.4 3.3 12.7 -11.2 -6.8 -11.2 6.8 3.3 -12.7 -10.1 -8.4 13.1 -.8 z"
      fill="#c2372f"
    />
    <!-- 环形单位名：弧线取 220°（文字宽约 112px，弧长 126px，两端各留余量，
         180° 半圆只有 104px，文字会被裁掉首尾字符，表现为缺「G」） -->
    <defs>
      <path id="seal-arc-top" d="M 19,61.3 A 33,33 0 1 1 81,61.3" />
    </defs>
    <text :font-size="isEn ? 8 : 10" fill="#c2372f" font-family="'Noto Serif SC','Songti SC','SimSun',serif" font-weight="700" :letter-spacing="isEn ? 0.5 : 2">
      <textPath href="#seal-arc-top" startOffset="50%" text-anchor="middle">{{ arc }}</textPath>
    </text>
    <text x="50" y="84" text-anchor="middle" font-size="9" fill="#c2372f"
      font-family="'JetBrains Mono',monospace" letter-spacing="1">RULEGO-BPM</text>
  </svg>
</template>

<style scoped>
.seal-stamp {
  filter: drop-shadow(0 2px 6px rgba(194, 55, 47, 0.35));
  opacity: 0.92;
}

/* multiply 盖章质感只在浅色背景成立：暗色页面上红章会被乘成近黑色而隐没 */
html:not(.dark) .seal-stamp {
  mix-blend-mode: multiply;
}
</style>
