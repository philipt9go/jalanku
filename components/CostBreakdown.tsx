import type { CarCost, TransitCost } from "@/lib/types"

interface Props {
  car: CarCost
  transit: TransitCost
}

export default function CostBreakdown({ car, transit }: Props) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pecahan kos bulanan</p>
      <div className="grid grid-cols-2 gap-3">

        {/* Car */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 border-t-2 border-t-red-400">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚗</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Memandu</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-3">RM {car.totalMonthly.toFixed(0)}</p>
          <div className="space-y-2">
            <Row label="⛽ Minyak (RON95)" value={car.fuelRM} note={`${car.inputs.fuelEfficiencyLper100km}L/100km`} />
            <Row label="🛣️ Toll (2 hala)" value={car.tollRM} note="22 hari kerja" />
            <Row label="🅿️ Parking" value={car.parkingRM} note="RM 4/hari" />
          </div>
        </div>

        {/* Transit — with real line names */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 border-t-2 border-t-[#1D9E75]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚇</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Transit</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-3">RM {transit.totalMonthly.toFixed(0)}</p>
          <div className="space-y-2">
            <Row label="🎫 Tiket (2 hala)" value={transit.fareRM} note="22 hari kerja" />
            <Row label="🅿️ Park & Ride" value={transit.parkAndRideRM} note={transit.parkAndRideRM === 0 ? "Jalan kaki ke stesen" : "Stesen berdekatan"} />
            <div className="pt-2 border-t border-stone-100 space-y-1">
              <TimeRow label="🚇 Masa transit" value={`${transit.transitTimeMinutes} min`} />
              <TimeRow label="🚗 Masa memandu" value={`${transit.driveTimeMinutes} min (luar peak)`} />
              <TimeRow label="🚗 Masa peak hour" value={`${transit.driveTimePeakMinutes} min`} />
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions — transparent, builds trust */}
      <div className="mt-3 bg-stone-100 rounded-xl px-4 py-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Andaian pengiraan</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-xs text-gray-500">📅 22 hari kerja/bulan</span>
          <span className="text-xs text-gray-500">⛽ RON95 RM 2.05/L</span>
          <span className="text-xs text-gray-500">🚗 {car.inputs.fuelEfficiencyLper100km}L per 100km</span>
          <span className="text-xs text-gray-500">🅿️ RM {car.inputs.dailyParkingRM}/hari parking</span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          💡 Korang boleh guna nombor sebenar korang untuk keputusan lebih tepat
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <span className="text-xs text-gray-500">{label}</span>
        {note && <p className="text-[10px] text-gray-400">{note}</p>}
      </div>
      <span className="text-xs font-bold text-gray-700">RM {value.toFixed(0)}</span>
    </div>
  )
}

function TimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className="text-[10px] text-gray-600 font-medium">{value}</span>
    </div>
  )
}
