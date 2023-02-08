
import authApi from '@/api/authApi'

export const signInUser = async ({commit}, user) => {
    try {
        const {data: {accessToken, role}} = await authApi.post('/login', user)

        delete user.password
        user.role = role

        commit('loginUser', {user, accessToken})
        return{ok:true}
        
    } catch (error) {
        if (error.code === 'ERR_NETWORK'){
            return  {ok: false, message: 'No es posible conectarse al servidor. Intentelo más tarde'}
        } else {
            return  {ok: false, message: 'La contraseña o usuario que ingresaste es incorrecta.'}
        }
    }
}

export const checkAuthentication = async ({commit}) => {
    const accessToken = localStorage.getItem('accessToken')

    if(!accessToken){
        commit('logout')
        return {ok:false, message: 'No hay token en la peticion'}
    }

    try {
       const {data} = await authApi.post('/verify', {accessToken})

       if(data.status === 0) {
            const user = {
                    username: data.sub,
                    role: data.role
            }

            commit('loginUser', {user, accessToken})
            return {ok:true, cuenta: data.cuenta}
       } else {
            commit('loginUser', {user: null, accessToken})
            return {ok:false, cuenta: null}
       }


    } catch (error) {
        commit('logout')
        return {ok:false, message: error.code}
    }
}

export const cerrar_sesion = async ({commit}) => {
    commit('logout')
}