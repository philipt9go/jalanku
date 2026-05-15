"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ORIGINS = [
  "Ampang", "Balakong", "Bukit Jalil", "Cheras", "Gombak",
  "Kajang", "Kepong", "Kota Damansara", "Kuchai Lama",
  "Puchong", "Putrajaya", "Rawang", "Semenyih",
  "Seri Kembangan", "Setapak", "Shah Alam", "Sri Petaling",
  "Subang Jaya", "Sungai Buloh", "Wangsa Maju",
]

const DESTINATIONS_BY_ORIGIN: Record<string, string[]> = {
  "Ampang":          ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","Damansara Heights","KL Sentral","KLCC","Kuchai Lama","Midvalley","Mont Kiara","TRX"],
  "Balakong":        ["Bangsar","Bukit Bintang","KL Sentral","KLCC","TRX"],
  "Bukit Jalil":     ["Ampang Park","Bangsar","Bangsar South","Bukit Bintang","KL Sentral","KLCC","Midvalley","PNB 118","Subang","Sunway","TRX"],
  "Cheras":          ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","Damansara Heights","KL Sentral","KLCC","Kuchai Lama","Midvalley","Mont Kiara","PNB 118","Subang","Sunway","TRX"],
  "Gombak":          ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","KL Sentral","KLCC","Midvalley","Mont Kiara","TRX"],
  "Kajang":          ["Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","KL Sentral","KLCC","Midvalley","Mont Kiara","TRX"],
  "Kepong":          ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","Damansara Heights","KL Sentral","KLCC","Kuchai Lama","Midvalley","Mont Kiara","PNB 118","Petaling Jaya","Subang","Sunway","TRX"],
  "Kota Damansara":  ["Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","KL Sentral","KLCC","Mont Kiara","Petaling Jaya","TRX"],
  "Kuchai Lama":     ["Bangsar","Bukit Bintang","KL Sentral","KLCC","Midvalley","Petaling Jaya","TRX"],
  "Puchong":         ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Bintang","Bukit Jalil","Damansara Heights","KL Sentral","KLCC","Kuchai Lama","Midvalley","PNB 118","Petaling Jaya","Sunway","TRX"],
  "Putrajaya":       ["Bangsar","Cyberjaya","KL Sentral","KLCC","TRX"],
  "Rawang":          ["Bangsar","Bukit Bintang","KL Sentral","KLCC","TRX"],
  "Semenyih":        ["Bukit Bintang","KL Sentral","KLCC","TRX"],
  "Seri Kembangan":  ["Bangsar","Bukit Bintang","KL Sentral","KLCC","Petaling Jaya","TRX"],
  "Setapak":         ["Bangsar","Bangsar South","Bukit Bintang","KL Sentral","KLCC","Midvalley","Petaling Jaya","TRX"],
  "Shah Alam":       ["Bandar Utama","Bangsar","Bangsar South","KL Sentral","KLCC","Kuchai Lama","Petaling Jaya","Sunway","TRX"],
  "Sri Petaling":    ["Bangsar","Bangsar South","Bukit Bintang","KL Sentral","KLCC","Midvalley","Petaling Jaya","TRX"],
  "Subang Jaya":     ["Ampang Park","Bandar Utama","Bangsar","Bangsar South","Bukit Jalil","Damansara Heights","KL Sentral","KLCC","Kuchai Lama","Midvalley","Mont Kiara","PNB 118","Petaling Jaya","Subang","Sunway","TRX"],
  "Sungai Buloh":    ["Bandar Utama","Bangsar","KL Sentral","KLCC","Petaling Jaya","TRX"],
  "Wangsa Maju":     ["Bangsar","Bangsar South","Bukit Bintang","KL Sentral","KLCC","Midvalley","Petaling Jaya","TRX"],
}

// Map origin|destination to route ID
const ROUTE_IDS: Record<string, string> = {
  "Ampang|Ampang Park":"ampang-klcc","Ampang|Bandar Utama":"ampang-bandar-utama","Ampang|Bangsar":"ampang-klcc","Ampang|Bangsar South":"ampang-bangsar-south","Ampang|Bukit Bintang":"ampang-bukit-bintang","Ampang|Bukit Jalil":"ampang-bukit-jalil","Ampang|Damansara Heights":"ampang-damansara-heights","Ampang|KL Sentral":"ampang-kl-sentral","Ampang|KLCC":"ampang-klcc","Ampang|Kuchai Lama":"ampang-kuchai-lama","Ampang|Midvalley":"ampang-midvalley","Ampang|Mont Kiara":"ampang-mont-kiara","Ampang|TRX":"ampang-trx",
  "Balakong|Bangsar":"balakong-bangsar","Balakong|Bukit Bintang":"balakong-bukit-bintang","Balakong|KL Sentral":"balakong-kl-sentral","Balakong|KLCC":"balakong-klcc","Balakong|TRX":"balakong-trx",
  "Bukit Jalil|Ampang Park":"bukit-jalil-ampang-park","Bukit Jalil|Bangsar":"bukit-jalil-bangsar","Bukit Jalil|Bangsar South":"bukit-jalil-bangsar","Bukit Jalil|Bukit Bintang":"bukit-jalil-bukit-bintang","Bukit Jalil|KL Sentral":"bukit-jalil-kl-sentral","Bukit Jalil|KLCC":"bukit-jalil-klcc","Bukit Jalil|Midvalley":"bukit-jalil-midvalley","Bukit Jalil|PNB 118":"bukit-jalil-pnb118","Bukit Jalil|Subang":"bukit-jalil-subang","Bukit Jalil|Sunway":"bukit-jalil-sunway","Bukit Jalil|TRX":"bukit-jalil-trx",
  "Cheras|Ampang Park":"cheras-ampang-park","Cheras|Bandar Utama":"cheras-bandar-utama","Cheras|Bangsar":"cheras-klcc","Cheras|Bangsar South":"cheras-bangsar-south","Cheras|Bukit Bintang":"cheras-bukit-bintang","Cheras|Bukit Jalil":"cheras-bukit-jalil","Cheras|Damansara Heights":"cheras-damansara-heights","Cheras|KL Sentral":"cheras-kl-sentral","Cheras|KLCC":"cheras-klcc","Cheras|Kuchai Lama":"cheras-kuchai-lama","Cheras|Midvalley":"cheras-midvalley","Cheras|Mont Kiara":"cheras-mont-kiara","Cheras|PNB 118":"cheras-pnb118","Cheras|Subang":"cheras-subang","Cheras|Sunway":"cheras-sunway","Cheras|TRX":"cheras-trx",
  "Gombak|Ampang Park":"gombak-ampang-park","Gombak|Bandar Utama":"gombak-bandar-utama","Gombak|Bangsar":"gombak-klcc","Gombak|Bangsar South":"gombak-bangsar-south","Gombak|Bukit Bintang":"gombak-bukit-bintang","Gombak|Bukit Jalil":"gombak-bukit-jalil","Gombak|KL Sentral":"gombak-kl-sentral","Gombak|KLCC":"gombak-klcc","Gombak|Midvalley":"gombak-midvalley","Gombak|Mont Kiara":"gombak-mont-kiara","Gombak|TRX":"gombak-trx",
  "Kajang|Bandar Utama":"kajang-bandar-utama","Kajang|Bangsar":"kajang-klcc","Kajang|Bangsar South":"kajang-bangsar-south","Kajang|Bukit Bintang":"kajang-bukit-bintang","Kajang|Bukit Jalil":"kajang-bukit-jalil","Kajang|KL Sentral":"kajang-kl-sentral","Kajang|KLCC":"kajang-klcc","Kajang|Midvalley":"kajang-midvalley","Kajang|Mont Kiara":"kajang-mont-kiara","Kajang|TRX":"kajang-trx",
  "Kepong|Ampang Park":"kepong-ampang-park","Kepong|Bandar Utama":"kepong-bandar-utama","Kepong|Bangsar":"kepong-klcc","Kepong|Bangsar South":"kepong-bangsar-south","Kepong|Bukit Bintang":"kepong-bukit-bintang","Kepong|Bukit Jalil":"kepong-bukit-jalil","Kepong|Damansara Heights":"kepong-damansara-heights","Kepong|KL Sentral":"kepong-kl-sentral","Kepong|KLCC":"kepong-klcc","Kepong|Kuchai Lama":"kepong-kuchai-lama","Kepong|Midvalley":"kepong-midvalley","Kepong|Mont Kiara":"kepong-mont-kiara","Kepong|PNB 118":"kepong-pnb118","Kepong|Petaling Jaya":"kepong-pj","Kepong|Subang":"kepong-subang","Kepong|Sunway":"kepong-sunway","Kepong|TRX":"kepong-trx",
  "Kota Damansara|Bandar Utama":"kota-damansara-bandar-utama","Kota Damansara|Bangsar":"kota-damansara-bangsar","Kota Damansara|Bangsar South":"kota-damansara-bangsar-south","Kota Damansara|Bukit Bintang":"kota-damansara-klcc","Kota Damansara|KL Sentral":"kota-damansara-kl-sentral","Kota Damansara|KLCC":"kota-damansara-klcc","Kota Damansara|Mont Kiara":"kota-damansara-mont-kiara","Kota Damansara|Petaling Jaya":"kota-damansara-pj","Kota Damansara|TRX":"kota-damansara-trx",
  "Kuchai Lama|Bangsar":"kuchai-lama-bangsar","Kuchai Lama|Bukit Bintang":"kuchai-lama-bukit-bintang","Kuchai Lama|KL Sentral":"kuchai-lama-kl-sentral","Kuchai Lama|KLCC":"kuchai-lama-klcc","Kuchai Lama|Midvalley":"kuchai-lama-midvalley","Kuchai Lama|Petaling Jaya":"kuchai-lama-pj","Kuchai Lama|TRX":"kuchai-lama-trx",
  "Puchong|Ampang Park":"puchong-ampang-park","Puchong|Bandar Utama":"puchong-bandar-utama","Puchong|Bangsar":"puchong-bangsar","Puchong|Bangsar South":"puchong-bangsar-south","Puchong|Bukit Bintang":"puchong-bukit-bintang","Puchong|Bukit Jalil":"puchong-bukit-jalil","Puchong|Damansara Heights":"puchong-damansara-heights","Puchong|KL Sentral":"puchong-kl-sentral","Puchong|KLCC":"puchong-klcc","Puchong|Kuchai Lama":"puchong-kuchai-lama","Puchong|Midvalley":"puchong-midvalley","Puchong|PNB 118":"puchong-pnb118","Puchong|Petaling Jaya":"puchong-pj","Puchong|Sunway":"puchong-sunway","Puchong|TRX":"puchong-trx",
  "Putrajaya|Bangsar":"putrajaya-bangsar","Putrajaya|Cyberjaya":"putrajaya-cyberjaya","Putrajaya|KL Sentral":"putrajaya-klcc","Putrajaya|KLCC":"putrajaya-klcc","Putrajaya|TRX":"putrajaya-trx",
  "Rawang|Bangsar":"rawang-bangsar","Rawang|Bukit Bintang":"rawang-bukit-bintang","Rawang|KL Sentral":"rawang-kl-sentral","Rawang|KLCC":"rawang-klcc","Rawang|TRX":"rawang-trx",
  "Semenyih|Bukit Bintang":"semenyih-bukit-bintang","Semenyih|KL Sentral":"semenyih-kl-sentral","Semenyih|KLCC":"semenyih-klcc","Semenyih|TRX":"semenyih-trx",
  "Seri Kembangan|Bangsar":"seri-kembangan-bangsar","Seri Kembangan|Bukit Bintang":"seri-kembangan-bukit-bintang","Seri Kembangan|KL Sentral":"seri-kembangan-kl-sentral","Seri Kembangan|KLCC":"seri-kembangan-klcc","Seri Kembangan|Petaling Jaya":"seri-kembangan-pj","Seri Kembangan|TRX":"seri-kembangan-trx",
  "Setapak|Bangsar":"setapak-bangsar","Setapak|Bangsar South":"setapak-bangsar-south","Setapak|Bukit Bintang":"setapak-bukit-bintang","Setapak|KL Sentral":"setapak-kl-sentral","Setapak|KLCC":"setapak-klcc","Setapak|Midvalley":"setapak-midvalley","Setapak|Petaling Jaya":"setapak-pj","Setapak|TRX":"setapak-trx",
  "Shah Alam|Bandar Utama":"shah-alam-bandar-utama","Shah Alam|Bangsar":"shah-alam-klcc","Shah Alam|Bangsar South":"shah-alam-bangsar-south","Shah Alam|KL Sentral":"shah-alam-kl-sentral","Shah Alam|KLCC":"shah-alam-klcc","Shah Alam|Kuchai Lama":"shah-alam-kuchai-lama","Shah Alam|Petaling Jaya":"shah-alam-pj","Shah Alam|Sunway":"shah-alam-sunway","Shah Alam|TRX":"shah-alam-trx",
  "Sri Petaling|Bangsar":"sri-petaling-bangsar","Sri Petaling|Bangsar South":"sri-petaling-bangsar-south","Sri Petaling|Bukit Bintang":"sri-petaling-bukit-bintang","Sri Petaling|KL Sentral":"sri-petaling-kl-sentral","Sri Petaling|KLCC":"sri-petaling-klcc","Sri Petaling|Midvalley":"sri-petaling-midvalley","Sri Petaling|Petaling Jaya":"sri-petaling-pj","Sri Petaling|TRX":"sri-petaling-trx",
  "Subang Jaya|Ampang Park":"subang-jaya-ampang-park","Subang Jaya|Bandar Utama":"subang-jaya-bandar-utama","Subang Jaya|Bangsar":"subang-jaya-bangsar","Subang Jaya|Bangsar South":"subang-jaya-bangsar-south","Subang Jaya|Bukit Jalil":"subang-jaya-bukit-jalil","Subang Jaya|Damansara Heights":"subang-jaya-damansara-heights","Subang Jaya|KL Sentral":"subang-jaya-klcc","Subang Jaya|KLCC":"subang-jaya-klcc","Subang Jaya|Kuchai Lama":"subang-jaya-kuchai-lama","Subang Jaya|Midvalley":"subang-jaya-midvalley","Subang Jaya|Mont Kiara":"subang-jaya-mont-kiara","Subang Jaya|PNB 118":"subang-jaya-pnb118","Subang Jaya|Petaling Jaya":"subang-jaya-pj","Subang Jaya|Subang":"subang-jaya-klcc","Subang Jaya|Sunway":"subang-jaya-sunway","Subang Jaya|TRX":"subang-jaya-trx",
  "Sungai Buloh|Bandar Utama":"sungai-buloh-bandar-utama","Sungai Buloh|Bangsar":"sungai-buloh-bangsar","Sungai Buloh|KL Sentral":"sungai-buloh-kl-sentral","Sungai Buloh|KLCC":"sungai-buloh-klcc","Sungai Buloh|Petaling Jaya":"sungai-buloh-pj","Sungai Buloh|TRX":"sungai-buloh-trx",
  "Wangsa Maju|Bangsar":"wangsa-maju-bangsar","Wangsa Maju|Bangsar South":"wangsa-maju-bangsar-south","Wangsa Maju|Bukit Bintang":"wangsa-maju-bukit-bintang","Wangsa Maju|KL Sentral":"wangsa-maju-kl-sentral","Wangsa Maju|KLCC":"wangsa-maju-klcc","Wangsa Maju|Midvalley":"wangsa-maju-midvalley","Wangsa Maju|Petaling Jaya":"wangsa-maju-pj","Wangsa Maju|TRX":"wangsa-maju-trx",
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
      setOrigin(destination); setDestination("")
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
          <select value={origin} onChange={(e) => { setOrigin(e.target.value); setDestination("") }}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]">
            <option value="">Select area...</option>
            {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={handleSwap} disabled={!origin || !destination}
          className="mt-5 w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-gray-400 hover:border-stone-300 transition-colors disabled:opacity-30 text-lg" aria-label="Swap">⇄</button>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">To</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)} disabled={!origin}
            className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56] disabled:opacity-40">
            <option value="">Select destination...</option>
            {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleCalculate} disabled={!routeId || loading}
        className="w-full bg-[#0F6E56] hover:bg-[#085041] active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
        {loading
          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Calculating...</>
          : "💸 See my real commute cost →"}
      </button>
      {origin && destinations.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-2">{destinations.length} destinations from {origin}</p>
      )}
    </div>
  )
}
