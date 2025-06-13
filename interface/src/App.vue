<script setup>
  import { NConfigProvider, NLoadingBarProvider, useOsTheme, darkTheme } from 'naive-ui'
  import Menu from '@/components/Menu.vue'
  import WebHeader from '@/views/WebHeader.vue'
  import { ref, computed } from 'vue'

  const osTheme = ref(useOsTheme())
  const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
</script>

<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-layout position="absolute">
        <n-layout-header>
          <WebHeader></WebHeader>
        </n-layout-header>
        <n-layout has-sider position="absolute" style="top: 64px">
          <n-layout-sider width="150">
            <Menu></Menu>
          </n-layout-sider>
          <n-layout-content>
            <router-view></router-view>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
