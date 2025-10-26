import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { OpenAIKeyInput } from "../components/OpenAIKeyInput"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
    const { login } = useAuth()
    const [openaiKey, setOpenaiKey] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const savedKey = localStorage.getItem("openai_key")
        if (savedKey) {
            setOpenaiKey(savedKey)
        }

        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const state = params.get("state")

        if (code) {
            handleOAuthCallback(code, state, savedKey)
        }
    }, [])

    const handleOAuthCallback = async (code: string, state: string | null, keyFromStorage?: string | null) => {
        try {
            setLoading(true)
            setError("")

            const key = keyFromStorage || localStorage.getItem("openai_key")
            if (!key) {
                setError("Please enter your OpenAI API key first")
                setLoading(false)
                return
            }

            const response = await fetch("http://localhost:5000/api/auth/callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to authenticate")
            }

            const data = await response.json()
            login(data.accessToken, data.refreshToken, data.userEmail)
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Authentication failed")
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        if (!openaiKey) {
            setError("Please enter your OpenAI API key first")
            return
        }

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        const redirectUri = `${window.location.origin}/callback`
        const scope = "openid email profile https://www.googleapis.com/auth/gmail.readonly"
        const state = Math.random().toString(36).substring(7)

        sessionStorage.setItem("oauth_state", state)

        const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
        authUrl.searchParams.append("client_id", clientId)
        authUrl.searchParams.append("redirect_uri", redirectUri)
        authUrl.searchParams.append("response_type", "code")
        authUrl.searchParams.append("scope", scope)
        authUrl.searchParams.append("state", state)
        authUrl.searchParams.append("access_type", "offline")
        authUrl.searchParams.append("prompt", "consent")

        window.location.href = authUrl.toString()
    }

    const handleOpenAIKeyChange = (key: string) => {
        setOpenaiKey(key)
        localStorage.setItem("openai_key", key)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Authenticating with Google...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Classifier</h1>
                        <p className="text-gray-600">Organize your inbox with AI-powered classification</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                            <OpenAIKeyInput value={openaiKey} onChange={handleOpenAIKeyChange} />
                            <p className="mt-2 text-xs text-gray-500">Your API key is stored locally and never sent to our servers</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={!openaiKey || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            This app uses Google OAuth for authentication and OpenAI for email classification. Your data is processed
                            securely and stored locally.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
