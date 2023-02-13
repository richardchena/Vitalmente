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