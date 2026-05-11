import { notFound } from "next/navigation"
import Link from "next/link"
import { lookupComparison } from "@/lib/cache"
import ResultCalculator from "@/components/ResultCalculator"

interface Props {
  params: Promise<{ routeId: string }>
}

export default async function ResultPage({ params }: Props) {
  const { routeId } = await params
  const result = lookupComparison(routeId)
  if (!result) notFound()

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white px-5 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-bold text-[#0F6E56] tracking-tight text-lg">JalanKu</Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Try another route
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">
            {result.route.originLabel} → {result.route.destinationLabel} · 22 working days/month
          </p>
          <h1 className="text-xl font-bold text-gray-900">
            Your monthly commute breakdown 📊
          </h1>
        </div>

        <ResultCalculator initial={result} />

        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-gray-400">
            Data based on official Rapid KL fares · current toll rates · RON95 RM 2.05
          </p>
          <p className="text-xs text-gray-400">jalanku.my · hello@jalanku.my</p>
        </div>
      </main>
    </div>
  )
}
