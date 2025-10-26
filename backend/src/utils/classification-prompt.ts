export function generateClassificationPrompt(email: {
    subject: string
    from: string
    body: string
    snippet: string
}): string {
    const body = (email.body || email.snippet || "").substring(0, 1000)

    return `You are an expert email classifier. Analyze the following email and classify it into ONE of these categories:

Categories:
1. Important: Personal or work-related emails requiring immediate attention (urgent, time-sensitive, from important contacts)
2. Promotions: Sales, discounts, special offers, and marketing campaigns
3. Social: Emails from social networks, friends, family, and personal connections
4. Marketing: Marketing newsletters, notifications, and informational emails
5. Spam: Unwanted, unsolicited, or suspicious emails
6. General: Emails that don't fit the above categories

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${body}

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "category": "CategoryName",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this email was classified this way"
}

Remember:
- confidence should be a number between 0 and 1
- category must be exactly one of: Important, Promotions, Social, Marketing, Spam, General
- Keep reasoning concise (1-2 sentences)`
}


export function validateClassification(data: any): boolean {
    if (!data || typeof data !== "object") return false
    if (!["Important", "Promotions", "Social", "Marketing", "Spam", "General"].includes(data.category)) return false
    if (typeof data.confidence !== "number" || data.confidence < 0 || data.confidence > 1) return false
    if (typeof data.reasoning !== "string") return false
    return true
}
