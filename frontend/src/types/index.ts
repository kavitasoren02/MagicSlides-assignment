export interface Email {
    id: string
    subject: string
    from: string
    snippet: string
    date: string
    body: string
}

export interface Classification {
    id: string
    category: string
    confidence: number
    reasoning: string
}
