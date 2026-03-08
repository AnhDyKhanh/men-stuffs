// app/[lang]/products/[id]/loading.tsx
export default function Loading() {
    return (
        <div className="bg-black min-h-screen text-white max-w-7xl mx-auto px-6 py-12 animate-pulse">
            <div className="grid md:grid-cols-12 gap-12">
                {/* Skeleton Ảnh */}
                <div className="md:col-span-7 flex gap-4">
                    <div className="hidden md:flex flex-col gap-2 w-20">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-zinc-800 rounded" />
                        ))}
                    </div>
                    <div className="flex-1 bg-zinc-800 aspect-square rounded" />
                </div>

                {/* Skeleton Thông tin */}
                <div className="md:col-span-5 space-y-6">
                    <div className="h-4 bg-zinc-800 w-24 rounded" />
                    <div className="h-10 bg-zinc-800 w-full rounded" />
                    <div className="h-6 bg-zinc-800 w-1/3 rounded" />
                    <div className="space-y-3 pt-8">
                        <div className="h-4 bg-zinc-800 w-full rounded" />
                        <div className="h-4 bg-zinc-800 w-full rounded" />
                        <div className="h-4 bg-zinc-800 w-2/3 rounded" />
                    </div>
                    <div className="h-12 bg-zinc-800 w-full rounded mt-8" />
                </div>
            </div>
        </div>
    )
}