import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:80/api/v1',
    /*params: {
        key: 'pass_key'
    }*/
})

export default authApi