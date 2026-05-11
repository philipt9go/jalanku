// ─────────────────────────────────────────────────────────────
// JalanKu — Domain Types v5
// ─────────────────────────────────────────────────────────────

export type UserPlan = "free" | "pro"

export interface CommuteRoute {
  id: string
  originLabel: string
  destinationLabel: string
  distanceKm: number
  workingDaysPerMonth: number
}

export interface CarInputs {
  fuelEfficiencyLper100km: number
  petrolPricePerLitre: number
  tollPerTrip: number
  dailyParkingRM: number
}

export interface CarCost {
  inputs: CarInputs
  fuelRM: number
  tollRM: number
  parkingRM: number
  totalMonthly: number
}

export interface TransitLine {
  name: string
  colour: string
  fromStation: string
  toStation: string
}

export interface TransitCost {
  fareRM: number
  parkAndRideRM: number
  totalMonthly: number
  transitTimeMinutes: number
  driveTimeMinutes: number
  driveTimePeakMinutes: number
  routeDescription: string
  lines: TransitLine[]
}

export interface ComparisonResult {
  route: CommuteRoute
  car: CarCost
  carNoToll: CarCost          // V5: alternate no-toll driving route
  noTollExtraMinutes: number  // extra time without toll
  transit: TransitCost
  myPass50Monthly: number     // always RM 50 flat
  savingsRM: number
  savingsAnnualRM: number
  extraMinutesPerDay: number
  verdict: "transit_wins" | "car_wins" | "mypass_wins" | "close_call"
  createdAt: string
}

export interface SavedRoute {
  id: string
  routeId: string
  customCarInputs: CarInputs
  savedAt: string
  lastViewed: string
}

export interface TollSection {
  from: string
  to: string
  feeRM: number
  distanceKm: number
}

export interface TollHighway {
  id: string
  name: string
  sections: TollSection[]
}

export interface ParkAndRideStation {
  id: string
  name: string
  line: string
  dailyFeeRM: number
  estimatedSpaces: number
  provider: string
}

export interface CachedRoute {
  id: string
  origin: string
  destination: string
  distanceKm: number
  driveTimeMinutes: number
  driveTimePeakMinutes: number
  noTollExtraMinutes: number
  noTollExtraKm: number
  transitTimeMinutes: number
  fareRM: number
  routeDescription: string
  lines: TransitLine[]
  tollHighways: string[]
  recommendedParking: string | null
  cachedAt: string
}

export interface LookupRequest {
  routeId: string
  customCarInputs?: Partial<CarInputs>
}

export interface LookupResponse {
  result: ComparisonResult
  remainingFreeLookupsToday: number | null
}
