import { createRouter, createWebHistory } from 'vue-router';
import Index from '../pages/Index.vue';
import Experience from '../pages/Experience.vue';
import ErrorPage from '../pages/Error.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index,
        alias: '/home/'
    },
    {
        path: '/experience',
        name: 'Experience',
        component: Experience,
        alias: '/experience/'
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Not-found',
        component: ErrorPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
