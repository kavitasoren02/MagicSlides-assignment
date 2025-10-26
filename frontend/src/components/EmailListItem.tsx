import type { Email, Classification } from "../types"

interface EmailListItemProps {
    email: Email
    classification?: Classification
    onClick: () => void
}

const categoryColors: Record<string, string> = {
    Important: "bg-red-100 text-red-800 border-l-4 border-red-500",
    Promotions: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    Social: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
    Marketing: "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
    Spam: "bg-gray-100 text-gray-800 border-l-4 border-gray-500",
    General: "bg-green-100 text-green-800 border-l-4 border-green-500",
}

export function EmailListItem({ email, classification, onClick }: EmailListItemProps) {
    const categoryClass = classification
        ? categoryColors[classification.category] || categoryColors["General"]
        : "bg-white border-l-4 border-gray-300"

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-lg shadow hover:shadow-lg transition-all ${categoryClass}`}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{email.subject || "(No subject)"}</h3>
                    <p className="text-sm opacity-75 mt-1 truncate">{email.from}</p>
                    <p className="text-sm opacity-60 mt-2 line-clamp-2">{email.snippet}</p>
                </div>
                {classification && (
                    <div className="flex-shrink-0 text-right">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-50">
                            {classification.category}
                        </span>
                        <p className="text-xs opacity-60 mt-1">{(classification.confidence * 100).toFixed(0)}%</p>
                    </div>
                )}
            </div>
        </button>
    )
}
