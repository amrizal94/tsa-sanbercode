import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import './axios'
import store from './store'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { PxEditBox, CoTrash } from "oh-vue-icons/icons";

addIcons(PxEditBox, CoTrash);
createApp(App).component("v-icon", OhVueIcon).use(store).use(router).mount('#app')
