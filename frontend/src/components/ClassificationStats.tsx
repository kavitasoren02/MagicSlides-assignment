interface Classification {
    id: string
    category: string
    confidence: number
    reasoning: string
}

interface ClassificationStatsProps {
    classifications: Classification[]
}

export function ClassificationStats({ classifications }: ClassificationStatsProps) {
    const stats = classifications.reduce(
        (acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const categories = ["Important", "Promotions", "Social", "Marketing", "Spam", "General"]

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Classification Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <div key={category} className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{stats[category] || 0}</div>
                        <p className="text-sm text-gray-600 mt-2">{category}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
