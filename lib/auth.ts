import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import type { UserPlan } from "./types"

// ─────────────────────────────────────────────────────────────
// Plan helpers
// ─────────────────────────────────────────────────────────────

export async function getUserPlan(): Promise<UserPlan> {
  const { sessionClaims } = await auth()
  const meta = sessionClaims?.metadata as Record<string, unknown> | undefined
  return (meta?.plan as UserPlan) ?? "free"
}

export async function requirePro(): Promise<void> {
  const plan = await getUserPlan()
  if (plan !== "pro") {
    throw new Error("PRO_REQUIRED")
  }
}

export function isPro(plan: UserPlan): boolean {
  return plan === "pro"
}

// ─────────────────────────────────────────────────────────────
// Daily lookup rate limiting (free tier: 3 lookups/day)
// Stored in Clerk user privateMetadata to avoid needing a DB
// ─────────────────────────────────────────────────────────────

const FREE_DAILY_LIMIT = 3

interface LookupMeta {
  count: number
  date: string // "YYYY-MM-DD" MYT
}

function todayMYT(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
  })
}

export async function getRemainingLookups(): Promise<number | null> {
  const plan = await getUserPlan()
  if (plan === "pro") return null // unlimited

  const { userId } = await auth()
  if (!userId) return FREE_DAILY_LIMIT // not signed in = still gets 3

  const user = await currentUser()
  const meta = user?.privateMetadata as Record<string, unknown> | undefined
  const lookupMeta = meta?.lookups as LookupMeta | undefined

  if (!lookupMeta || lookupMeta.date !== todayMYT()) {
    return FREE_DAILY_LIMIT
  }

  return Math.max(0, FREE_DAILY_LIMIT - lookupMeta.count)
}

export async function consumeLookup(): Promise<{
  allowed: boolean
  remaining: number | null
}> {
  const plan = await getUserPlan()
  if (plan === "pro") return { allowed: true, remaining: null }

  const { userId } = await auth()

  if (!userId) {
    // Not signed in — allow but don't track (client-side cookie fallback)
    return { allowed: true, remaining: FREE_DAILY_LIMIT - 1 }
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const meta = user.privateMetadata as Record<string, unknown>
  const existing = meta.lookups as LookupMeta | undefined
  const today = todayMYT()

  const count = existing?.date === today ? existing.count : 0

  if (count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  // Increment counter
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      lookups: { count: count + 1, date: today },
    },
  })

  return { allowed: true, remaining: FREE_DAILY_LIMIT - (count + 1) }
}

// ─────────────────────────────────────────────────────────────
// Upgrade user to Pro (called from Billplz callback)
// ─────────────────────────────────────────────────────────────

export async function upgradeUserToPro(userId: string): Promise<void> {
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { plan: "pro" },
  })
}
