import Link from "next/link"
import RouteSelector from "@/components/RouteSelector"
import SampleCards from "@/components/SampleCards"
import { getSampleResults } from "@/lib/cache"

export default async function HomePage() {
  const samples = getSampleResults(6)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav — no login button */}
      <nav className="border-b border-stone-200 bg-white px-5 py-3 flex items-center justify-between">
        <span className="font-bold text-[#0F6E56] tracking-tight text-lg">JalanKu</span>
        <a
          href="mailto:hello@jalanku.my"
          className="text-sm text-gray-500 hover:text-[#0F6E56] transition-colors"
        >
          hello@jalanku.my
        </a>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-[#0F6E56] uppercase mb-3">
            Free · No sign-up · Malaysia
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Do you know how much you're really spending to get to work every month?
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Most people only think about petrol — but add toll and parking, the number might surprise you lah. Check your route now, free.
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-3 shadow-sm">
          <RouteSelector />
        </div>

        {/* Assumptions */}
        <div className="bg-stone-100 rounded-xl px-4 py-3 mb-8 flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-xs text-gray-500">📅 22 working days/month</span>
          <span className="text-xs text-gray-500">⛽ RON95 RM 2.05/L</span>
          <span className="text-xs text-gray-500">🚗 10L per 100km</span>
          <span className="text-xs text-gray-500">🅿️ Smart parking defaults per area</span>
        </div>

        {/* Popular routes */}
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Popular routes — see what others discovered
        </p>
        <SampleCards results={samples} />

        {/* Hook stat */}
        <div className="mt-8 bg-[#E1F5EE] rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-[#085041] mb-1">
            💡 The average KL commuter spends over{" "}
            <span className="text-lg font-bold">RM 3,500</span> a year just getting to work.
          </p>
          <p className="text-xs text-[#0F6E56] mt-1">
            Find out your real number in 10 seconds — no sign-up needed.
          </p>
        </div>

        {/* MyPass50 awareness */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-amber-700 mb-1">🎫 Have MyPass50?</p>
          <p className="text-xs text-amber-600">
            Toggle it on the result page to see how much you save vs driving. Game changer for many routes!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-stone-200 text-center space-y-1">
          <p className="text-xs text-gray-400">
            Based on official Rapid KL fares · real toll rates · RON95 RM 2.05
          </p>
          <p className="text-xs text-gray-400">
            We do not store your personal data ·{" "}
            <a href="mailto:hello@jalanku.my" className="hover:text-[#0F6E56] transition-colors">
              hello@jalanku.my
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
