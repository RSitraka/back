import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:3000/api`,
    maxBodyLength: 20 * 1024 * 1024, 
})


export default api