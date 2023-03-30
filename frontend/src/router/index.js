import { createRouter, createWebHistory } from 'vue-router'

import authRouter from '@/modules/auth/router'
import authAdmin from '@/modules/admin/router'
import authPaciente from '@/modules/paciente/router'
import principalRouter from '@/modules/principal/router'

import { isAuthenticated, isLoginRequired, isSuspended, role, isAuthenticatedAdmin, isAuthenticatedPaciente} from '@/modules/auth/router/isAuthenticated'

const routes = [
  {
    path: '/',
    beforeEnter: [isAuthenticated, role],
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

  //ADMINISTRACION
  {
    path: '/admin',
    name: 'admin',
    beforeEnter: [isAuthenticatedAdmin],
    component: () => import(/* webpackChunkName: "admin" */ '@/modules/admin/layouts/PrincipalAdmin'),
    ... authAdmin
  },

  //PACIENTE
  {
    path: '/portal',
    name: 'paciente-home',
    beforeEnter: [isAuthenticatedPaciente],
    component: () => import(/* webpackChunkName: "paciente-home" */ '@/modules/paciente/layouts/Paciente'),
    ...authPaciente
  },
  

  // Redirección paginas no encontradas
  { path: '/:catchAll(.*)', 
    redirect: '/' 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
