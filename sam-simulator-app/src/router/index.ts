import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: () => import('../views/StartScreen.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameScreen.vue')
    }
  ]
})

export default router
