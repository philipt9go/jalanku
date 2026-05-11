import type { CachedRoute, ComparisonResult, TransitCost, CommuteRoute, CarInputs } from "./types"
import type { TollHighway, ParkAndRideStation } from "./types"
import { buildComparison } from "./car-cost"

import transitCacheData from "../data/transit_cache.json"
import tollRatesData from "../data/toll_rates.json"
import parkingRatesData from "../data/parking_rates.json"

const transitCache = transitCacheData as CachedRoute[]
const tollHighways = tollRatesData as TollHighway[]
const parkingStations = parkingRatesData as ParkAndRideStation[]

export function getRoute(routeId: string): CachedRoute | null {
  return transitCache.find((r) => r.id === routeId) ?? null
}

export function getAllRoutes(): CachedRoute[] {
  return transitCache
}

export function lookupComparison(
  routeId: string,
  customCarInputs: Partial<CarInputs> = {}
): ComparisonResult | null {
  const cached = getRoute(routeId)
  if (!cached) return null

  const parkAndRideStation = cached.recommendedParking
    ? parkingStations.find((s) => s.id === cached.recommendedParking)
    : null

  const fareMonthly = cached.fareRM * 2 * 22
  const parkAndRideMonthly = parkAndRideStation ? parkAndRideStation.dailyFeeRM * 22 : 0

  const transit: TransitCost = {
    fareRM: Math.round(fareMonthly * 100) / 100,
    parkAndRideRM: parkAndRideMonthly,
    totalMonthly: Math.round((fareMonthly + parkAndRideMonthly) * 100) / 100,
    transitTimeMinutes: cached.transitTimeMinutes,
    driveTimeMinutes: cached.driveTimeMinutes,
    driveTimePeakMinutes: cached.driveTimePeakMinutes,
    routeDescription: cached.routeDescription,
    lines: cached.lines,
  }

  const route: CommuteRoute = {
    id: cached.id,
    originLabel: cached.origin,
    destinationLabel: cached.destination,
    distanceKm: cached.distanceKm,
    workingDaysPerMonth: 22,
  }

  const routeTollPerTrip = cached.tollHighways.reduce((sum, hwId) => {
    const hw = tollHighways.find((h) => h.id === hwId)
    return sum + (hw?.sections[0]?.feeRM ?? 0)
  }, 0)

  return buildComparison(
    route,
    transit,
    routeTollPerTrip,
    cached.noTollExtraMinutes ?? 0,
    cached.noTollExtraKm ?? 0,
    customCarInputs
  )
}

export function getUniqueOrigins(): string[] {
  return [...new Set(transitCache.map((r) => r.origin))].sort()
}

export function getDestinationsForOrigin(origin: string): string[] {
  return transitCache.filter((r) => r.origin === origin).map((r) => r.destination).sort()
}

export function findRouteId(origin: string, destination: string): string | null {
  return transitCache.find(
    (r) => r.origin === origin && r.destination === destination
  )?.id ?? null
}

export function getSampleResults(limit = 6): ComparisonResult[] {
  return transitCache
    .slice(0, limit)
    .map((r) => lookupComparison(r.id))
    .filter(Boolean) as ComparisonResult[]
}
