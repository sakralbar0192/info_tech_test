import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

if (import.meta.env.VITE_USE_MOCK !== 'false') {
  const { worker } = await import('./mock/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

const app = createApp(App)

app.use(router)

app.mount('#app')
