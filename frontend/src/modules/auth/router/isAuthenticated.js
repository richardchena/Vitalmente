import store from '@/store'

export const isAuthenticated = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next(null)
    else if (ok && cuenta !== 'A') next({name: 'cuenta-suspendida'})
    else next({name: 'login'})
}

export const isLoginRequired = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next({name: 'principal'})
    else if (ok && cuenta !== 'A') next({name: 'cuenta-suspendida'})
    else next()
}

export const isSuspended = async (to, from, next) => {
    const {ok, cuenta} = await store.dispatch('auth/checkAuthentication')
    if(ok && cuenta === 'A') next({name: 'principal'})
    else if (ok && cuenta !== 'A') next()
    else next({name: 'login'})
}