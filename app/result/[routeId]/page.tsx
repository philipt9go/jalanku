import { notFound } from "next/navigation"
import Link from "next/link"
import { lookupComparison } from "@/lib/cache"
import SavingsBanner from "@/components/SavingsBanner"
import CostBreakdown from "@/components/CostBreakdown"
import TransitSteps from "@/components/TransitSteps"
import InsightBox from "@/components/InsightBox"

interface Props {
  params: Promise<{ routeId: string }>
}

export default async function ResultPage({ params }: Props) {
  const { routeId } = await params
  const result = lookupComparison(routeId)
  if (!result) notFound()

  const { route, car, transit, savingsRM, savingsAnnualRM, extraMinutesPerDay } = result

  // WhatsApp share message
  const waMessage = encodeURIComponent(
    `Aku baru discover — aku habis RM ${car.totalMonthly.toFixed(0)}/bulan just untuk drive kerja (${route.originLabel} → ${route.destinationLabel}).\n\n` +
    `Kalau naik transit, boleh jimat RM ${Math.round(savingsRM)}/bulan — atau RM ${Math.round(savingsAnnualRM).toLocaleString()} setahun! 😱\n\n` +
    `Cuba check route korang: jalanku.my`
  )

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-[#0F6E56] tracking-tight text-lg">JalanKu</Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">← Cuba route lain</Link>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-8">

        {/* Route header */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">
            {route.originLabel} → {route.destinationLabel}
          </p>
          <h1 className="text-xl font-bold text-gray-900">Kos komuter bulanan korang 📊</h1>
        </div>

        {/* Pain-first + savings + 5-year */}
        <SavingsBanner
          savingsRM={savingsRM}
          savingsAnnualRM={savingsAnnualRM}
          extraMinutesPerDay={extraMinutesPerDay}
          carTotal={car.totalMonthly}
          transitTotal={transit.totalMonthly}
        />

        {/* Smart insights */}
        <InsightBox
          savingsRM={savingsRM}
          extraMinutesPerDay={extraMinutesPerDay}
          driveTimePeakMinutes={transit.driveTimePeakMinutes}
          transitTimeMinutes={transit.transitTimeMinutes}
          routeId={routeId}
        />

        {/* Cost breakdown */}
        <CostBreakdown car={car} transit={transit} />

        {/* Step-by-step transit journey */}
        <TransitSteps
          lines={transit.lines}
          routeDescription={transit.routeDescription}
          transitTimeMinutes={transit.transitTimeMinutes}
          driveTimeMinutes={transit.driveTimeMinutes}
          driveTimePeakMinutes={transit.driveTimePeakMinutes}
        />

        {/* WhatsApp share — MAIN CTA */}
        <div className="bg-[#0F6E56] rounded-2xl p-5 mb-4 text-center">
          <p className="text-white font-bold text-base mb-1">
            Terkejut dengan nombor ni? 😱
          </p>
          <p className="text-[#E1F5EE] text-sm mb-4 leading-relaxed">
            Kongsikan dengan kawan dan keluarga — mungkin diorang pun tak sedar berapa banyak duit yang habis setiap bulan.
          </p>
          <a
            href={`https://api.whatsapp.com/send?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-[#0F6E56] rounded-xl py-3 font-bold text-sm hover:bg-[#E1F5EE] transition-colors mb-2"
          >
            📤 Share ke WhatsApp
          </a>
          <Link
            href="/"
            className="block w-full bg-white/20 text-white rounded-xl py-2.5 font-semibold text-sm hover:bg-white/30 transition-colors"
          >
            ← Cuba route lain
          </Link>
        </div>

        {/* Disclaimer + assumptions — builds trust */}
        <div className="bg-stone-100 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 mb-2">📋 Andaian pengiraan</p>
          <ul className="space-y-1">
            {[
              "22 hari kerja sebulan",
              "RON95 = RM 2.05/liter (harga semasa)",
              "Penggunaan minyak purata 10L/100km (Myvi/Axia)",
              "Tambang Rapid KL berdasarkan kadar rasmi",
              "Parking anggaran RM 4/hari",
              "Masa perjalanan berdasarkan anggaran lalu lintas KL biasa",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-xs text-gray-500">
                <span className="text-gray-400 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-stone-200">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> Ini adalah anggaran kos komuter berdasarkan data awam dan andaian trafik biasa. Kos sebenar mungkin berbeza bergantung kepada kenderaan, laluan, dan keadaan trafik harian korang.
            </p>
          </div>
        </div>

        {/* Hook stat */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            💡 Purata komuter KL habis lebih <strong>RM 3,500</strong> setahun just untuk pergi kerja.
          </p>
          <p className="text-xs text-gray-400 mt-1">jalanku.my · hello@jalanku.my</p>
        </div>

      </main>
    </div>
  )
}
