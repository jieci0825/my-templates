import { createApp } from 'vue'
import App from './App.vue'
import { getAppTitle } from './utils'
import './styles/index.scss'
import { createPinia } from 'pinia'
import router from './router'

function bootstrap() {
    document.title = getAppTitle()

    const app = createApp(App)

    const pinia = createPinia()
    app.use(pinia)

    app.use(router)

    app.mount('#app')
}

bootstrap()
