import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "./authStore"
import type { AuthResult } from "./types"
import { api } from "@/lib/api"

export interface LoginInput{
    email:string,
    password:string
}

export function useLogin(){
    const setSession = useAuthStore((state)=>state.setSession)

    return useMutation({
        mutationFn: async (input: LoginInput) => {
            const {data} = await api.post<AuthResult>('/auth/login', input)
            return data
        },
        //ran after mutationFn successfully returns data
        onSuccess:setSession
        // is equivalent to
        // onSuccess: (data) => setSession(data)
    })
}