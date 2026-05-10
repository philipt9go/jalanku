interface Props {
  savingsRM: number
  savingsAnnualRM: number
  extraMinutesPerDay: number
  carTotal: number
  transitTotal: number
}

export default function SavingsBanner({ savingsRM, savingsAnnualRM, extraMinutesPerDay, carTotal, transitTotal }: Props) {
  const transitWins = savingsRM > 0
  const fiveYearCar = Math.round(carTotal * 12 * 5)
  const fiveYearSavings = Math.round(savingsAnnualRM * 5)

  return (
    <div className="mb-4 space-y-3">

      {/* PAIN FIRST — what they spend now */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
          💸 Korang sedang belanja setiap bulan
        </p>
        <p className="text-4xl font-bold text-red-600 mb-1">
          RM {carTotal.toFixed(0)}
          <span className="text-base font-normal text-red-400">/bulan</span>
        </p>
        <p className="text-sm text-red-400 mb-3">
          just untuk pergi dan balik kerja
        </p>

        {/* 5-year shock */}
        <div className="bg-red-100 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-red-500 mb-0.5">⚠️ Kalau korang terus macam ni selama 5 tahun...</p>
          <p className="text-xl font-bold text-red-600">
            RM {fiveYearCar.toLocaleString()} habis untuk pergi kerja sahaja.
          </p>
        </div>
      </div>

      {/* SOLUTION — transit savings */}
      {transitWins && (
        <div className="bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-[#085041] uppercase tracking-wider mb-1">
            ✅ Kalau naik transit, korang boleh jimat
          </p>
          <p className="text-4xl font-bold text-[#0F6E56] mb-1">
            RM {Math.round(savingsRM)}
            <span className="text-base font-normal text-[#1D9E75]">/bulan</span>
          </p>

          <div className="mt-3 pt-3 border-t border-[#1D9E75]/20 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-[#085041] font-semibold mb-0.5">Setahun jimat</p>
              <p className="text-xl font-bold text-[#0F6E56]">RM {Math.round(savingsAnnualRM).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-[#085041] font-semibold mb-0.5">5 tahun jimat</p>
              <p className="text-xl font-bold text-[#0F6E56]">RM {fiveYearSavings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-[#085041] font-semibold mb-0.5">Masa tambah</p>
              <p className="text-xl font-bold text-[#085041]">+{extraMinutesPerDay} min</p>
              <p className="text-[10px] text-[#1D9E75]">sehari</p>
            </div>
          </div>
        </div>
      )}

      {!transitWins && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            🚗 Untuk route ini, memandu lebih jimat
          </p>
          <p className="text-2xl font-bold text-amber-700">
            RM {Math.abs(Math.round(savingsRM))} lebih murah/bulan vs transit
          </p>
          <p className="text-sm text-amber-500 mt-1">Transit: RM {transitTotal.toFixed(0)}/bulan</p>
        </div>
      )}
    </div>
  )
}
