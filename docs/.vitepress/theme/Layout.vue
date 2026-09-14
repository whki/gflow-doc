<script setup>
import DefaultTheme from 'vitepress/theme'
import Notice from './components/Notice.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- 首页右下角版本公告（组件内部限定首页渲染） -->
    <template #layout-bottom>
      <Notice />
    </template>
  </Layout>
</template>
