import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './routes'
import 'vfonts/Lato.css'
import { create, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, NMenu, NAvatar } from 'naive-ui'
const naive = create({
  components: [NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, NMenu, NAvatar]
})

createApp(App).use(router).use(naive).mount('#app')
