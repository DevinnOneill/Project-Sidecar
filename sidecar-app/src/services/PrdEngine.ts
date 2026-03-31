import type { ISailor, IPrdResult, PrdTier } from '../models/ISailor';

/**
 * Parse a YYYY-MM-DD string into a Date object.
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

/**
 * Format a Date object as YYYY-MM-DD.
 */
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date at midnight.
 */
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Compute the number of months between two dates.
 */
export function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/**
 * PRD TIER COMPUTATION — C-14 Semantic Lock
 *
 * 5 tiers are LOCKED and cannot be renamed, recolored, or semantically altered:
 *   EXPIRED  = PRD is in the past         → Red
 *   CRITICAL = 0-3 months out             → Orange
 *   URGENT   = 3-6 months out             → Yellow/Gold
 *   WATCH    = 6-12 months out            → Blue
 *   STABLE   = 12+ months out             → Green
 */
export function computePRDTier(sailor: ISailor): IPrdResult {
  const now = today();
  const prdDate = parseDate(sailor.prd);
  const months = monthsBetween(now, prdDate);

  let tier: PrdTier;
  let label: string;
  let cssClass: string;

  if (prdDate <= now) {
    tier = 'EXPIRED';
    label = 'EXPIRED';
    cssClass = 'prd--expired';
  } else if (months <= 3) {
    tier = 'CRITICAL';
    label = `${months}mo`;
    cssClass = 'prd--critical';
  } else if (months <= 6) {
    tier = 'URGENT';
    label = `${months}mo`;
    cssClass = 'prd--urgent';
  } else if (months <= 12) {
    tier = 'WATCH';
    label = `${months}mo`;
    cssClass = 'prd--watch';
  } else {
    tier = 'STABLE';
    label = `${months}mo`;
    cssClass = 'prd--stable';
  }

  return { tier, months, label, cssClass };
}

/**
 * Get days since last contact.
 */
export function daysSinceContact(sailor: ISailor): number {
  const now = today();
  const contactDate = parseDate(sailor.lastContact);
  return Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24));
}
