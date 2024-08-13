import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'
// import './assets/main.scss'
import '@cheny33/ssml-editor/dist/style.css'

import SSMLEditor from '@cheny33/ssml-editor'

const app = createApp(App)

app.use(SSMLEditor)
app.mount('#app')
