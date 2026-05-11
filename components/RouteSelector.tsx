"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ORIGINS = [
  "Ampang", "Cheras", "Gombak", "Kajang", "Kepong",
  "Kuchai Lama", "Puchong", "Putrajaya", "Shah Alam", "Subang Jaya",
]

const DESTINATIONS_BY_ORIGIN: Record<string, string[]> = {
  "Ampang":      ["Bukit Bintang", "KL Sentral", "KLCC", "Kuchai Lama", "Midvalley"],
  "Cheras":      ["Bukit Bintang", "KL Sentral", "KLCC", "Kuchai Lama", "Midvalley"],
  "Gombak":      ["Bukit Bintang", "KL Sentral", "KLCC", "Midvalley"],
  "Kajang":      ["Bukit Bintang", "KL Sentral", "KLCC", "Midvalley"],
  "Kepong":      ["Bukit Bintang", "KL Sentral", "KLCC", "Kuchai Lama", "Midvalley", "Petaling Jaya"],
  "Kuchai Lama": ["Bangsar", "Bukit Bintang", "KL Sentral", "KLCC", "Midvalley", "Petaling Jaya"],
  "Puchong":     ["Bangsar", "Bukit Bintang", "KL Sentral", "KLCC", "Kuchai Lama", "Midvalley", "Petaling Jaya"],
  "Putrajaya":   ["Bangsar", "Cyberjaya", "KL Sentral", "KLCC"],
  "Shah Alam":   ["KL Sentral", "KLCC", "Kuchai Lama", "Petaling Jaya"],
  "Subang Jaya": ["Bangsar", "KL Sentral", "KLCC", "Kuchai Lama", "Midvalley", "Petaling Jaya"],
}

const ROUTE_IDS: Record<string, string> = {
  "Ampang|Bukit Bintang":         "ampang-bukit-bintang",
  "Ampang|KL Sentral":            "ampang-kl-sentral",
  "Ampang|KLCC":                  "ampang-klcc",
  "Ampang|Kuchai Lama":           "ampang-kuchai-lama",
  "Ampang|Midvalley":             "ampang-midvalley",
  "Cheras|Bukit Bintang":         "cheras-bukit-bintang",
  "Cheras|KL Sentral":            "cheras-kl-sentral",
  "Cheras|KLCC":                  "cheras-klcc",
  "Cheras|Kuchai Lama":           "cheras-kuchai-lama",
  "Cheras|Midvalley":             "cheras-midvalley",
  "Gombak|Bukit Bintang":         "gombak-bukit-bintang",
  "Gombak|KL Sentral":            "gombak-kl-sentral",
  "Gombak|KLCC":                  "gombak-klcc",
  "Gombak|Midvalley":             "gombak-midvalley",
  "Kajang|Bukit Bintang":         "kajang-bukit-bintang",
  "Kajang|KL Sentral":            "kajang-kl-sentral",
  "Kajang|KLCC":                  "kajang-klcc",
  "Kajang|Midvalley":             "kajang-midvalley",
  "Kepong|Bukit Bintang":         "kepong-bukit-bintang",
  "Kepong|KL Sentral":            "kepong-kl-sentral",
  "Kepong|KLCC":                  "kepong-klcc",
  "Kepong|Kuchai Lama":           "kepong-kuchai-lama",
  "Kepong|Midvalley":             "kepong-midvalley",
  "Kepong|Petaling Jaya":         "kepong-pj",
  "Kuchai Lama|Bangsar":          "kuchai-lama-bangsar",
  "Kuchai Lama|Bukit Bintang":    "kuchai-lama-bukit-bintang",
  "Kuchai Lama|KL Sentral":       "kuchai-lama-kl-sentral",
  "Kuchai Lama|KLCC":             "kuchai-lama-klcc",
  "Kuchai Lama|Midvalley":        "kuchai-lama-midvalley",
  "Kuchai Lama|Petaling Jaya":    "kuchai-lama-pj",
  "Puchong|Bangsar":              "puchong-bangsar",
  "Puchong|Bukit Bintang":        "puchong-bukit-bintang",
  "Puchong|KL Sentral":           "puchong-kl-sentral",
  "Puchong|KLCC":                 "puchong-klcc",
  "Puchong|Kuchai Lama":          "puchong-kuchai-lama",
  "Puchong|Midvalley":            "puchong-midvalley",
  "Puchong|Petaling Jaya":        "puchong-pj",
  "Putrajaya|Bangsar":            "putrajaya-bangsar",
  "Putrajaya|Cyberjaya":          "putrajaya-cyberjaya",
  "Putrajaya|KL Sentral":         "putrajaya-klcc",
  "Putrajaya|KLCC":               "putrajaya-klcc",
  "Shah Alam|KL Sentral":         "shah-alam-kl-sentral",
  "Shah Alam|KLCC":               "shah-alam-klcc",
  "Shah Alam|Kuchai Lama":        "shah-alam-kuchai-lama",
  "Shah Alam|Petaling Jaya":      "shah-alam-pj",
  "Subang Jaya|Bangsar":          "subang-jaya-bangsar",
  "Subang Jaya|KL Sentral":       "subang-jaya-klcc",
  "Subang Jaya|KLCC":             "subang-jaya-klcc",
  "Subang Jaya|Kuchai Lama":      "subang-jaya-kuchai-lama",
  "Subang Jaya|Midvalley":        "subang-jaya-midvalley",
  "Subang Jaya|Petaling Jaya":    "subang-jaya-pj",
}

export default function RouteSelector() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)

  const destinations = origin ? DESTINATIONS_BY_ORIGIN[origin] ?? [] : []
  const routeId = origin && destination ? ROUTE_IDS[`${origin}|${destination}`] : null

  function handleSwap() {
    if (destination && ORIGINS.includes(destination)) {
      setOrigin(destination)
      setDestination("")
    }
  }

  function handleCalculate() {
    if (!routeId) return
    setLoading(true)
    router.push(`/result/${routeId}`)
  }

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">Select your daily route:</p>
      <div className="grid grid-cols-[1fr_36px_1fr] gap-2 items-center mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">From</label>
          <select
            value={origin}
            onChange={(e) => { setOrigin(e.target.value); setDestination("") }}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]"
          >
            <option value="">Select area...</option>
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
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">To</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!origin}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56] disabled:opacity-40"
          >
            <option value="">Select destination...</option>
            {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={handleCalculate}
        disabled={!routeId || loading}
        className="w-full bg-[#0F6E56] hover:bg-[#085041] active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {loading
          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Calculating...</>
          : "💸 See my real commute cost →"
        }
      </button>
      {origin && destinations.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-2">
          {destinations.length} destinations available from {origin}
        </p>
      )}
    </div>
  )
}
