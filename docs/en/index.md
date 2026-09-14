---
layout: page
sidebar: false
aside: false
notice:
  version: v1.2.0
  date: 2026-09-14
  title: GFlow v1.2.0 Released
  items:
    - Approval node config rework: approver, approval mode, fallback and reject rules in one place
    - Preview who approves each upcoming step when starting or approving
    - New mobile web app: start requests and handle approvals on your phone
    - Inbox-style approval center: todo / done / mine / cc in one place
    - AI approval now reads attachments, including images and documents
  link: /en/changelog
  linkText: Full changelog
---

<script setup>
import { onMounted } from 'vue'
</script>

<HomeHero />
<HomeRepos />
<HomeCapabilities />
<HomeProducts />
<HomePreview />
<HomeDataModel />
<HomeArchitecture />
<HomeQuickstart />
<HomePricingTeaser />
<HomeCta />

<style scoped>
:global(.main .container) {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

:global(.content) {
  padding: 0 !important;
  padding-bottom: 0 !important;
}

:global(.content-container) {
  max-width: 100% !important;
}
</style>
