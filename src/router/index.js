import { createRouter, createWebHistory } from 'vue-router';
import Index from '../pages/Index.vue';
import Experience from '../pages/Experience.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },
    {
        path: '/experience',
        name: 'Experience',
        component: Experience,
        alias: '/experience/'
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
