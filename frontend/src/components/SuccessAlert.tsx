interface SuccessAlertProps {
    message: string
    onDismiss?: () => void
}

export function SuccessAlert({ message, onDismiss }: SuccessAlertProps) {
    return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-green-900 mb-1">Success</h3>
                <p className="text-green-700 text-sm">{message}</p>
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-green-500 hover:text-green-700 font-bold">
                    ×
                </button>
            )}
        </div>
    )
}
