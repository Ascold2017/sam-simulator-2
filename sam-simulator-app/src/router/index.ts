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
      path: '/game-map',
      name: 'gameMap',
      component: () => import('../views/MapScreen.vue')
    },
    {
      path: '/radar/:radarGameId',
      name: 'radar',
      component: () => import('../views/RadarScreen/index.vue')
    },
    {
      path: '/sam/:samId',
      name: 'sam',
      component: () => import('../views/SAMScreen/index.vue')
    }
  ]
})

export default router
