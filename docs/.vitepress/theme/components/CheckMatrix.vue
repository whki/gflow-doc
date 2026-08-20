<script setup lang="ts">
defineProps<{
  groups: { title: string; items: string[] }[]
}>()
</script>

<template>
  <div class="cm-wrap">
    <div v-for="g in groups" :key="g.title" class="cm-group">
      <div class="cm-title">{{ g.title }}</div>
      <div class="cm-grid">
        <span v-for="it in g.items" :key="it" class="cm-item">
          <span class="cm-check" aria-hidden="true">✓</span>{{ it }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cm-wrap {
  display: grid;
  gap: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 18px 20px;
  background: var(--vp-c-bg-soft);
  margin: 8px 0 20px;
}

.cm-group + .cm-group {
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 14px;
}

.cm-title {
  font-family: var(--gf-serif);
  font-weight: 700;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.cm-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
}

.cm-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  line-height: 1;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 7px 12px 7px 8px;
  background: var(--vp-c-bg);
}

.cm-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: var(--vp-c-brand-1);
}
</style>
