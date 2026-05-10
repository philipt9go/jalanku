import type { CarCost, CarInputs, ComparisonResult, TransitCost, CommuteRoute } from "./types"

// ─────────────────────────────────────────────────────────────
// Constants — Malaysian context
// ─────────────────────────────────────────────────────────────

export const DEFAULTS: CarInputs = {
  fuelEfficiencyLper100km: 10,   // Perodua Myvi/Axia benchmark
  petrolPricePerLitre: 2.05,     // RON95 subsidised price (May 2026)
  tollPerTrip: 0,                // user provides, default = no toll
  dailyParkingRM: 4.00,          // typical office area parking
}

export const WORKING_DAYS_PER_MONTH = 22

// ─────────────────────────────────────────────────────────────
// Car cost calculation
// All figures are monthly (22 working days, both ways)
// ─────────────────────────────────────────────────────────────

export function calculateCarCost(
  distanceKm: number,
  inputs: Partial<CarInputs> = {},
  workingDays = WORKING_DAYS_PER_MONTH
): CarCost {
  const merged: CarInputs = { ...DEFAULTS, ...inputs }

  const { fuelEfficiencyLper100km, petrolPricePerLitre, tollPerTrip, dailyParkingRM } = merged

  // Fuel: (distance / 100) × efficiency × price × 2 ways × working days
  const fuelRM = round2(
    (distanceKm / 100) * fuelEfficiencyLper100km * petrolPricePerLitre * 2 * workingDays
  )

  // Toll: per trip × 2 ways × working days
  const tollRM = round2(tollPerTrip * 2 * workingDays)

  // Parking: daily rate × working days (pay once even if 2 ways)
  const parkingRM = round2(dailyParkingRM * workingDays)

  const totalMonthly = round2(fuelRM + tollRM + parkingRM)

  return {
    inputs: merged,
    fuelRM,
    tollRM,
    parkingRM,
    totalMonthly,
  }
}

// ─────────────────────────────────────────────────────────────
// Transit cost calculation
// Fare comes from pre-built cache (Google Maps → transit_cache.json)
// ─────────────────────────────────────────────────────────────

export function calculateTransitCost(
  farePerTrip: number,
  parkAndRideDailyFee: number = 0,
  workingDays = WORKING_DAYS_PER_MONTH
): Pick<TransitCost, "fareRM" | "parkAndRideRM" | "totalMonthly"> {
  const fareRM = round2(farePerTrip * 2 * workingDays)
  const parkAndRideRM = round2(parkAndRideDailyFee * workingDays)
  const totalMonthly = round2(fareRM + parkAndRideRM)

  return { fareRM, parkAndRideRM, totalMonthly }
}

// ─────────────────────────────────────────────────────────────
// Build full ComparisonResult
// ─────────────────────────────────────────────────────────────

export function buildComparison(
  route: CommuteRoute,
  transit: TransitCost,
  carInputsOverride: Partial<CarInputs> = {}
): ComparisonResult {
  const car = calculateCarCost(route.distanceKm, carInputsOverride, route.workingDaysPerMonth)

  const savingsRM = round2(car.totalMonthly - transit.totalMonthly)
  const savingsAnnualRM = round2(savingsRM * 12)
  const extraMinutesPerDay = Math.max(0, transit.transitTimeMinutes - transit.driveTimeMinutes)

  const verdict: ComparisonResult["verdict"] =
    savingsRM > 50
      ? "transit_wins"
      : savingsRM < -50
      ? "car_wins"
      : "close_call"

  return {
    route,
    car,
    transit,
    savingsRM,
    savingsAnnualRM,
    extraMinutesPerDay,
    verdict,
    createdAt: new Date().toISOString(),
  }
}

// ─────────────────────────────────────────────────────────────
// Formatting helpers (used in UI)
// ─────────────────────────────────────────────────────────────

export function formatRM(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

export function formatRMShort(amount: number): string {
  if (amount >= 1000) return `RM ${(amount / 1000).toFixed(1)}k`
  return `RM ${Math.round(amount)}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// ─────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
