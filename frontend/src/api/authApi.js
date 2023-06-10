import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:9000/api/v1',
    //baseURL: 'https://api.clinicavitalmente.com/api/v1',
})

export default authApi