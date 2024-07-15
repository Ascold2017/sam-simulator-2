import { createRouter, createWebHashHistory } from "vue-router";
import HomeScreen from '@/screens/Home/index.vue'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeScreen
        },
        {
            path: '/sam',
            name: 'sam',
            component: () => import('@/screens/SAM/index.vue')
        },
        {
            path: '/editor',
            name: 'editor',
            component: () => import('@/screens/Editor/index.vue')
        }
    ]
});