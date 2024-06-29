import { createApp } from 'vue'
import { router } from '@/router'

import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import '@/assets/style.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(mdiVue, {
  icons: mdijs
})

app.mount('#app')
