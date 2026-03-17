// app/[lang]/products/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl animate-pulse bg-black px-6 py-12 text-white">
      <div className="grid gap-12 md:grid-cols-12">
        {/* Skeleton Ảnh */}
        <div className="flex gap-4 md:col-span-7">
          <div className="hidden w-20 flex-col gap-2 md:flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded bg-zinc-800" />
            ))}
          </div>
          <div className="aspect-square flex-1 rounded bg-zinc-800" />
        </div>

        {/* Skeleton Thông tin */}
        <div className="space-y-6 md:col-span-5">
          <div className="h-4 w-24 rounded bg-zinc-800" />
          <div className="h-10 w-full rounded bg-zinc-800" />
          <div className="h-6 w-1/3 rounded bg-zinc-800" />
          <div className="space-y-3 pt-8">
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-800" />
          </div>
          <div className="mt-8 h-12 w-full rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
