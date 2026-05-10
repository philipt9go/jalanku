import Link from "next/link"

const features = [
  { text: "Unlimited route lookups", pro: true },
  { text: "Custom fuel efficiency & toll routes", pro: true },
  { text: "Monthly savings tracker", pro: true },
  { text: "Compare up to 3 routes side-by-side", pro: true },
  { text: "Shareable PDF report", pro: true },
  { text: "Petrol price change alerts (email)", pro: true },
  { text: "Save up to 10 routes", pro: true },
  { text: "Early access to new features", pro: true },
]

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[#0F6E56] tracking-tight text-lg">JalanKu</Link>
      </nav>

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">JalanKu Pro</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            For serious commuters who want full control over their numbers
          </p>
        </div>

        {/* Pricing card */}
        <div className="bg-white border-2 border-[#1D9E75] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900">Pro plan</span>
            <span className="text-xs bg-[#E1F5EE] text-[#085041] font-semibold px-2.5 py-1 rounded-full">Most popular</span>
          </div>

          <div className="mb-1">
            <span className="text-4xl font-semibold text-gray-900">RM 9.90</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Less than one day&apos;s parking at KLCC</p>

          <ul className="space-y-2 mb-6">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="text-[#1D9E75] font-bold">✓</span>
                {f.text}
              </li>
            ))}
          </ul>

          {/* This will point to your Billplz payment endpoint */}
          <button className="w-full bg-[#0F6E56] hover:bg-[#085041] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            Pay via FPX (Billplz) — RM 9.90
          </button>
          <p className="text-center text-xs text-gray-400 mt-2.5">
            Cancel anytime · No contract · Malaysian FPX payment
          </p>
        </div>

        {/* Free vs Pro table */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Free vs Pro</p>
          <div className="grid grid-cols-3 text-center text-xs mb-2">
            <div className="text-left text-gray-400 font-medium">Feature</div>
            <div className="text-gray-400 font-medium">Free</div>
            <div className="text-[#0F6E56] font-semibold">Pro</div>
          </div>
          {[
            ["Route lookups", "3/day", "Unlimited"],
            ["Cost breakdown", "Basic", "Full"],
            ["Custom car inputs", "—", "✓"],
            ["Savings history", "—", "✓"],
            ["PDF report", "—", "✓"],
            ["Petrol alerts", "—", "✓"],
          ].map(([feat, free, pro]) => (
            <div key={feat} className="grid grid-cols-3 text-center py-1.5 border-t border-stone-100 text-xs">
              <div className="text-left text-gray-500">{feat}</div>
              <div className="text-gray-400">{free}</div>
              <div className="text-[#0F6E56] font-medium">{pro}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back to calculator</Link>
        </div>
      </main>
    </div>
  )
}
