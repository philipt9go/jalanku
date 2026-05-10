import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { UserButton, SignInButton } from "@clerk/nextjs"
import RouteSelector from "@/components/RouteSelector"
import SampleCards from "@/components/SampleCards"
import { getSampleResults } from "@/lib/cache"

export default async function HomePage() {
  const { userId } = await auth()
  const samples = getSampleResults(6)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white px-5 py-3 flex items-center justify-between">
        <span className="font-bold text-[#0F6E56] tracking-tight text-lg">JalanKu</span>
        <div className="flex items-center gap-3">
          {userId ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">Dashboard</Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm text-gray-500 hover:text-gray-800">Log in</button>
            </SignInButton>
          )}
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-10">

        {/* Hero — pain first */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-[#0F6E56] uppercase mb-3">
            Free · No sign-up · Malaysia
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Korang sedar tak berapa banyak duit habis setiap bulan just untuk pergi kerja?
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Ramai orang hanya fikir pasal minyak je — tapi bila tambah toll dan parking, jumlahnya boleh kejutkan korang.
            Semak route korang sekarang.
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-3 shadow-sm">
          <RouteSelector />
        </div>

        {/* Assumptions — visible, builds trust */}
        <div className="bg-stone-100 rounded-xl px-4 py-3 mb-8 flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-xs text-gray-500">📅 22 working days/month</span>
          <span className="text-xs text-gray-500">⛽ RON95 RM 2.05/L</span>
          <span className="text-xs text-gray-500">🚗 10L per 100km (Myvi/Axia)</span>
          <span className="text-xs text-gray-500">🅿️ RM 4/day parking</span>
        </div>

        {/* Popular routes */}
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
            Popular routes — see what others discovered
          </p>
          <SampleCards results={samples} />
        </div>

        {/* Social proof / urgency */}
        <div className="mt-8 bg-[#E1F5EE] rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-[#085041] mb-1">
            💡 The average KL commuter spends <span className="text-lg font-bold">RM 3,500+</span> a year just getting to work.
          </p>
          <p className="text-xs text-[#0F6E56] mt-1">Find out your real number in 10 seconds.</p>
        </div>

        {/* Footer trust */}
        <div className="mt-10 pt-6 border-t border-stone-200 text-center space-y-1">
          <p className="text-xs text-gray-400">Data based on Rapid KL official fares · real toll rates · RON95 subsidy price</p>
          <p className="text-xs text-gray-400">Kami tidak simpan data peribadi anda · hello@jalanku.my</p>
        </div>
      </main>
    </div>
  )
}
