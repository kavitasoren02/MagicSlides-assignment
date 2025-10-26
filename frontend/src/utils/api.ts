import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const api = {
    exchangeGoogleCode: (idToken: string) => axios.post(`${API_URL}/api/auth/google`, { idToken }),

    verifyToken: (accessToken: string) =>
        axios.post(
            `${API_URL}/api/auth/verify`,
            { accessToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        ),

    fetchEmails: (accessToken: string, limit = 15) =>
        axios.get(`${API_URL}/api/emails`, {
            params: { limit },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),

    classifyEmails: (emails: any[], openaiKey: string) => axios.post(`${API_URL}/api/classify`, { emails, openaiKey }),
}
