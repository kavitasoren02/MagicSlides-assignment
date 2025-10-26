export function isValidOpenAIKey(key: string): boolean {
    return key.startsWith("sk-") && key.length > 20
}

export function isValidEmail(email: any): boolean {
    return email.id && email.subject && email.from && (email.body || email.snippet)
}

export function isValidClassification(classification: any): boolean {
    const validCategories = ["Important", "Promotions", "Social", "Marketing", "Spam", "General"]
    return (
        classification.id &&
        validCategories.includes(classification.category) &&
        typeof classification.confidence === "number" &&
        classification.confidence >= 0 &&
        classification.confidence <= 1
    )
}
