"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ORIGINS = [
  "Kepong", "Puchong", "Subang Jaya", "Cheras",
  "Shah Alam", "Ampang", "Kajang", "Putrajaya", "Gombak",
]

const DESTINATIONS_BY_ORIGIN: Record<string, string[]> = {
  "Kepong": ["KLCC"],
  "Puchong": ["KLCC", "Bangsar"],
  "Subang Jaya": ["KLCC"],
  "Cheras": ["KLCC"],
  "Shah Alam": ["KLCC"],
  "Ampang": ["KLCC"],
  "Kajang": ["KLCC"],
  "Putrajaya": ["KLCC"],
  "Gombak": ["KLCC"],
}

const ROUTE_IDS: Record<string, string> = {
  "Kepong|KLCC": "kepong-klcc",
  "Puchong|KLCC": "puchong-klcc",
  "Puchong|Bangsar": "puchong-bangsar",
  "Subang Jaya|KLCC": "subang-jaya-klcc",
  "Cheras|KLCC": "cheras-klcc",
  "Shah Alam|KLCC": "shah-alam-klcc",
  "Ampang|KLCC": "ampang-klcc",
  "Kajang|KLCC": "kajang-klcc",
  "Putrajaya|KLCC": "putrajaya-klcc",
  "Gombak|KLCC": "gombak-klcc",
}

export default function RouteSelector() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)

  const destinations = origin ? DESTINATIONS_BY_ORIGIN[origin] ?? [] : []
  const routeId = origin && destination ? ROUTE_IDS[`${origin}|${destination}`] : null

  function handleSwap() {
    setOrigin(destination)
    setDestination(origin)
  }

  function handleCalculate() {
    if (!routeId) return
    setLoading(true)
    router.push(`/result/${routeId}`)
  }

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">Pilih route harian korang:</p>

      <div className="grid grid-cols-[1fr_36px_1fr] gap-2 items-center mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Dari</label>
          <select
            value={origin}
            onChange={(e) => { setOrigin(e.target.value); setDestination("") }}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]"
          >
            <option value="">Pilih kawasan...</option>
            {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <button
          onClick={handleSwap}
          disabled={!origin || !destination}
          className="mt-5 w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-gray-400 hover:border-stone-300 transition-colors disabled:opacity-30 text-lg"
          aria-label="Swap"
        >⇄</button>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Ke</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!origin}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56] disabled:opacity-40"
          >
            <option value="">Pilih destinasi...</option>
            {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={!routeId || loading}
        className="w-full bg-[#0F6E56] hover:bg-[#085041] active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Mengira..." : "💸 Tengok berapa aku habis sebulan →"}
      </button>
    </div>
  )
}
