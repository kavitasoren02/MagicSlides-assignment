import { useState, useEffect, useCallback } from "react"

interface AuthState {
    isAuthenticated: boolean
    accessToken: string | null
    refreshToken: string | null
    userEmail: string | null
    loading: boolean
}

export function useAuth() {
    const [auth, setAuth] = useState<AuthState>({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userEmail: null,
        loading: true,
    })

    useEffect(() => {
        const token = localStorage.getItem("google_access_token")
        const refreshToken = localStorage.getItem("google_refresh_token")
        const userEmail = localStorage.getItem("user_email")

        setAuth({
            isAuthenticated: !!token,
            accessToken: token,
            refreshToken: refreshToken,
            userEmail: userEmail,
            loading: false,
        })
    }, [])

    const login = useCallback((accessToken: string, refreshToken: string | null, userEmail: string) => {
        localStorage.setItem("google_access_token", accessToken)
        if (refreshToken) {
            localStorage.setItem("google_refresh_token", refreshToken)
        }
        localStorage.setItem("user_email", userEmail)

        setAuth({
            isAuthenticated: true,
            accessToken,
            refreshToken,
            userEmail,
            loading: false,
        })
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem("google_access_token")
        localStorage.removeItem("google_refresh_token")
        localStorage.removeItem("user_email")
        localStorage.removeItem("openai_key")
        localStorage.removeItem("emails")
        localStorage.removeItem("classifications")

        setAuth({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            userEmail: null,
            loading: false,
        })
    }, [])

    return { ...auth, login, logout }
}
