interface Props {
  savingsRM: number
  extraMinutesPerDay: number
  driveTimePeakMinutes: number
  transitTimeMinutes: number
  routeId: string
}

// Static but feels smart and personalised
export default function InsightBox({ savingsRM, extraMinutesPerDay, driveTimePeakMinutes, transitTimeMinutes, routeId }: Props) {
  const insights: string[] = []

  // Time insight
  if (driveTimePeakMinutes > transitTimeMinutes) {
    const diff = driveTimePeakMinutes - transitTimeMinutes
    insights.push(`🚨 Masa peak hour, transit sebenarnya ${diff} minit LEBIH LAJU dari memandu.`)
  }

  // Savings insight
  if (savingsRM > 200) {
    insights.push(`☕ Dengan jimat RM ${Math.round(savingsRM)}/bulan, korang boleh afford lebih dari 60 cawan kopi sebulan.`)
  } else if (savingsRM > 100) {
    insights.push(`📱 Jimat RM ${Math.round(savingsRM)}/bulan = boleh bayar bil telefon korang setiap bulan dengan duit lebih.`)
  }

  // Extra time insight
  if (extraMinutesPerDay > 0 && extraMinutesPerDay <= 20) {
    insights.push(`🎧 +${extraMinutesPerDay} minit tu setara 1-2 episod podcast. Ramai orang rasa masa transit lebih produktif dari terkandas dalam jam.`)
  }

  // Route-specific
  if (routeId.includes('shah-alam') || routeId.includes('subang') || routeId.includes('puchong')) {
    insights.push(`🛣️ Route ni antara yang paling teruk kesesakan traffic di KL. Masa memandu sebenar waktu peak boleh jauh lebih lama dari anggaran.`)
  }

  if (insights.length === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
      <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">💡 Insight untuk korang</p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-1 rounded-full bg-blue-300 flex-shrink-0 mt-1" />
            <p className="text-xs text-blue-700 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
