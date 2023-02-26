import store from '@/store'

export const isAuthenticated = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next()
    else if (ok && cuenta !== 'A') next({path: '/suspended-account'}) //next({name: 'cuenta-suspendida'}) error! ver
    else next({path: '/login'}) //next({name: 'login'})
}

export const isLoginRequired = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next({path: '/'}) //next({name: 'principal'})
    else if (ok && cuenta !== 'A')  next({path: '/suspended-account'}) //next({name: 'cuenta-suspendida'})
    else next()
}

export const isSuspended = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next({path: '/'}) //next({name: 'principal'})
    else if (ok && cuenta !== 'A') next()
    else next({path: '/login'}) //next({name: 'login'})
}

export const role = async (to, from, next) => {
    const role = store.getters['auth/role']
    if(role === 1) next({name: 'menu-admin'})
    else next({name: 'paciente-home'})
}


export const isAuthenticatedAdmin = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') {
        const role = store.getters['auth/role']
        if(role === 1) next()
        else if(role === 2) next({name: 'paciente-home'}) //profesional
        else next({name: 'paciente-home'})
    }
    else if (ok && cuenta !== 'A') {
        next({path: '/suspended-account'})}
    else {
        next({path: '/login'})
    }
}