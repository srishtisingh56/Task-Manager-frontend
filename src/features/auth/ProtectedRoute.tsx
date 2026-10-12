import { parseUtc } from "@/lib/dates"
import { isSessionValid, useAuthStore } from "./authStore"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"

export function ProtectedRoute(){
    const location = useLocation()
    const valid = useAuthStore((state) => isSessionValid(state))
    const expiresAtUtc = useAuthStore((state) => state.expiresAtUtc)
    const logout = useAuthStore((state) => state.logout)
    
    useEffect(() => {
        if(!expiresAtUtc)
            return
        const msLeft = parseUtc(expiresAtUtc).getTime() - Date.now()
        const timer = setTimeout(logout,Math.max(msLeft,0))
        return () => clearTimeout(timer)
    }, [expiresAtUtc, logout])

    if(!valid)
        return <Navigate to="/login" replace state={{from: location.pathname}} />
    return <Outlet />

}