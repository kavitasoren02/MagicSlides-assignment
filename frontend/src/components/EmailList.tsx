import type { Email, Classification } from "../types"
import { EmailListItem } from "./EmailListItem"

interface EmailListProps {
    emails: Email[]
    getClassification: (emailId: string) => Classification | undefined
    onSelectEmail: (email: Email) => void
}

export function EmailList({ emails, getClassification, onSelectEmail }: EmailListProps) {
    if (emails.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">No emails to display</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Classified Emails ({emails.length})</h2>
            <div className="grid gap-3">
                {emails.map((email) => (
                    <EmailListItem
                        key={email.id}
                        email={email}
                        classification={getClassification(email.id)}
                        onClick={() => onSelectEmail(email)}
                    />
                ))}
            </div>
        </div>
    )
}
