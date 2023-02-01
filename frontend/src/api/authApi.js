import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost/api/v1',
    /*params: {
        key: 'pass_key'
    }*/
})

export default authApi