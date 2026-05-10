import Link from "next/link"
import type { ComparisonResult } from "@/lib/types"

interface Props {
  results: ComparisonResult[]
}

export default function SampleCards({ results }: Props) {
  if (results.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {results.map((r) => (
        <Link
          key={r.route.id}
          href={`/result/${r.route.id}`}
          className="bg-white border border-stone-200 rounded-xl p-4 hover:border-[#0F6E56]/40 hover:shadow-sm transition-all group"
        >
          <p className="text-xs font-semibold text-gray-600 mb-2 leading-tight group-hover:text-[#0F6E56] transition-colors">
            {r.route.originLabel} → {r.route.destinationLabel}
          </p>
          {/* Pain: show what they spend driving */}
          <p className="text-xs text-red-400 font-medium mb-0.5">
            🚗 RM {r.car.totalMonthly.toFixed(0)}/bulan
          </p>
          {/* Savings */}
          {r.savingsRM > 0 && (
            <p className="text-sm font-bold text-[#0F6E56]">
              Jimat RM {Math.round(r.savingsRM)}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-0.5">
            {r.extraMinutesPerDay > 0 ? `+${r.extraMinutesPerDay} min/hari` : "Lebih laju"}
          </p>
        </Link>
      ))}
    </div>
  )
}
