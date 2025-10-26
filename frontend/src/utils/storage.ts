export const storage = {
    setGoogleToken: (token: string) => localStorage.setItem("google_access_token", token),
    getGoogleToken: () => localStorage.getItem("google_access_token"),
    clearGoogleToken: () => localStorage.removeItem("google_access_token"),

    setOpenAIKey: (key: string) => localStorage.setItem("openai_key", key),
    getOpenAIKey: () => localStorage.getItem("openai_key"),
    clearOpenAIKey: () => localStorage.removeItem("openai_key"),

    setEmails: (emails: any[]) => localStorage.setItem("emails", JSON.stringify(emails)),
    getEmails: () => {
        const data = localStorage.getItem("emails")
        return data ? JSON.parse(data) : []
    },
    clearEmails: () => localStorage.removeItem("emails"),

    setClassifications: (classifications: any[]) =>
        localStorage.setItem("classifications", JSON.stringify(classifications)),
    getClassifications: () => {
        const data = localStorage.getItem("classifications")
        return data ? JSON.parse(data) : []
    },
    clearClassifications: () => localStorage.removeItem("classifications"),

    clearAll: () => {
        localStorage.clear()
    },
}
