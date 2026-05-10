import Link from "next/link"

interface Props {
  title: string
  description: string
  upgradeHref: string
}

export default function LockedFeature({ title, description, upgradeHref }: Props) {
  return (
    <div className="relative rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 mb-4">
      <div className="absolute -top-3 left-4 bg-amber-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        Pro
      </div>
      <p className="font-medium text-gray-800 mb-1 text-sm">{title}</p>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{description}</p>
      <Link
        href={upgradeHref}
        className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Upgrade to Pro — RM 9.90/month
      </Link>
    </div>
  )
}
