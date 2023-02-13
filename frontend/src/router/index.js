import { createRouter, createWebHistory } from 'vue-router'

import authRouter from '@/modules/auth/router'
import principalRouter from '@/modules/principal/router'

import { isAuthenticated, isLoginRequired, isSuspended} from '@/modules/auth/router/isAuthenticated'

const routes = [
  {
    path: '/',
    beforeEnter: [isAuthenticated],
    ...principalRouter
  },

  {
    path: '/login',
    beforeEnter: [isLoginRequired],
    ... authRouter
  },

  {
    path: '/suspended-account',
    name: 'cuenta-suspendida',
    beforeEnter: [isSuspended],
    component: () => import(/* webpackChunkName: "cuenta_suspendida" */ '@/modules/auth/views/Suspendido'),
  },

  // Redirección paginas no encontradas
  { path: '/:catchAll(.*)', 
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
