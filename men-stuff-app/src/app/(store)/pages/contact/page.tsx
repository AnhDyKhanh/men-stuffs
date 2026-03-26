import FeedbackWidget from '@/app/(store)/_components/FeedbackWidget'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-[#0F1115]/70 p-6 text-white shadow-[0_0_50px_-14px_rgba(247,147,26,0.1)] backdrop-blur sm:p-8">
        <p className="font-mono text-[11px] tracking-widest text-white/50 uppercase">Men Stuffs</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Lien he</h1>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Can ho tro don hang, san pham hoac nhan tai shop? De lai thong tin de team lien he lai cho ban.
        </p>

        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-white/60">Hotline</p>
            <p className="mt-1 font-medium text-white">0900 000 000</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-white/60">Email</p>
            <p className="mt-1 font-medium text-white">support@menstuffs.vn</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4 sm:col-span-2">
            <p className="text-white/60">Showroom pickup</p>
            <p className="mt-1 font-medium text-white">123 Nguyen Trai, Q1, TP.HCM</p>
          </div>
        </div>
      </div>

      <FeedbackWidget />
    </div>
  )
}

