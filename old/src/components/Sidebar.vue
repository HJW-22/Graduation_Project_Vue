<template>
  <el-aside width="200px">
    <el-scrollbar>
      <el-menu :default-openeds="['1', '3']">
        <el-menu-item index="/" @click="navigateTo('/home')">
          <el-icon>
            <location />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-menu-item v-if="canAccess('books')" index="2" @click="navigateTo('/books')">
          <template #title>
            <span>图书管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="3" @click="navigateTo('/borrowing')">
          <template #title>
            <span>借阅图书</span>
          </template>
        </el-menu-item>
        <el-menu-item index="4" @click="navigateTo('/return')">
          <template #title>
            <span>归还图书</span>
          </template>
        </el-menu-item>

        <el-menu-item v-if="canAccess('users')" index="5" @click="navigateTo('/users')">
          <template #title>
            <span>用户管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="6" v-if="canAccess('announcement')"@click="navigateTo('/announcements')">
          <template #title>
            <span>明细管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="7" @click="navigateTo('/personal')">
          <template #title>
            <span>个人信息</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || 'null'); // 获取用户信息

const navigateTo = (path) => {
  router.push(path); // 导航到指定路径
};

// 权限判断函数
const canAccess = (feature) => {
  if (!user) return false; // 未登录用户

  if (user.role === 'admin') {
    return true; // 管理员可以访问所有功能
  } else if (user.role === 'user') {
    // 用户无法访问图书管理和用户管理
    return !(feature === 'books' || feature === 'users'||feature=="announcement");
  }
  return false; // 其他角色默认不允许访问
};
</script>

<style scoped>
/* 这里可以添加样式 */
</style>