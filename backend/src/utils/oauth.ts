import axios from "axios"

export async function refreshGoogleToken(refreshToken: string): Promise<string> {
    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        })

        return response.data.access_token
    } catch (error) {
        throw new Error("Failed to refresh token")
    }
}


export async function getGoogleUserInfo(accessToken: string) {
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return response.data
    } catch (error) {
        throw new Error("Failed to get user info")
    }
}
