
export const loginUser = (state, {user, accessToken}) => {
    if(accessToken){
        localStorage.setItem('accessToken', accessToken)
        state.accessToken = accessToken
    }

    state.user = user
    state.status = 'authenticated'
}

export const logout = (state) => {
    state.accessToken = null
    state.user = null
    state.status = 'not-authenticated'

    localStorage.removeItem('accessToken')
}