import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

interface OpenAIKeyInputProps {
    value: string
    onChange: (value: string) => void
}

export function OpenAIKeyInput({ value, onChange }: OpenAIKeyInputProps) {
    const [showKey, setShowKey] = useState(false)

    return (
        <div className="relative">
            <input
                type={showKey ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                {showKey ? <EyeClosed /> : <Eye />}
            </button>
        </div>
    )
}
