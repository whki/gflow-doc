---
layout: page
sidebar: false
aside: false
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
