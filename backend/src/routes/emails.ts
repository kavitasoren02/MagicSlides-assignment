import express, { type Request, type Response } from "express"
import axios from "axios"

export const emailRoutes = express.Router()


interface GmailMessage {
    id: string
    threadId: string
    labelIds: string[]
    snippet: string
    internalDate: string
    payload: {
        headers: Array<{ name: string; value: string }>
        parts?: Array<any>
        body?: { data: string }
    }
}


emailRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization
        const accessToken = authHeader?.replace("Bearer ", "")
        const limit = Number.parseInt(req.query.limit as string) || 15

        if (!accessToken) {
            return res.status(400).json({ error: "Access token is required" })
        }

        const listResponse = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const messageIds = listResponse.data.messages || []

        if (messageIds.length === 0) {
            return res.json({ emails: [] })
        }

        const emailPromises = messageIds.map((msg: { id: string }) =>
            axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        )

        const emailResponses = await Promise.all(emailPromises)

        const emails = emailResponses.map((response) => {
            const message: GmailMessage = response.data
            const headers = message.payload.headers

            const getHeader = (name: string) => {
                return headers.find((h) => h.name === name)?.value || ""
            }

            const body = extractBody(message.payload)

            return {
                id: message.id,
                threadId: message.threadId,
                from: getHeader("From"),
                to: getHeader("To"),
                subject: getHeader("Subject"),
                date: getHeader("Date"),
                snippet: message.snippet,
                body: body,
                internalDate: message.internalDate,
            }
        })

        res.json({ emails })
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message
        res.status(error.response?.status || 500).json({
            error: `Failed to fetch emails from Gmail: ${errorMessage}`,
        })
    }
})


function extractBody(payload: any): string {
    if (payload.body?.data) {
        return Buffer.from(payload.body.data, "base64").toString("utf-8")
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
                return Buffer.from(part.body.data, "base64").toString("utf-8")
            }
        }
    }

    return ""
}
