"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ComparisonResult } from "@/lib/types"

interface Props {
  results: ComparisonResult[]
}

export default function SampleCards({ results }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  function handleClick(id: string) {
    setLoadingId(id)
    router.push(`/result/${id}`)
  }

  if (results.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {results.map((r) => (
        <button
          key={r.route.id}
          onClick={() => handleClick(r.route.id)}
          disabled={loadingId !== null}
          className="bg-white border border-stone-200 rounded-xl p-4 text-left hover:border-[#0F6E56]/40 hover:shadow-sm transition-all group disabled:opacity-70 relative overflow-hidden"
        >
          {/* Loading overlay */}
          {loadingId === r.route.id && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
              <div className="w-5 h-5 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <p className="text-xs font-semibold text-gray-600 mb-2 leading-tight group-hover:text-[#0F6E56] transition-colors">
            {r.route.originLabel} → {r.route.destinationLabel}
          </p>
          <p className="text-xs text-red-400 font-medium mb-0.5">
            🚗 RM {Math.round(r.car.totalMonthly)}/month driving
          </p>
          {r.savingsRM > 0 && (
            <p className="text-sm font-bold text-[#0F6E56]">
              Save RM {Math.round(r.savingsRM)}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-0.5">
            {r.extraMinutesPerDay > 0 ? `+${r.extraMinutesPerDay} min/day` : "Faster by transit"}
          </p>
        </button>
      ))}
    </div>
  )
}
