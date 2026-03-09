/* ─────────────────────────────────────────
   Skeleton – reusable shimmer loader blocks
───────────────────────────────────────── */

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded ${className}`}
        />
    );
}

/* ── Product Card Skeleton ── */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
            {/* Image */}
            <div className="aspect-square bg-gray-200 animate-pulse" />

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow gap-3">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <div className="mt-auto flex items-center justify-between gap-3">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

/* ── Product Detail Skeleton ── */
export function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back button */}
            <Skeleton className="h-9 w-36 mb-8 rounded-xl" />

            <div className="grid md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="flex gap-3">
                        {[0, 1, 2].map(i => (
                            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-5">
                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                    <Skeleton className="h-4 w-4/6 rounded" />
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 w-14 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Order Row Skeleton ── */
export function OrderRowSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
        </div>
    );
}

/* ── Table Row Skeleton (used by admin pages) ── */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 rounded" />
                </td>
            ))}
        </tr>
    );
}

/* ── Cart Item Skeleton ── */
export function CartItemSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-0">
                <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-200 animate-pulse self-stretch min-h-[140px]" />
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4 rounded" />
                            <Skeleton className="h-4 w-1/3 rounded" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <Skeleton className="h-9 w-28 rounded-xl" />
                        <Skeleton className="h-7 w-20 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
