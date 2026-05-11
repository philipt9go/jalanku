import type { CarCost, CarInputs, ComparisonResult, TransitCost, CommuteRoute } from "./types"

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

export const DEFAULTS: CarInputs = {
  fuelEfficiencyLper100km: 10,
  petrolPricePerLitre: 2.05,    // RON95 May 2026
  tollPerTrip: 0,
  dailyParkingRM: 4.00,
}

export const WORKING_DAYS = 22
export const MYPASS50_PRICE = 50  // RM 50/month flat unlimited Rapid KL

// ─────────────────────────────────────────────────────────────
// Car cost calculation
// ─────────────────────────────────────────────────────────────

export function calculateCarCost(
  distanceKm: number,
  inputs: Partial<CarInputs> = {},
  workingDays = WORKING_DAYS
): CarCost {
  const merged: CarInputs = { ...DEFAULTS, ...inputs }
  const { fuelEfficiencyLper100km, petrolPricePerLitre, tollPerTrip, dailyParkingRM } = merged

  const fuelRM = round2((distanceKm / 100) * fuelEfficiencyLper100km * petrolPricePerLitre * 2 * workingDays)
  const tollRM = round2(tollPerTrip * 2 * workingDays)
  const parkingRM = round2(dailyParkingRM * workingDays)

  return {
    inputs: merged,
    fuelRM,
    tollRM,
    parkingRM,
    totalMonthly: round2(fuelRM + tollRM + parkingRM),
  }
}

// ─────────────────────────────────────────────────────────────
// Build full ComparisonResult
// ─────────────────────────────────────────────────────────────

export function buildComparison(
  route: CommuteRoute,
  transit: TransitCost,
  tollPerTrip: number,
  noTollExtraMinutes: number,
  noTollExtraKm: number,
  carInputsOverride: Partial<CarInputs> = {}
): ComparisonResult {
  // Drive WITH toll
  const car = calculateCarCost(route.distanceKm, {
    tollPerTrip,
    ...carInputsOverride,
  }, route.workingDaysPerMonth)

  // Drive WITHOUT toll (longer route, no toll cost)
  const carNoToll = calculateCarCost(route.distanceKm + noTollExtraKm, {
    tollPerTrip: 0,
    ...carInputsOverride,
  }, route.workingDaysPerMonth)

  const savingsRM = round2(car.totalMonthly - transit.totalMonthly)
  const savingsAnnualRM = round2(savingsRM * 12)
  const extraMinutesPerDay = Math.max(0, transit.transitTimeMinutes - transit.driveTimeMinutes)

  // Find cheapest option
  const costs = {
    car: car.totalMonthly,
    carNoToll: carNoToll.totalMonthly,
    transit: transit.totalMonthly,
    mypass: MYPASS50_PRICE,
  }
  const cheapest = Object.entries(costs).sort((a, b) => a[1] - b[1])[0][0]

  const verdict: ComparisonResult["verdict"] =
    cheapest === "mypass" ? "mypass_wins" :
    cheapest === "transit" ? "transit_wins" :
    savingsRM < -50 ? "car_wins" : "close_call"

  return {
    route,
    car,
    carNoToll,
    noTollExtraMinutes,
    transit,
    myPass50Monthly: MYPASS50_PRICE,
    savingsRM,
    savingsAnnualRM,
    extraMinutesPerDay,
    verdict,
    createdAt: new Date().toISOString(),
  }
}

// ─────────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────────

export function formatRM(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

export function formatRMRound(amount: number): string {
  return `RM ${Math.round(amount).toLocaleString()}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
