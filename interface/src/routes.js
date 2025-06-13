import { createRouter, createWebHistory } from 'vue-router'

const config = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/book-manager', name: 'BookManager', component: () => import('@/views/menu_views/BookManager.vue') },
  { path: '/borrow-manager', name: 'BorrowManager', component: () => import('@/views/menu_views/BorrowManager.vue') },
  { path: '/user-manager', name: 'UserManager', component: () => import('@/views/menu_views/UserManager.vue') },
  { path: '/personal-info', name: 'PersonalInfo', component: () => import('@/views/menu_views/PersonalInfo.vue') }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: config.map((route) => ({
    path: route.path,
    name: route.name,
    component: route.component
  }))
})

export default router
