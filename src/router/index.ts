import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import BookManagement from '../views/BookManagement.vue';
import BorrowingManagement from '../views/BorrowingManagement.vue';
import Return from '../views/ReturnManagement.vue';
import UserManagement from '../views/UserManagement.vue';
import AnnouncementManagement from '../views/AnnouncementManagement.vue';
import PersonalInfo from '../views/PersonalInfo.vue';

// 定义路由类型
const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login }, // 登录路由
  { path: '/home', component: Home },
  { path: '/borrowing', component: BorrowingManagement },
  { path: '/announcements', component: AnnouncementManagement },
  { path: '/personal', component: PersonalInfo },
  { path: "/return",component:Return},
  { path: '/', redirect: '/login' }, // 默认重定向到登录页面
];

// 函数用于根据用户角色动态生成路由
function getUserRoutes(user: { role: string }): Array<RouteRecordRaw> {
  if (user.role === 'admin') {
    // 如果是 admin，返回所有路由
    return [
      ...routes,
      { path: '/books', component: BookManagement },
      { path: '/users', component: UserManagement },
      { path: '/announcements', component: AnnouncementManagement },
    ];
  } else if (user.role === 'user') {
    // 如果是 user，只返回有限的路由
    return [
      ...routes,
      // 不包含 BookManagement 和 UserManagement
    ];
  }
  return routes; // 默认返回基础路由
}

const router = createRouter({
  history: createWebHistory(),
  routes: [], // 初始时没有路由
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!user;

  if (to.path !== '/login' && !isLoggedIn) {
    next('/login'); // 如果没有登录，重定向到登录页面
  } else {
    // 已登录，生成用户路由并添加到 router
    if (isLoggedIn) {
      const userRoutes = getUserRoutes(user);
      userRoutes.forEach(route => {
        if (!router.getRoutes().some(r => r.path === route.path)) {
          router.addRoute(route); // 动态添加路由
        }
      });
    }
    next(); // 继续导航
  }
});

export default router;