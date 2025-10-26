export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm">{message}</p>
        </div>
    )
}
