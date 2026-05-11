"use client"

import { useState, useMemo } from "react"
import type { ComparisonResult } from "@/lib/types"
import { calculateCarCost, MYPASS50_PRICE } from "@/lib/car-cost"

interface Props {
  initial: ComparisonResult
}

export default function ResultCalculator({ initial }: Props) {
  const [parkingRM, setParkingRM] = useState(initial.car.inputs.dailyParkingRM)
  const [hasMyPass50, setHasMyPass50] = useState(false)
  const [showFullBreakdown, setShowFullBreakdown] = useState(false)

  // Live recalculation
  const car = useMemo(() => calculateCarCost(
    initial.route.distanceKm,
    { ...initial.car.inputs, dailyParkingRM: parkingRM }
  ), [parkingRM, initial])

  const carNoToll = useMemo(() => calculateCarCost(
    initial.route.distanceKm,
    { ...initial.car.inputs, tollPerTrip: 0, dailyParkingRM: parkingRM }
  ), [parkingRM, initial])

  const transitMonthly = hasMyPass50 ? MYPASS50_PRICE : initial.transit.totalMonthly
  const transitLabel = hasMyPass50 ? "MyPass50" : "Transit"
  const transitIcon = hasMyPass50 ? "🎫" : "🚇"

  // Key metrics
  const monthlySaving = Math.round(car.totalMonthly - transitMonthly)
  const annualSaving = monthlySaving * 12
  const fiveYearSaving = annualSaving * 5
  const monthlyHoursLost = Math.round((initial.transit.transitTimeMinutes - initial.transit.driveTimeMinutes) * 2 * 22 / 60 * 10) / 10
  const yearlyCommuteDays = 22 * 12
  const dailyCarCost = Math.round(car.totalMonthly / 22 * 10) / 10
  const dailyTransitCost = Math.round(transitMonthly / 22 * 10) / 10
  const dailySaving = Math.round((dailyCarCost - dailyTransitCost) * 10) / 10

  // Carbon (rough estimate)
  const carCO2Monthly = Math.round(initial.route.distanceKm * 2 * 22 * 0.21) // ~0.21kg CO2/km
  const transitCO2Monthly = Math.round(initial.route.distanceKm * 2 * 22 * 0.04) // Rapid KL electric

  // Winner — smarter verdict logic
  const options = [
    { key: "toll", label: "Drive with toll", icon: "🚗", cost: car.totalMonthly },
    { key: "notoll", label: "Drive no toll", icon: "🛣️", cost: carNoToll.totalMonthly },
    { key: "transit", label: transitLabel, icon: transitIcon, cost: transitMonthly },
  ].sort((a, b) => a.cost - b.cost)

  const cheapest = options[0]
  const secondCheapest = options[1]
  const costDifference = secondCheapest.cost - cheapest.cost
  const extraTime = initial.extraMinutesPerDay

  // Determine verdict category
  const isClosecall = costDifference < 20
  const isDrivingBetter = cheapest.key !== "transit" && cheapest.key !== "mypass"
  const isSlightAdvantage = costDifference >= 20 && costDifference < 50
  const isClearWinner = costDifference >= 50 && costDifference < 150
  const isBigWinner = costDifference >= 150

  // Time penalty — if extra time is high and saving is low, driving is more practical
  const timePenalty = extraTime > 20 && costDifference < 50

  let verdictTitle = ""
  let verdictSub = ""
  let verdictColor = "bg-[#0F6E56]"

  if (isClosecall || timePenalty) {
    verdictTitle = "Close call — you decide"
    verdictSub = timePenalty
      ? `Only RM ${Math.round(costDifference)}/month difference with +${extraTime} min extra. Driving may be more practical.`
      : `Only RM ${Math.round(costDifference)}/month difference. Either option works — pick what suits your lifestyle.`
    verdictColor = "bg-gray-700"
  } else if (isDrivingBetter) {
    verdictTitle = "Driving wins for this route"
    verdictSub = `Cheaper by RM ${Math.round(costDifference)}/month and faster. Transit not the best option here.`
    verdictColor = "bg-orange-700"
  } else if (isSlightAdvantage) {
    verdictTitle = "Slight transit advantage"
    verdictSub = `Save RM ${Math.round(costDifference)}/month — worth it if +${extraTime} min/day is acceptable to you.`
    verdictColor = "bg-[#085041]"
  } else if (isClearWinner) {
    verdictTitle = `${cheapest.label} clearly wins`
    verdictSub = `Save RM ${Math.round(costDifference)}/month for just +${extraTime} min/day. Strong case to switch.`
    verdictColor = "bg-[#0F6E56]"
  } else if (isBigWinner) {
    verdictTitle = `${cheapest.label} wins by a lot`
    verdictSub = `RM ${Math.round(costDifference)}/month saving is significant — that's RM ${Math.round(costDifference * 12).toLocaleString()}/year.`
    verdictColor = "bg-[#0F6E56]"
  }

  const winner = cheapest

  return (
    <div className="space-y-4">

      {/* ── SECTION 1: VERDICT ─────────────────────── */}
      <div className={`${verdictColor} rounded-2xl p-5`}>
        <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3">
          🏆 Our assessment
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{winner.icon}</span>
          <div>
            <p className="text-white font-bold text-xl">{verdictTitle}</p>
            <p className="text-white/80 text-sm mt-0.5 leading-relaxed">{verdictSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold uppercase mb-1">Cheapest/month</p>
            <p className="text-white text-lg font-bold">RM {Math.round(winner.cost)}</p>
            <p className="text-white/60 text-[10px]">{winner.label}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold uppercase mb-1">vs driving</p>
            <p className="text-white text-lg font-bold">
              {monthlySaving > 0 ? `RM ${monthlySaving}` : `+RM ${Math.abs(monthlySaving)}`}
            </p>
            <p className="text-white/60 text-[10px]">{monthlySaving > 0 ? "saved" : "extra cost"}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold uppercase mb-1">Time diff</p>
            <p className="text-white text-lg font-bold">
              {initial.extraMinutesPerDay > 0 ? `+${initial.extraMinutesPerDay}` : `${initial.extraMinutesPerDay}`}min
            </p>
            <p className="text-white/60 text-[10px]">per day</p>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: DAILY IMPACT ────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            ⏱️ Daily Impact — per working day
          </p>
        </div>

        <div className="p-4 space-y-3">
          {/* Travel time */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">🕐 Travel time (one way)</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-red-400 font-bold mb-1">🚗 Driving</p>
                <p className="text-2xl font-bold text-red-600">{initial.transit.driveTimeMinutes}<span className="text-sm font-normal"> min</span></p>
                <p className="text-[10px] text-red-400">off-peak</p>
                <p className="text-[10px] text-red-500 font-semibold mt-0.5">Up to {initial.transit.driveTimePeakMinutes} min peak 🚨</p>
              </div>
              <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#085041] font-bold mb-1">{transitIcon} {transitLabel}</p>
                <p className="text-2xl font-bold text-[#0F6E56]">{initial.transit.transitTimeMinutes}<span className="text-sm font-normal"> min</span></p>
                <p className="text-[10px] text-[#1D9E75]">consistent always</p>
                <p className="text-[10px] text-[#085041] font-semibold mt-0.5">No traffic jams ✓</p>
              </div>
            </div>
          </div>

          {/* Daily cost */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">💰 Daily cost</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-500 font-bold mb-1">🚗 Driving</p>
                <p className="text-2xl font-bold text-gray-800">RM {dailyCarCost}</p>
                <p className="text-[10px] text-gray-400">fuel + toll + parking</p>
              </div>
              <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#085041] font-bold mb-1">{transitIcon} {transitLabel}</p>
                <p className="text-2xl font-bold text-[#0F6E56]">RM {dailyTransitCost}</p>
                <p className="text-[10px] text-[#1D9E75]">per day flat</p>
              </div>
            </div>
            {dailySaving > 0 && (
              <p className="text-center text-xs text-[#0F6E56] font-semibold mt-2">
                💡 Save RM {dailySaving} every working day
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: MONTHLY IMPACT ──────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            📅 Monthly Impact — 22 working days
          </p>
        </div>

        {/* MyPass50 toggle */}
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">I have MyPass50 🎫</p>
            <p className="text-xs text-gray-400">RM 50/month unlimited Rapid KL</p>
          </div>
          <button
            onClick={() => setHasMyPass50(!hasMyPass50)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasMyPass50 ? "bg-[#0F6E56]" : "bg-gray-200"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${hasMyPass50 ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {options.map((opt, i) => (
            <div key={opt.key} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? "bg-[#E1F5EE] border border-[#1D9E75]/30" : "bg-stone-50"}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{opt.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${i === 0 ? "text-[#0F6E56]" : "text-gray-700"}`}>
                    {opt.label} {i === 0 && <span className="text-[10px] bg-[#0F6E56] text-white px-1.5 py-0.5 rounded-full ml-1">Best</span>}
                  </p>
                  {opt.key === "notoll" && (
                    <p className="text-[10px] text-orange-500">+{initial.noTollExtraMinutes} min longer</p>
                  )}
                </div>
              </div>
              <p className={`text-lg font-bold ${i === 0 ? "text-[#0F6E56]" : "text-gray-800"}`}>
                RM {Math.round(opt.cost)}
              </p>
            </div>
          ))}

          {/* Adjustable parking */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-500">🅿️ Your daily parking cost</label>
              <span className="text-xs font-bold text-gray-800">RM {parkingRM.toFixed(1)}/day</span>
            </div>
            <input
              type="range" min={0} max={20} step={0.5}
              value={parkingRM}
              onChange={(e) => setParkingRM(parseFloat(e.target.value))}
              className="w-full accent-[#0F6E56]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Free parking</span><span>KLCC RM 15+</span>
            </div>
          </div>

          {/* Monthly hours */}
          {monthlyHoursLost !== 0 && (
            <div className={`rounded-xl p-3 text-center ${monthlyHoursLost > 0 ? "bg-amber-50" : "bg-[#E1F5EE]"}`}>
              <p className={`text-xs font-semibold ${monthlyHoursLost > 0 ? "text-amber-700" : "text-[#085041]"}`}>
                {monthlyHoursLost > 0
                  ? `⏳ Transit takes ${Math.abs(monthlyHoursLost)} extra hours/month`
                  : `⚡ Transit saves ${Math.abs(monthlyHoursLost)} hours/month vs peak hour driving`}
              </p>
              <p className={`text-[10px] mt-0.5 ${monthlyHoursLost > 0 ? "text-amber-500" : "text-[#1D9E75]"}`}>
                {monthlyHoursLost > 0 ? "But no traffic stress, can read/rest" : "Compared to peak hour driving"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 4: YEARLY LIFESTYLE IMPACT ─────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            🌱 Yearly Lifestyle Impact
          </p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 font-bold mb-1">📅 Days commuting/year</p>
            <p className="text-2xl font-bold text-gray-800">{yearlyCommuteDays}</p>
            <p className="text-[10px] text-gray-400">working days</p>
          </div>
          <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#085041] font-bold mb-1">💰 Yearly savings</p>
            <p className="text-2xl font-bold text-[#0F6E56]">RM {Math.round(annualSaving).toLocaleString()}</p>
            <p className="text-[10px] text-[#1D9E75]">vs driving alone</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-red-400 font-bold mb-1">⚠️ 5-year driving cost</p>
            <p className="text-xl font-bold text-red-600">RM {Math.round(car.totalMonthly * 60).toLocaleString()}</p>
            <p className="text-[10px] text-red-400">if nothing changes</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-green-600 font-bold mb-1">🌿 CO₂ saved/month</p>
            <p className="text-xl font-bold text-green-700">{carCO2Monthly - transitCO2Monthly}kg</p>
            <p className="text-[10px] text-green-500">switching to transit</p>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: HIDDEN COSTS ─────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            🔍 The full picture — beyond money
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Factors most calculators ignore</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-stone-100">
          <div className="p-4">
            <p className="text-xs font-bold text-red-500 mb-3">🚗 Driving hidden costs</p>
            <ul className="space-y-2">
              {[
                { icon: "😤", text: "Traffic stress daily" },
                { icon: "🅿️", text: "Hunting for parking" },
                { icon: "⚠️", text: "Accident risk" },
                { icon: "🌡️", text: "Unpredictable jams" },
                { icon: "🧠", text: "Mental fatigue" },
                { icon: "⛽", text: "Petrol price risk" },
              ].map(item => (
                <li key={item.text} className="flex gap-2 items-start">
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <span className="text-[11px] text-gray-600 leading-tight">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <p className="text-xs font-bold text-[#0F6E56] mb-3">🚇 Transit hidden costs</p>
            <ul className="space-y-2">
              {[
                { icon: "⏳", text: "Waiting for trains" },
                { icon: "🔄", text: "Transfers between lines" },
                { icon: "👥", text: "Crowded peak hours" },
                { icon: "🌧️", text: "Walking in rain" },
                { icon: "🚶", text: "Last-mile distance" },
                { icon: "📅", text: "Fixed schedule" },
              ].map(item => (
                <li key={item.text} className="flex gap-2 items-start">
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <span className="text-[11px] text-gray-600 leading-tight">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Only you can decide which trade-off works for your lifestyle.
          </p>
        </div>
      </div>

      {/* ── SECTION 6: FULL BREAKDOWN (collapsible) ── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowFullBreakdown(!showFullBreakdown)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            🧮 Full cost breakdown
          </p>
          <span className="text-gray-400 text-lg">{showFullBreakdown ? "▲" : "▼"}</span>
        </button>

        {showFullBreakdown && (
          <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">🚗 Driving (with toll)</p>
                <div className="space-y-1">
                  <Row label="⛽ Fuel" value={`RM ${Math.round(car.fuelRM)}`} />
                  <Row label="🛣️ Toll (both ways)" value={`RM ${Math.round(car.tollRM)}`} />
                  <Row label="🅿️ Parking" value={`RM ${Math.round(car.parkingRM)}`} />
                  <div className="border-t border-stone-100 pt-1 mt-1">
                    <Row label="Total" value={`RM ${Math.round(car.totalMonthly)}`} bold />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">{transitIcon} {transitLabel}</p>
                <div className="space-y-1">
                  {hasMyPass50 ? (
                    <Row label="🎫 Flat rate" value="RM 50" />
                  ) : (
                    <>
                      <Row label="🎫 Fare (both ways)" value={`RM ${Math.round(initial.transit.fareRM)}`} />
                      <Row label="🅿️ Park & Ride" value={`RM ${Math.round(initial.transit.parkAndRideRM)}`} />
                    </>
                  )}
                  <div className="border-t border-stone-100 pt-1 mt-1">
                    <Row label="Total" value={`RM ${Math.round(transitMonthly)}`} bold />
                  </div>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Assumptions</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {["22 working days/month", "RON95 RM 2.05/L", "10L per 100km", `Parking RM ${parkingRM.toFixed(1)}/day`].map(a => (
                  <span key={a} className="text-[10px] text-gray-500">• {a}</span>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> Estimates based on public data and typical KL traffic conditions. Actual costs may vary.
            </p>
          </div>
        )}
      </div>

      {/* ── SECTION 7: SHARE ────────────────────────── */}
      <a
        href={`https://api.whatsapp.com/send?text=I spend RM ${Math.round(car.totalMonthly)}/month just to commute (${initial.route.originLabel} → ${initial.route.destinationLabel}).%0A%0ABest option: ${winner.label} at RM ${Math.round(winner.cost)}/month — saving RM ${monthlySaving}/month or RM ${Math.round(annualSaving).toLocaleString()}/year!%0A%0ACheck yours: jalanku.my`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#0F6E56] hover:bg-[#085041] text-white rounded-2xl py-4 font-bold text-sm text-center transition-colors"
      >
        📤 Share to WhatsApp
      </a>

    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`text-xs ${bold ? "font-bold text-gray-800" : "text-gray-500"}`}>{label}</span>
      <span className={`text-xs ${bold ? "font-bold text-gray-800" : "text-gray-700"}`}>{value}</span>
    </div>
  )
}
