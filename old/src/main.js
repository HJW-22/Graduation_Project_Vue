// main.ts
import { createApp } from 'vue';
import App from './App.vue';   // 引入主组件
import router from './router/index';  // 引入路由配置
import ElementPlus from 'element-plus'; // 引入元素 Plus
import 'element-plus/dist/index.css'; // 引入元素 Plus 样式

const app = createApp(App);    // 创建 Vue 应用实例
app.use(router);               // 使用路由
app.use(ElementPlus);          // 使用 Element Plus
app.mount('#app');             // 挂载应用