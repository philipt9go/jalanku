"use client"

import { useState, useMemo } from "react"
import type { ComparisonResult } from "@/lib/types"
import { calculateCarCost, MYPASS50_PRICE } from "@/lib/car-cost"

// Smart parking defaults by destination
const PARKING_DEFAULTS: Record<string, number> = {
  "KLCC":          10.00,
  "TRX":           10.00,
  "PNB 118":        8.00,
  "Bukit Bintang":  8.00,
  "Ampang Park":    6.00,
  "KL Sentral":     6.00,
  "Midvalley":      5.00,
  "Bangsar":        5.00,
  "Petaling Jaya":  3.00,
  "Subang":         3.00,
  "Subang Jaya":    3.00,
  "Sunway":         4.00,
  "Bukit Jalil":    3.00,
  "Cyberjaya":      2.00,
  "Kuchai Lama":    2.00,
}

interface Props {
  initial: ComparisonResult
  destination: string
}

export default function ResultCalculator({ initial, destination }: Props) {
  const smartDefault = PARKING_DEFAULTS[destination] ?? 4.00
  const [parkingRM, setParkingRM] = useState(smartDefault)
  const [useMonthlyPackage, setUseMonthlyPackage] = useState(false)
  const [monthlyPackageRM, setMonthlyPackageRM] = useState(150)
  const [hasMyPass50, setHasMyPass50] = useState(false)
  const [showCO2Info, setShowCO2Info] = useState(false)
  const [showFullBreakdown, setShowFullBreakdown] = useState(false)

  // Effective parking cost
  const effectiveParkingPerDay = useMonthlyPackage
    ? monthlyPackageRM / 22
    : parkingRM

  // Live recalculation
  const car = useMemo(() => calculateCarCost(
    initial.route.distanceKm,
    { ...initial.car.inputs, dailyParkingRM: effectiveParkingPerDay }
  ), [effectiveParkingPerDay, initial])

  const carNoToll = useMemo(() => calculateCarCost(
    initial.route.distanceKm,
    { ...initial.car.inputs, tollPerTrip: 0, dailyParkingRM: effectiveParkingPerDay }
  ), [effectiveParkingPerDay, initial])

  const transitMonthly = hasMyPass50 ? MYPASS50_PRICE : initial.transit.totalMonthly
  const transitLabel = hasMyPass50 ? "MyPass50" : "Transit"
  const transitIcon = hasMyPass50 ? "🎫" : "🚇"

  // Key metrics
  const monthlySaving = Math.round(car.totalMonthly - transitMonthly)
  const annualSaving = monthlySaving * 12
  const fiveYearSaving = annualSaving * 5
  const monthlyHoursExtra = Math.round((initial.transit.transitTimeMinutes - initial.transit.driveTimeMinutes) * 2 * 22 / 60 * 10) / 10
  const dailyCarCost = Math.round(car.totalMonthly / 22 * 10) / 10
  const dailyTransitCost = Math.round(transitMonthly / 22 * 10) / 10
  const carCO2Monthly = Math.round(initial.route.distanceKm * 2 * 22 * 0.21)
  const transitCO2Monthly = Math.round(initial.route.distanceKm * 2 * 22 * 0.04)
  const co2Saved = carCO2Monthly - transitCO2Monthly

  // Smart verdict
  const options = [
    { key: "toll",    label: "Drive with toll", icon: "🚗",  cost: car.totalMonthly },
    { key: "notoll",  label: "Drive no toll",   icon: "🛣️",  cost: carNoToll.totalMonthly },
    { key: "transit", label: transitLabel,       icon: transitIcon, cost: transitMonthly },
  ].sort((a, b) => a.cost - b.cost)

  const winner = options[0]
  const diff = options[1].cost - winner.cost
  const timePenalty = initial.extraMinutesPerDay > 20 && diff < 50
  const isDrivingBetter = winner.key !== "transit"

  let verdictTitle = ""
  let verdictSub = ""
  let verdictBg = "bg-[#0F6E56]"

  if (diff < 20 || timePenalty) {
    verdictTitle = "Close call — you decide"
    verdictSub = timePenalty
      ? `Only RM ${Math.round(diff)}/month difference with +${initial.extraMinutesPerDay} min extra. Driving may be more practical.`
      : `Only RM ${Math.round(diff)}/month difference. Pick what suits your lifestyle.`
    verdictBg = "bg-gray-700"
  } else if (isDrivingBetter) {
    verdictTitle = "Driving wins for this route"
    verdictSub = `Cheaper by RM ${Math.round(diff)}/month. Transit not the best option here.`
    verdictBg = "bg-orange-700"
  } else if (diff < 50) {
    verdictTitle = "Slight transit advantage"
    verdictSub = `Save RM ${Math.round(diff)}/month — worth considering if +${initial.extraMinutesPerDay} min/day is acceptable.`
    verdictBg = "bg-[#085041]"
  } else if (diff < 150) {
    verdictTitle = "Transit clearly wins"
    verdictSub = `Save RM ${Math.round(diff)}/month for just +${initial.extraMinutesPerDay} min/day. Strong case to switch.`
    verdictBg = "bg-[#0F6E56]"
  } else {
    verdictTitle = "Transit wins by a lot"
    verdictSub = `RM ${Math.round(diff)}/month saving is significant — that's RM ${Math.round(diff * 12).toLocaleString()}/year.`
    verdictBg = "bg-[#0F6E56]"
  }

  return (
    <div className="space-y-4">

      {/* ── MyPass50 TOGGLE — TOP ───────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-amber-800">🎫 I have MyPass50</p>
          <p className="text-xs text-amber-600">Unlimited Rapid KL · RM 50/month flat rate</p>
        </div>
        <button
          onClick={() => setHasMyPass50(!hasMyPass50)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${hasMyPass50 ? "bg-[#0F6E56]" : "bg-gray-300"}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${hasMyPass50 ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {/* ── VERDICT — SIMPLIFIED ────────────────────── */}
      <div className={`${verdictBg} rounded-2xl p-5`}>
        <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">🏆 Our assessment</p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{winner.icon}</span>
          <div>
            <p className="text-white font-bold text-xl">{verdictTitle}</p>
            <p className="text-white/80 text-sm mt-0.5 leading-relaxed">{verdictSub}</p>
          </div>
        </div>

        {/* Cooper's fix: simple save/month + save/year only */}
        {monthlySaving > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-white/70 text-[10px] font-bold uppercase mb-1">You could save/month</p>
              <p className="text-white text-2xl font-bold">RM {monthlySaving}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-white/70 text-[10px] font-bold uppercase mb-1">That's every year</p>
              <p className="text-white text-2xl font-bold">RM {Math.round(annualSaving).toLocaleString()}</p>
            </div>
          </div>
        )}
        {monthlySaving <= 0 && (
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-white font-semibold">Driving is cheaper by RM {Math.abs(monthlySaving)}/month</p>
          </div>
        )}
      </div>

      {/* ── DAILY IMPACT ────────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">⏱️ Daily Impact</p>
        </div>
        <div className="p-4 space-y-3">
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
              <p className="text-[10px] text-[#1D9E75]">always consistent</p>
              <p className="text-[10px] text-[#085041] font-semibold mt-0.5">No traffic jams ✓</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 font-bold mb-1">🚗 Daily cost</p>
              <p className="text-2xl font-bold text-gray-800">RM {dailyCarCost}</p>
              <p className="text-[10px] text-gray-400">fuel + toll + parking</p>
            </div>
            <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#085041] font-bold mb-1">{transitIcon} Daily cost</p>
              <p className="text-2xl font-bold text-[#0F6E56]">RM {dailyTransitCost}</p>
              <p className="text-[10px] text-[#1D9E75]">per day</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MONTHLY IMPACT ──────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">📅 Monthly Impact — 22 working days</p>
        </div>
        <div className="p-4 space-y-3">

          {/* All options ranked */}
          {options.map((opt, i) => (
            <div key={opt.key} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? "bg-[#E1F5EE] border border-[#1D9E75]/30" : "bg-stone-50"}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{opt.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${i === 0 ? "text-[#0F6E56]" : "text-gray-700"}`}>
                    {opt.label}
                    {i === 0 && <span className="ml-1.5 text-[10px] bg-[#0F6E56] text-white px-1.5 py-0.5 rounded-full">Best</span>}
                  </p>
                  {opt.key === "notoll" && <p className="text-[10px] text-orange-500">+{initial.noTollExtraMinutes} min longer, saves on toll</p>}
                </div>
              </div>
              <p className={`text-lg font-bold ${i === 0 ? "text-[#0F6E56]" : "text-gray-800"}`}>RM {Math.round(opt.cost)}</p>
            </div>
          ))}

          {/* Parking input */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600">🅿️ Your parking situation</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setUseMonthlyPackage(false)}
                  className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-colors ${!useMonthlyPackage ? "bg-[#0F6E56] text-white" : "bg-stone-100 text-gray-500"}`}
                >
                  Daily rate
                </button>
                <button
                  onClick={() => setUseMonthlyPackage(true)}
                  className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-colors ${useMonthlyPackage ? "bg-[#0F6E56] text-white" : "bg-stone-100 text-gray-500"}`}
                >
                  Monthly package
                </button>
              </div>
            </div>

            {!useMonthlyPackage ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Daily parking rate</span>
                  <span className="text-xs font-bold text-gray-800">RM {parkingRM.toFixed(1)}/day</span>
                </div>
                <input
                  type="range" min={0} max={20} step={0.5}
                  value={parkingRM}
                  onChange={(e) => setParkingRM(parseFloat(e.target.value))}
                  className="w-full accent-[#0F6E56]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>Free</span>
                  <span className="text-[#0F6E56] font-semibold">Default for {destination}: RM {smartDefault}</span>
                  <span>RM 20+</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[0, 4, 6, 8, 10, 15].map(v => (
                    <button key={v} onClick={() => setParkingRM(v)}
                      className={`text-[10px] px-2 py-1 rounded-lg flex-1 font-semibold transition-colors ${parkingRM === v ? "bg-[#0F6E56] text-white" : "bg-stone-100 text-gray-500"}`}
                    >
                      {v === 0 ? "Free" : `RM ${v}`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Monthly parking package</span>
                  <span className="text-xs font-bold text-gray-800">RM {monthlyPackageRM}/month</span>
                </div>
                <input
                  type="range" min={50} max={400} step={10}
                  value={monthlyPackageRM}
                  onChange={(e) => setMonthlyPackageRM(parseInt(e.target.value))}
                  className="w-full accent-[#0F6E56]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>RM 50</span><span>RM 400+</span>
                </div>
                <p className="text-[10px] text-[#0F6E56] mt-1">≈ RM {(monthlyPackageRM/22).toFixed(1)}/day effective rate</p>
              </div>
            )}
          </div>

          {monthlyHoursExtra !== 0 && (
            <div className={`rounded-xl p-3 text-center ${monthlyHoursExtra > 0 ? "bg-amber-50" : "bg-[#E1F5EE]"}`}>
              <p className={`text-xs font-semibold ${monthlyHoursExtra > 0 ? "text-amber-700" : "text-[#085041]"}`}>
                {monthlyHoursExtra > 0
                  ? `⏳ Transit takes ${Math.abs(monthlyHoursExtra)} extra hours/month`
                  : `⚡ Transit saves ${Math.abs(monthlyHoursExtra)} hours vs peak hour driving`}
              </p>
              <p className={`text-[10px] mt-0.5 ${monthlyHoursExtra > 0 ? "text-amber-500" : "text-[#1D9E75]"}`}>
                {monthlyHoursExtra > 0 ? "Can use time to read, rest, or work" : "vs peak hour congestion"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── YEARLY LIFESTYLE IMPACT ─────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">🌱 Yearly Lifestyle Impact</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-red-400 font-bold mb-1">⚠️ 5-year driving cost</p>
            <p className="text-xl font-bold text-red-600">RM {Math.round(car.totalMonthly * 60).toLocaleString()}</p>
            <p className="text-[10px] text-red-400">if nothing changes</p>
          </div>
          <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#085041] font-bold mb-1">💰 5-year savings</p>
            <p className="text-xl font-bold text-[#0F6E56]">RM {Math.round(fiveYearSaving).toLocaleString()}</p>
            <p className="text-[10px] text-[#1D9E75]">if you switch now</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 font-bold mb-1">📅 Commute days/year</p>
            <p className="text-xl font-bold text-gray-800">264</p>
            <p className="text-[10px] text-gray-400">working days</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <button onClick={() => setShowCO2Info(!showCO2Info)} className="w-full text-center">
              <p className="text-[10px] text-green-600 font-bold mb-1">🌿 CO₂ saved/month ℹ️</p>
              <p className="text-xl font-bold text-green-700">{co2Saved}kg</p>
              <p className="text-[10px] text-green-500">switching to transit</p>
            </button>
          </div>
        </div>
        {showCO2Info && (
          <div className="mx-4 mb-4 bg-green-50 rounded-xl p-3">
            <p className="text-xs font-bold text-green-700 mb-1">How we calculate CO₂ savings:</p>
            <p className="text-[11px] text-green-600 leading-relaxed">
              🚗 Petrol car: ~0.21kg CO₂ per km (IPCC average for petrol vehicles)<br/>
              🚇 Rapid KL: ~0.04kg CO₂ per km (electric trains, cleaner grid)<br/>
              Saved = (0.21 - 0.04) × {initial.route.distanceKm}km × 2 ways × 22 days = {co2Saved}kg/month
            </p>
          </div>
        )}
      </div>

      {/* ── HIDDEN COSTS ────────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-stone-100">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">🔍 Beyond the numbers</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Factors most calculators ignore</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-stone-100">
          <div className="p-4">
            <p className="text-xs font-bold text-red-500 mb-3">🚗 Driving realities</p>
            {["😤 Traffic stress", "🅿️ Hunting for parking", "⚠️ Accident risk", "🌡️ Unpredictable jams", "🧠 Mental fatigue", "⛽ Petrol price risk"].map(item => (
              <p key={item} className="text-[11px] text-gray-600 mb-1.5 leading-tight">{item}</p>
            ))}
          </div>
          <div className="p-4">
            <p className="text-xs font-bold text-[#0F6E56] mb-3">🚇 Transit realities</p>
            {["⏳ Waiting for trains", "🔄 Transfers", "👥 Crowded peak hours", "🌧️ Walking in rain", "🚶 Last-mile distance", "📅 Fixed schedule"].map(item => (
              <p key={item} className="text-[11px] text-gray-600 mb-1.5 leading-tight">{item}</p>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center pb-3">Only you can decide which trade-off fits your lifestyle.</p>
      </div>

      {/* ── FULL BREAKDOWN (collapsible) ────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowFullBreakdown(!showFullBreakdown)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">🧮 Full cost breakdown</p>
          <span className="text-gray-400">{showFullBreakdown ? "▲" : "▼"}</span>
        </button>
        {showFullBreakdown && (
          <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">🚗 Drive (with toll)</p>
                <div className="space-y-1">
                  {[["⛽ Fuel", Math.round(car.fuelRM)], ["🛣️ Toll", Math.round(car.tollRM)], ["🅿️ Parking", Math.round(car.parkingRM)]].map(([l,v]) => (
                    <div key={l} className="flex justify-between text-xs">
                      <span className="text-gray-500">{l}</span>
                      <span className="text-gray-700 font-medium">RM {v}</span>
                    </div>
                  ))}
                  <div className="border-t border-stone-100 pt-1 flex justify-between text-xs font-bold">
                    <span>Total</span><span>RM {Math.round(car.totalMonthly)}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">{transitIcon} {transitLabel}</p>
                <div className="space-y-1">
                  {hasMyPass50 ? (
                    <div className="flex justify-between text-xs"><span className="text-gray-500">🎫 Monthly pass</span><span className="text-gray-700 font-medium">RM 50</span></div>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs"><span className="text-gray-500">🎫 Fare</span><span className="text-gray-700 font-medium">RM {Math.round(initial.transit.fareRM)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-gray-500">🅿️ Park & Ride</span><span className="text-gray-700 font-medium">RM {Math.round(initial.transit.parkAndRideRM)}</span></div>
                    </>
                  )}
                  <div className="border-t border-stone-100 pt-1 flex justify-between text-xs font-bold">
                    <span>Total</span><span>RM {Math.round(transitMonthly)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Assumptions</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {["22 working days/month", "RON95 RM 2.05/L", "10L per 100km",
                  useMonthlyPackage ? `Parking RM ${monthlyPackageRM}/month` : `Parking RM ${parkingRM.toFixed(1)}/day`
                ].map(a => <span key={a} className="text-[10px] text-gray-500">• {a}</span>)}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> Estimates based on public data and typical KL traffic. Actual costs may vary.
            </p>
          </div>
        )}
      </div>

      {/* ── SHARE ───────────────────────────────────── */}
      <a
        href={`https://api.whatsapp.com/send?text=I spend RM ${Math.round(car.totalMonthly)}/month just to commute (${initial.route.originLabel} → ${initial.route.destinationLabel}).%0A%0ABest option: ${winner.label} at RM ${Math.round(winner.cost)}/month${monthlySaving > 0 ? ` — saving RM ${monthlySaving}/month or RM ${Math.round(annualSaving).toLocaleString()}/year` : ''}.%0A%0ACheck yours: jalanku.my`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#0F6E56] hover:bg-[#085041] text-white rounded-2xl py-4 font-bold text-sm text-center transition-colors"
      >
        📤 Share to WhatsApp
      </a>
    </div>
  )
}
