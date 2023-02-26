import { createRouter, createWebHistory } from 'vue-router'

import authRouter from '@/modules/auth/router'
import authAdmin from '@/modules/admin/router'
import principalRouter from '@/modules/principal/router'

import { isAuthenticated, isLoginRequired, isSuspended, role, isAuthenticatedAdmin} from '@/modules/auth/router/isAuthenticated'

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

  //Registrar nuevo paciente
  /*{
    path: '/registrar_paciente',
    name: 'registrar-paciente',
    beforeEnter: [isAuthenticated],
    component: () => import(/* webpackChunkName: "registrar-paciente" */ /*'@/modules/principal/layouts/RegistrarPaciente'),
  },*/

  // Redirección paginas no encontradas
  { path: '/:catchAll(.*)', 
    redirect: '/' 
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
    path: '/enconstruccion',
    name: 'paciente-home',
    component: () => import(/* webpackChunkName: "admin" */ '@/modules/auth/views/prueba_paciente'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
