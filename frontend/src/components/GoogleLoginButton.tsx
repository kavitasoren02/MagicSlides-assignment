import { useEffect, useRef } from "react"

interface GoogleLoginButtonProps {
    onSuccess: (token: string) => void
    onError: (error: string) => void
}

declare global {
    interface Window {
        google: any
    }
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        script.onload = () => {
            if (window.google && containerRef.current) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                })

                window.google.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    size: "large",
                    theme: "outline",
                    text: "signin_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                })
            }
        }

        script.onerror = () => {
            onError("Failed to load Google Sign-In")
        }

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [onSuccess, onError])

    const handleCredentialResponse = async (response: any) => {
        try {
            if (!response.credential) {
                throw new Error("No credential received")
            }

            const backendResponse = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idToken: response.credential }),
                },
            )

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json()
                throw new Error(errorData.error || "Authentication failed")
            }

            const data = await backendResponse.json()
            
            if (!data.accessToken) {
                throw new Error("No access token received")
            }

            onSuccess(data.accessToken)
        } catch (error: any) {
            onError(error.message || "Authentication failed")
        }
    }

    return (
        <div className="flex justify-center">
            <div ref={containerRef} className="w-full flex justify-center"></div>
        </div>
    )
}
