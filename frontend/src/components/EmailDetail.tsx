import type { Email, Classification } from "../types"

interface EmailDetailProps {
    email: Email
    classification?: Classification
    onClose: () => void
}

export function EmailDetail({ email, classification, onClose }: EmailDetailProps) {
    const categoryColors: Record<string, string> = {
        Important: "bg-red-100 text-red-800",
        Promotions: "bg-yellow-100 text-yellow-800",
        Social: "bg-blue-100 text-blue-800",
        Marketing: "bg-purple-100 text-purple-800",
        Spam: "bg-gray-100 text-gray-800",
        General: "bg-green-100 text-green-800",
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{email.subject}</h2>
                        <p className="text-sm text-gray-600">{email.from}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-2xl">
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {classification && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Classification</p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[classification.category] || categoryColors["General"]}`}
                                >
                                    {classification.category}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                                <p className="text-lg font-semibold text-blue-600">{(classification.confidence * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                    )}

                    {classification?.reasoning && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Reasoning</p>
                            <p className="text-sm text-gray-600">{classification.reasoning}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Date</p>
                        <p className="text-sm text-gray-600">{new Date(Number.parseInt(email.date)).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Preview</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{email.body || email.snippet}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
