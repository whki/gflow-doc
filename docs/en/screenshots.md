---
title: Screenshots
layout: page
sidebar: false
aside: false
---

<script setup>
// ShotGallery 已在主题中全局注册
</script>

<div class="shots-hero">
  <h1 class="shots-title">Screenshots</h1>
  <p class="shots-sub">Every shot below is captured from the live demo environment — what you see is what you get.</p>
</div>

<ShotGallery />

<style scoped>
:global(.main .container) {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

:global(.content) {
  padding: 0 !important;
}

:global(.content-container) {
  max-width: 100% !important;
}

.shots-hero {
  padding: 48px 24px 0;
  text-align: center;
}

.shots-title {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.shots-sub {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
}
</style>
