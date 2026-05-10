import { upgradeUserToPro } from "@/lib/auth"

// Billplz sends a POST with form-encoded data after payment
export async function POST(req: Request) {
  try {
    const body = await req.formData()

    const paid = body.get("paid") as string
    const userId = body.get("reference_1") as string
    const billId = body.get("id") as string

    console.log(`Billplz callback: bill ${billId}, paid=${paid}, userId=${userId}`)

    if (paid === "true" && userId) {
      await upgradeUserToPro(userId)
      console.log(`User ${userId} upgraded to Pro ✓`)
    }

    // Billplz requires a 200 OK response
    return new Response("OK", { status: 200 })
  } catch (err) {
    console.error("Billing callback error:", err)
    // Still return 200 to prevent Billplz from retrying
    return new Response("OK", { status: 200 })
  }
}
