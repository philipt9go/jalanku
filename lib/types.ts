// ─────────────────────────────────────────────────────────────
// JalanKu — Domain Types
// Design principle: model the domain first, code second.
// Every UI element and API call maps back to one of these.
// ─────────────────────────────────────────────────────────────

// ── Auth & Users ─────────────────────────────────────────────

export type UserPlan = "free" | "pro"

export interface UserProfile {
  id: string
  email: string
  plan: UserPlan
  dailyLookups: number       // resets at midnight MYT
  savedRoutes: SavedRoute[]
}

// ── Core Commute Domain ───────────────────────────────────────

export interface CommuteRoute {
  id: string                  // e.g. "kepong-klcc"
  originLabel: string         // e.g. "Kepong"
  destinationLabel: string    // e.g. "KLCC"
  distanceKm: number
  workingDaysPerMonth: number // default: 22
}

export interface CarInputs {
  fuelEfficiencyLper100km: number  // default: 10 (Myvi/Axia benchmark)
  petrolPricePerLitre: number      // RON95 = RM 2.05 (subsidised, stable)
  tollPerTrip: number              // one-way toll in RM
  dailyParkingRM: number           // per day at destination
}

export interface CarCost {
  inputs: CarInputs
  fuelRM: number
  tollRM: number
  parkingRM: number
  totalMonthly: number
}

export interface TransitCost {
  fareRM: number              // one-way fare × 2 × working days
  parkAndRideRM: number       // 0 if walking to station
  totalMonthly: number
  transitTimeMinutes: number  // door-to-door one-way
  driveTimeMinutes: number    // driving one-way (no traffic)
  driveTimePeakMinutes: number // driving one-way (peak hour)
  routeDescription: string    // e.g. "LRT Kelana Jaya → MRT Kajang (1 transfer)"
  lines: TransitLine[]
}

export interface TransitLine {
  name: string                // e.g. "LRT Kelana Jaya Line"
  colour: string              // hex, matching real Rapid KL brand colours
  fromStation: string
  toStation: string
}

export interface ComparisonResult {
  route: CommuteRoute
  car: CarCost
  transit: TransitCost
  savingsRM: number           // monthly
  savingsAnnualRM: number     // yearly
  extraMinutesPerDay: number  // transit - drive (one-way, normal traffic)
  verdict: "transit_wins" | "car_wins" | "close_call"
  createdAt: string           // ISO date string
}

// ── Pro Features ──────────────────────────────────────────────

export interface SavedRoute {
  id: string
  routeId: string
  label?: string              // user-defined nickname
  customCarInputs: CarInputs
  savedAt: string
  lastViewed: string
}

export interface MonthlySnapshot {
  month: string               // "2026-05"
  routeId: string
  carCostRM: number
  transitCostRM: number
  savingsRM: number
  didSwitch: boolean | null   // did user actually commute by transit?
}

// ── Static Data Shapes ────────────────────────────────────────

export interface TollSection {
  from: string
  to: string
  feeRM: number
  distanceKm: number
}

export interface TollHighway {
  id: string                  // e.g. "duke"
  name: string                // e.g. "DUKE"
  sections: TollSection[]
}

export interface ParkAndRideStation {
  id: string
  name: string                // e.g. "Sri Damansara Timur MRT"
  line: string                // e.g. "MRT Putrajaya Line"
  dailyFeeRM: number
  estimatedSpaces: number
  provider: string            // "Rapid KL" | "KTM" etc
}

// ── Transit Cache ─────────────────────────────────────────────
// Shape of each entry in data/transit_cache.json

export interface CachedRoute {
  id: string
  origin: string
  destination: string
  distanceKm: number
  driveTimeMinutes: number
  driveTimePeakMinutes: number
  transitTimeMinutes: number
  fareRM: number
  routeDescription: string
  lines: TransitLine[]
  tollHighways: string[]      // highway IDs encountered on driving route
  recommendedParking: string | null  // park-and-ride station ID, if applicable
  cachedAt: string
}

// ── API Shapes ────────────────────────────────────────────────

export interface LookupRequest {
  routeId: string
  customCarInputs?: Partial<CarInputs>  // Pro only
}

export interface LookupResponse {
  result: ComparisonResult
  remainingFreeLookupsToday: number | null  // null = Pro user
}

export interface BillingCallbackPayload {
  paid: string                // "true" | "false" — Billplz sends as string
  id: string
  collection_id: string
  reference_1: string         // clerk user ID
  reference_1_label: string
}
