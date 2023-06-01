import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:9000/api/v1',

})

export default authApi