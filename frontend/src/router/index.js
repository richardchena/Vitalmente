import { createRouter, createWebHistory } from 'vue-router'

import authRouter from '@/modules/auth/router'

import { isAuthenticated, isLoginRequired, isSuspended } from '@/modules/auth/router/isAuthenticated'

const routes = [
  {
    path: '/',
    name: 'principal',
    beforeEnter: [isAuthenticated],
    component: () => import(/* webpackChunkName: "Login" */ '@/modules/administrator/components/Navbar'),
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
    component: () => import(/* webpackChunkName: "Login" */ '@/modules/auth/views/Suspendido'),
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
