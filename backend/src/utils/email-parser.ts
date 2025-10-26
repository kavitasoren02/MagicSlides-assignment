/**
 * Parse email headers to extract key information
 */
export function parseEmailHeaders(headers: Array<{ name: string; value: string }>) {
    const headerMap: Record<string, string> = {}

    headers.forEach((header) => {
        headerMap[header.name.toLowerCase()] = header.value
    })

    return {
        from: headerMap["from"] || "",
        to: headerMap["to"] || "",
        subject: headerMap["subject"] || "",
        date: headerMap["date"] || "",
        messageId: headerMap["message-id"] || "",
        inReplyTo: headerMap["in-reply-to"] || "",
    }
}

/**
 * Extract plain text body from email payload
 */
export function extractEmailBody(payload: any): string {
    // If body is directly available
    if (payload.body?.data) {
        try {
            return Buffer.from(payload.body.data, "base64").toString("utf-8")
        } catch (e) {
            return ""
        }
    }

    // If email has parts (multipart)
    if (payload.parts && Array.isArray(payload.parts)) {
        for (const part of payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
                try {
                    return Buffer.from(part.body.data, "base64").toString("utf-8")
                } catch (e) {
                    continue
                }
            }
        }

        // Fallback to first text part
        for (const part of payload.parts) {
            if (part.mimeType?.startsWith("text/") && part.body?.data) {
                try {
                    return Buffer.from(part.body.data, "base64").toString("utf-8")
                } catch (e) {
                    continue
                }
            }
        }
    }

    return ""
}
