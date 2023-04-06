import { createRouter, createWebHistory } from 'vue-router'

import authRouter from '@/modules/auth/router'
import authAdmin from '@/modules/admin/router'
import authPaciente from '@/modules/paciente/router'
import authProf from '@/modules/profesionales/router'
import principalRouter from '@/modules/principal/router'

import { isAuthenticated, isLoginRequired, isSuspended, role, isAuthenticatedAdmin, isAuthenticatedPaciente, isAuthenticatedProf} from '@/modules/auth/router/isAuthenticated'

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
  
  //PROFESIONAL
  {
    path: '/profesional',
    name: 'profesional-home',
    beforeEnter: [isAuthenticatedProf],
    component: () => import(/* webpackChunkName: "profesional-home" */ '@/modules/profesionales/layouts/ProfesionalLayout'),
    ...authProf
  },

  // Redirección paginas no encontradas
  { path: '/:catchAll(.*)', 
    redirect: '/' 
  },
]

const router = createRouter({
  history: createWebHistory(),
  //history: createWebHashHistory(),
  //history: createMemoryHistory(), NOOO!!!
  routes
})

export default router
