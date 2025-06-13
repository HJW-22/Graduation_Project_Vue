<template>
  <div>
    <div v-if="isLoginPage">
      <LoginPage /> <!-- 登录组件 -->
    </div>
    <div v-else>
      <el-container class="layout-container-demo">
        <Sidebar /> <!-- 侧边栏组件 -->
        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <div class="toolbar">
              <el-dropdown>
                <el-icon style="margin-right: 8px; margin-top: 1px">
                  <Setting />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    <!-- <el-dropdown-item>View</el-dropdown-item>
                    <el-dropdown-item>Add</el-dropdown-item> -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <span>{{ userName }}</span> <!-- 显示用户或管理员 -->
            </div>
          </el-header>
          <el-main>
            <el-scrollbar style="height: 100%">
              <router-view /> <!-- 动态加载子路由组件 -->
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoginPage from "@/views/Login.vue"; // 导入登录组件
import Sidebar from "@/components/Sidebar.vue"; // 导入侧边栏组件
import { Setting } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();

const isLoginPage = computed(() => route.path === '/login'); // 如果当前路径为 '/login'，则为登录页面

const userName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("当前用户信息:", user);
  if (user) {
    if (user.role === 'admin') {
      return "你好, 管理员"; // 对管理员的欢迎消息
    } else {
      return `你好, ${user.username}`; // 对普通用户的欢迎消息
    }
  }
  return '你好, 访客'; // 未登录用户
});

// 监听用户登录事件并更新用户信息
const userLoggedInListener = () => {
  console.log("用户信息更新事件捕获");
  // 这里可以直接更新视图，userName 会自动被视图更新
};

// 退出登录函数
const logout = () => {
  localStorage.removeItem('user'); // 从 localStorage 移除用户信息
  router.push('/login'); // 跳转到登录页面
};

// 组件挂载后添加事件监听
onMounted(() => {
  window.addEventListener("userLoggedIn", userLoggedInListener);
});

// 在组件销毁后移除事件监听
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  window.removeEventListener("userLoggedIn", userLoggedInListener);
});
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  right: 20px;
}
</style>