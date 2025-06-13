import './assets/main.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(Antd).use(pinia).mount('#app')
