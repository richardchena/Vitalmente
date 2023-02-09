

export const currentStatus = (state) => {
    return state.status
}
   
export const username = (state) => {
    return state.user ?.username || ''
}

export const accessToken = (state) => {
    return state.accessToken
}