import type { TransitLine } from "@/lib/types"

interface Props {
  lines: TransitLine[]
  routeDescription: string
  transitTimeMinutes: number
  driveTimeMinutes: number
  driveTimePeakMinutes: number
}

export default function TransitSteps({ lines, transitTimeMinutes, driveTimeMinutes, driveTimePeakMinutes }: Props) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
        🚇 Route Transit Korang
      </p>

      {/* Step-by-step transit journey */}
      <div className="space-y-0">
        {lines.map((line, index) => (
          <div key={line.name}>
            {/* Station step */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: line.colour }}
                />
                {index < lines.length - 1 && (
                  <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: line.colour + '60' }} />
                )}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-xs font-bold text-gray-700">{line.fromStation}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: line.colour }}
                  >
                    {line.name}
                  </span>
                  <span className="text-[10px] text-gray-400">→ {line.toStation}</span>
                </div>
              </div>
            </div>

            {/* Transfer indicator */}
            {index < lines.length - 1 && (
              <div className="flex gap-3 items-center ml-0 mb-0">
                <div className="w-3 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-300 border-2 border-white shadow-sm" />
                </div>
                <div className="bg-amber-50 rounded-lg px-3 py-1.5 flex-1">
                  <p className="text-[10px] font-bold text-amber-600">🔄 Tukar kereta api di {lines[index].toStation}</p>
                  <p className="text-[10px] text-amber-500">Sambung dengan {lines[index + 1].name}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final destination */}
        <div className="flex gap-3 items-start mt-1">
          <div className="w-3 h-3 rounded-full bg-[#0F6E56] border-2 border-white shadow-sm mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#0F6E56]">
              {lines[lines.length - 1]?.toStation}
            </p>
            <p className="text-[10px] text-gray-400">🚶 Jalan kaki ~5 min ke pejabat</p>
          </div>
        </div>
      </div>

      {/* Time comparison */}
      <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#E1F5EE] rounded-lg p-2">
          <p className="text-[10px] text-[#085041] font-bold mb-0.5">🚇 Transit</p>
          <p className="text-sm font-bold text-[#0F6E56]">{transitTimeMinutes} min</p>
          <p className="text-[10px] text-[#1D9E75]">konsisten</p>
        </div>
        <div className="bg-stone-50 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 font-bold mb-0.5">🚗 Drive</p>
          <p className="text-sm font-bold text-gray-700">{driveTimeMinutes} min</p>
          <p className="text-[10px] text-gray-400">luar peak</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <p className="text-[10px] text-red-500 font-bold mb-0.5">🚗 Peak hour</p>
          <p className="text-sm font-bold text-red-600">{driveTimePeakMinutes} min</p>
          <p className="text-[10px] text-red-400">jam pagi</p>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        * Masa transit adalah anggaran berdasarkan jadual Rapid KL
      </p>
    </div>
  )
}
