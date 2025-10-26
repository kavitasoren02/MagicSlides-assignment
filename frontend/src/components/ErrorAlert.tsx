interface ErrorAlertProps {
    message: string
    onDismiss?: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{message}</p>
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-red-500 hover:text-red-700 font-bold">
                    ×
                </button>
            )}
        </div>
    )
}
