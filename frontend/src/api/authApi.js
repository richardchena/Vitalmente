import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://192.168.0.8:80/api/v1',
    /*params: {
        key: 'pass_key'
    }*/
})

export default authApi