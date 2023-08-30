import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
    .use(ElementPlus, { locale: zhCn })
    .mount('#app')
