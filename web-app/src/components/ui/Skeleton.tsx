// Skeleton Loader Components
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-neutral-200"></div>
            <div className="p-6 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-neutral-200 rounded"></div>
                </td>
            ))}
        </tr>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-12 bg-neutral-200 rounded-lg"></div>
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                    <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
            ))}
            <div className="h-12 bg-neutral-200 rounded"></div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-10 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
        </div>
    );
}
