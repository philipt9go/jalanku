import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY
  const BILLPLZ_COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID
  const BASE_URL = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"

  if (!BILLPLZ_API_KEY || !BILLPLZ_COLLECTION_ID) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 })
  }

  const email = user.emailAddresses[0]?.emailAddress ?? ""
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "JalanKu User"

  const response = await fetch("https://www.billplz.com/api/v3/bills", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(BILLPLZ_API_KEY + ":").toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collection_id: BILLPLZ_COLLECTION_ID,
      email,
      name,
      amount: 990,                                          // RM 9.90 in sen
      description: "JalanKu Pro — Monthly subscription",
      callback_url: `${BASE_URL}/api/billing/callback`,
      redirect_url: `${BASE_URL}/dashboard?upgraded=true`,
      reference_1_label: "clerk_user_id",
      reference_1: userId,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error("Billplz error:", err)
    return NextResponse.json({ error: "Payment provider error" }, { status: 502 })
  }

  const bill = await response.json()
  return NextResponse.json({ paymentUrl: bill.url })
}
