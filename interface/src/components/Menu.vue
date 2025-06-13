<script setup>
  import { ref, h } from 'vue'
  import { RouterLink } from 'vue-router'
  const options = ref([
    {
      label: () =>
        h(
          RouterLink,
          {
            to: { name: 'Home' }
          },
          { default: () => '首页' }
        ),
      key: 'Home'
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: { name: 'BookManager' }
          },
          { default: () => '图书管理' }
        ),
      key: 'BookManager'
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: { name: 'BorrowManager' }
          },
          { default: () => '借阅管理' }
        ),
      key: 'BorrowManager'
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: { name: 'UserManager' }
          },
          { default: () => '用户管理' }
        ),
      key: 'UserManager'
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: { name: 'PersonalInfo' }
          },
          { default: () => '个人信息' }
        ),
      key: 'PersonalInfo'
    }
  ])
</script>
<template>
  <n-menu :options="options" />
</template>
