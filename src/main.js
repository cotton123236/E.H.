import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router'
import axios from 'axios'
import VueAxios from 'vue-axios'
// components
import App from './App.vue'



const app = createApp(App)

app
  .use(router)
  .use(VueAxios, axios)
  .use(createPinia())

app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')