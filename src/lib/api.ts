import { useAuthStore } from '@/features/auth/authStore'
import axios from 'axios'

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config)=>{
        const token = useAuthStore.getState().token
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginCall = error.config?.url?.includes('/auth')
        if(error.response?.status === 401 && !isLoginCall){
            useAuthStore.getState().logout()
        }
        return Promise.reject(error)
    }
)

