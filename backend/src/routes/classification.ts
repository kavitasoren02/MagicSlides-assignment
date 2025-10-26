import express, { type Request, type Response } from "express"
import { OpenAI } from "openai"
import { generateClassificationPrompt, validateClassification } from "../utils/classification-prompt.js"

export const classificationRoutes = express.Router()

type EmailCategory = "Important" | "Promotions" | "Social" | "Marketing" | "Spam" | "General"

interface ClassificationResult {
    id: string
    category: EmailCategory
    confidence: number
    reasoning: string
}

classificationRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const { emails, openaiKey } = req.body

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ error: "Valid emails array is required" })
        }

        if (!openaiKey || typeof openaiKey !== "string") {
            return res.status(400).json({ error: "OpenAI API key is required" })
        }

        if (emails.length > 50) {
            return res.status(400).json({ error: "Maximum 50 emails can be classified at once" })
        }

        const client = new OpenAI({ apiKey: openaiKey })

        const results: ClassificationResult[] = []
        const errors: Array<{ id: string; error: string }> = []

        for (const email of emails) {
            try {
                if (!email.id) {
                    errors.push({ id: "unknown", error: "Email missing ID" })
                    continue
                }

                const prompt = generateClassificationPrompt({
                    subject: email.subject || "No subject",
                    from: email.from || "Unknown",
                    body: email.body || "",
                    snippet: email.snippet || "",
                })

                const response = await client.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: 300,
                })

                const content = response?.choices[0]?.message.content

                if (!content) {
                    throw new Error("Empty response from OpenAI")
                }

                let parsed
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/)
                    if (!jsonMatch) {
                        throw new Error("No JSON found in response")
                    }
                    parsed = JSON.parse(jsonMatch[0])
                } catch (parseError) {
                    throw new Error("Invalid JSON response from OpenAI")
                }

                if (!validateClassification(parsed)) {
                    throw new Error("Invalid classification format")
                }

                results.push({
                    id: email.id,
                    category: parsed.category as EmailCategory,
                    confidence: Math.min(Math.max(parsed.confidence, 0), 1),
                    reasoning: parsed.reasoning || "",
                })
            } catch (emailError: any) {
                errors.push({
                    id: email.id,
                    error: emailError.message || "Classification failed",
                })

                results.push({
                    id: email.id,
                    category: "General",
                    confidence: 0,
                    reasoning: "Classification failed - defaulted to General",
                })
            }

            await new Promise((resolve) => setTimeout(resolve, 100))
        }

        res.json({
            classifications: results,
            errors: errors.length > 0 ? errors : undefined,
            summary: {
                total: emails.length,
                successful: results.filter((r) => r.confidence > 0).length,
                failed: errors.length,
            },
        })
    } catch (error: any) {

        if (error.message.includes("API key")) {
            return res.status(401).json({
                error: "Invalid OpenAI API key",
            })
        }

        if (error.message.includes("rate limit")) {
            return res.status(429).json({
                error: "Rate limit exceeded. Please try again later.",
            })
        }

        res.status(500).json({
            error: error.message || "Failed to classify emails",
        })
    }
})
