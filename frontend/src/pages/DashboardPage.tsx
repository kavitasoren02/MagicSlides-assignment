import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { EmailList } from "../components/EmailList"
import { EmailDetail } from "../components/EmailDetail"
import { ClassificationStats } from "../components/ClassificationStats"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ErrorAlert } from "../components/ErrorAlert"
import { SuccessAlert } from "../components/SuccessAlert"
import { api } from "../utils/api"
import { storage } from "../utils/storage"

interface Email {
    id: string
    subject: string
    from: string
    snippet: string
    date: string
    body: string
}

interface Classification {
    id: string
    category: string
    confidence: number
    reasoning: string
}

export function DashboardPage() {
    const { logout, accessToken } = useAuth()
    const navigate = useNavigate()
    const [emails, setEmails] = useState<Email[]>([])
    const [classifications, setClassifications] = useState<Classification[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [step, setStep] = useState<"fetch" | "classify" | "done">("fetch")
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const fetchEmails = async () => {
        try {
            setLoading(true)
            setError("")

            if (!accessToken) {
                setError("Access token not found")
                return
            }

            const response = await api.fetchEmails(accessToken, 5)
            setEmails(response.data.emails)
            storage.setEmails(response.data.emails)
            setStep("classify")
            setSuccess("Successfully fetched 5 emails")
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to fetch emails"
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const classifyEmails = async () => {
        try {
            setLoading(true)
            setError("")

            const openaiKey = storage.getOpenAIKey()
            if (!openaiKey) {
                setError("OpenAI key not found")
                return
            }

            if (emails.length === 0) {
                setError("No emails to classify")
                return
            }

            const response = await api.classifyEmails(emails, openaiKey)
            setClassifications(response.data.classifications)
            storage.setClassifications(response.data.classifications)
            setStep("done")
            setSuccess(`Successfully classified ${response.data.classifications.length} emails`)
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to classify emails"
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const savedEmails = storage.getEmails()
        const savedClassifications = storage.getClassifications()

        if (savedEmails.length > 0) {
            setEmails(savedEmails)
            if (savedClassifications.length > 0) {
                setClassifications(savedClassifications)
                setStep("done")
            } else {
                setStep("classify")
            }
        }
    }, [])

    const getClassificationForEmail = (emailId: string) => {
        return classifications.find((c) => c.id === emailId)
    }

    const handleReset = () => {
        setEmails([])
        setClassifications([])
        setStep("fetch")
        storage.clearEmails()
        storage.clearClassifications()
        setError("")
        setSuccess("")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Email Classifier</h1>
                        <p className="text-sm text-gray-600 mt-1">Powered by OpenAI GPT-4o</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6">
                        <ErrorAlert message={error} onDismiss={() => setError("")} />
                    </div>
                )}

                {success && (
                    <div className="mb-6">
                        <SuccessAlert message={success} onDismiss={() => setSuccess("")} />
                    </div>
                )}

                {step === "fetch" && (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to fetch your emails?</h2>
                        <p className="text-gray-600 mb-6">This will fetch your last 5 emails from Gmail</p>
                        <button
                            onClick={fetchEmails}
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                        >
                            {loading ? "Fetching..." : "Fetch Last 5 Emails"}
                        </button>
                    </div>
                )}

                {step === "classify" && emails.length > 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Found {emails.length} emails</h2>
                        <p className="text-gray-600 mb-6">Ready to classify them with AI?</p>
                        <button
                            onClick={classifyEmails}
                            disabled={loading}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                        >
                            {loading ? "Classifying..." : "Classify Emails with AI"}
                        </button>
                    </div>
                )}

                {loading && step !== "fetch" && step !== "classify" && <LoadingSpinner message="Processing your emails..." />}

                {step === "done" && (
                    <div className="space-y-8">
                        <ClassificationStats classifications={classifications} />
                        <EmailList emails={emails} getClassification={getClassificationForEmail} onSelectEmail={setSelectedEmail} />
                        <div className="text-center">
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Fetch New Emails
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {selectedEmail && (
                <EmailDetail
                    email={selectedEmail}
                    classification={getClassificationForEmail(selectedEmail.id)}
                    onClose={() => setSelectedEmail(null)}
                />
            )}
        </div>
    )
}
