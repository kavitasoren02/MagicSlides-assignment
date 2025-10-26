import express, { type Request, type Response } from "express"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

export const authRoutes = express.Router()

interface GoogleTokenPayload {
    iss: string
    azp: string
    aud: string
    sub: string
    email: string
    email_verified: boolean
    iat: number
    exp: number
}

interface GoogleTokenResponse {
    access_token: string
    expires_in: number
    refresh_token?: string
    scope: string
    token_type: string
    id_token: string
}

authRoutes.post("/callback", async (req: Request, res: Response) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" })
        }

        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5173/callback"

        if (!clientId || !clientSecret) {
            return res.status(500).json({ error: "Server configuration error" })
        }

        const tokenResponse = await axios.post<GoogleTokenResponse>("https://oauth2.googleapis.com/token", {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        })

        const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data

        let userInfo: GoogleTokenPayload
        try {
            userInfo = jwtDecode<GoogleTokenPayload>(id_token)
        } catch (error) {
            return res.status(401).json({ error: "Failed to decode user info" })
        }

        res.json({
            accessToken: access_token,
            refreshToken: refresh_token,
            idToken: id_token,
            userEmail: userInfo.email,
            userId: userInfo.sub,
            tokenType: "Bearer",
            expiresIn: expires_in,
        })
    } catch (error: any) {
        res.status(401).json({
            error: error.response?.data?.error_description || "Failed to exchange authorization code",
        })
    }
})

authRoutes.post("/refresh", async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" })
        }

        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            return res.status(500).json({ error: "Server configuration error" })
        }

        const tokenResponse = await axios.post<GoogleTokenResponse>("https://oauth2.googleapis.com/token", {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        })

        const { access_token, expires_in } = tokenResponse.data

        res.json({
            accessToken: access_token,
            expiresIn: expires_in,
        })
    } catch (error: any) {
        res.status(401).json({
            error: "Failed to refresh token",
        })
    }
})

authRoutes.post("/verify", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization
        const accessToken = authHeader?.replace("Bearer ", "")

        if (!accessToken) {
            return res.status(400).json({ error: "Access token is required" })
        }

        const verifyResponse = await axios.get("https://www.googleapis.com/oauth2/v1/tokeninfo", {
            params: { access_token: accessToken },
        })

        res.json({
            valid: true,
            userId: verifyResponse.data.user_id,
            email: verifyResponse.data.email,
            expiresIn: verifyResponse.data.expires_in,
        })
    } catch (error: any) {
        res.status(401).json({
            valid: false,
            error: "Invalid or expired token",
        })
    }
})
