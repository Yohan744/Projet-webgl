import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate';
import './assets/scss/main.css';
import SoundManager from './assets/js/SoundManager';
import HighchartsVue from 'highcharts-vue';

const pinia = createPinia();
pinia.use(createPersistedState({
    storage: {
        getItem: (key) => sessionStorage.getItem(key),
        setItem: (key, value) => sessionStorage.setItem(key, value),
        removeItem: (key) => sessionStorage.removeItem(key),
    },
}));

createApp(App)
    .use(router)
    .use(pinia)
    .use(HighchartsVue)
    .mount('#app');
    

export const useSoundManager = new SoundManager()
