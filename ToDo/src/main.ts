import { createApp } from 'vue'

// Pinia
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Booststrap
import 'bootstrap/dist/css/bootstrap.css'
// Alerts
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  ssr: true,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App).use(createPinia()).use(router).use(Toast).use(vuetify)
router.isReady().then(() => app.mount('#app'))
