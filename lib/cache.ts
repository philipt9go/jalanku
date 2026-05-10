import type { CachedRoute, ComparisonResult, TransitCost, CommuteRoute, CarInputs } from "./types"
import type { TollHighway, ParkAndRideStation } from "./types"
import { buildComparison } from "./car-cost"

// ─────────────────────────────────────────────────────────────
// Load static data files
// These are read at build time / server startup (Node fs, not client)
// ─────────────────────────────────────────────────────────────

// In Next.js App Router, import JSON directly (server components only)
import transitCacheData from "../data/transit_cache.json"
import tollRatesData from "../data/toll_rates.json"
import parkingRatesData from "../data/parking_rates.json"

const transitCache = transitCacheData as CachedRoute[]
const tollHighways = tollRatesData as TollHighway[]
const parkingStations = parkingRatesData as ParkAndRideStation[]

// ─────────────────────────────────────────────────────────────
// Route lookup
// ─────────────────────────────────────────────────────────────

export function getRoute(routeId: string): CachedRoute | null {
  return transitCache.find((r) => r.id === routeId) ?? null
}

export function getAllRoutes(): CachedRoute[] {
  return transitCache
}

// ─────────────────────────────────────────────────────────────
// Build ComparisonResult from a routeId + optional custom car inputs
// ─────────────────────────────────────────────────────────────

export function lookupComparison(
  routeId: string,
  customCarInputs: Partial<CarInputs> = {}
): ComparisonResult | null {
  const cached = getRoute(routeId)
  if (!cached) return null

  const parkAndRideStation = cached.recommendedParking
    ? parkingStations.find((s) => s.id === cached.recommendedParking)
    : null

  const transit: TransitCost = {
    fareRM: cached.fareRM * 2 * 22, // one-way × 2 × 22 working days
    parkAndRideRM: parkAndRideStation ? parkAndRideStation.dailyFeeRM * 22 : 0,
    totalMonthly: 0, // recalculated below
    transitTimeMinutes: cached.transitTimeMinutes,
    driveTimeMinutes: cached.driveTimeMinutes,
    driveTimePeakMinutes: cached.driveTimePeakMinutes,
    routeDescription: cached.routeDescription,
    lines: cached.lines,
  }

  // Recalculate transit total
  transit.totalMonthly =
    Math.round((transit.fareRM + transit.parkAndRideRM) * 100) / 100

  const route: CommuteRoute = {
    id: cached.id,
    originLabel: cached.origin,
    destinationLabel: cached.destination,
    distanceKm: cached.distanceKm,
    workingDaysPerMonth: 22,
  }

  // Derive toll from the highways on this driving route
  const routeTollPerTrip = cached.tollHighways.reduce((sum, hwId) => {
    const hw = tollHighways.find((h) => h.id === hwId)
    if (!hw) return sum
    // Sum all sections of this highway (simplified: use first section fee)
    return sum + (hw.sections[0]?.feeRM ?? 0)
  }, 0)

  return buildComparison(route, transit, {
    tollPerTrip: routeTollPerTrip,
    ...customCarInputs,
  })
}

// ─────────────────────────────────────────────────────────────
// Helpers for the route selector dropdown
// ─────────────────────────────────────────────────────────────

export function getUniqueOrigins(): string[] {
  return [...new Set(transitCache.map((r) => r.origin))].sort()
}

export function getDestinationsForOrigin(origin: string): string[] {
  return transitCache
    .filter((r) => r.origin === origin)
    .map((r) => r.destination)
    .sort()
}

export function findRouteId(origin: string, destination: string): string | null {
  return transitCache.find(
    (r) => r.origin === origin && r.destination === destination
  )?.id ?? null
}

// ─────────────────────────────────────────────────────────────
// Sample routes for the landing page (top 6 by savings)
// ─────────────────────────────────────────────────────────────

export function getSampleResults(limit = 6): ComparisonResult[] {
  return transitCache
    .slice(0, limit)
    .map((r) => lookupComparison(r.id))
    .filter(Boolean) as ComparisonResult[]
}
