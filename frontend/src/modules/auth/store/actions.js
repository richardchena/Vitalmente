
import authApi from '@/api/authApi'

export const signInUser = async ({commit}, user) => {
    //const {username, password} = user
    //console.log(user.username);
    //console.log(user.password);

    try {
        const {data: {accessToken, role}} = await authApi.post('/login', user)

        delete user.password
        user.role = role

        commit('loginUser', {user, accessToken})
        return{ok:true}
        
    } catch (error) {
        return  {ok: false, message: 'La contraseña o usuario que ingresaste es incorrecta.'}
    }
}