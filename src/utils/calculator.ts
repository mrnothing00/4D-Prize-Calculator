import {
  STRAIGHT_PRIZES,
  IBOX_PRIZES,
  type PermCount,
  type PrizeTier,
} from '@/data/prizes';

export type BetType = 'straight' | 'ibox' | 'box';

export interface PrizeRow {
  tier: PrizeTier;
  label: string;
  bigPrize: number;
  smallPrize: number;
}

export interface PrizeBreakdown {
  prizes: PrizeRow[];
  bigTotal: number;
  smallTotal: number;
}

export interface CombinedTotals {
  bigTotal: number;
  smallTotal: number;
  combinedTotal: number;
}

// ---------------------------------------------------------------------------
// Permutations
// ---------------------------------------------------------------------------

/**
 * Count unique permutations of a 4-digit number string.
 *
 * 4! / (n1! * n2! * ... * nk!)
 *   All different  (1234) → 24
 *   One pair        (1123) → 12
 *   Two pairs       (1122) → 6
 *   Three same      (1112) → 4
 *   All same        (1111) → 1
 */
export function getPermutationCount(number: string): number {
  const freq = new Map<string, number>();
  for (const digit of number) {
    freq.set(digit, (freq.get(digit) ?? 0) + 1);
  }

  let divisor = 1;
  for (const count of freq.values()) {
    for (let i = 2; i <= count; i++) {
      divisor *= i;
    }
  }

  return 24 / divisor;
}

// ---------------------------------------------------------------------------
// Straight
// ---------------------------------------------------------------------------

/**
 * Straight bet: exact-match only.
 * Prize = table value × bet amount.
 */
export function calculateStraight(
  bigAmount: number,
  smallAmount: number,
): PrizeBreakdown {
  const prizes: PrizeRow[] = STRAIGHT_PRIZES.map((entry) => ({
    tier: entry.tier,
    label: entry.label,
    bigPrize: entry.big * bigAmount,
    smallPrize: entry.small * smallAmount,
  }));

  const bigTotal = prizes.reduce((sum, p) => sum + p.bigPrize, 0);
  const smallTotal = prizes.reduce((sum, p) => sum + p.smallPrize, 0);

  return { prizes, bigTotal, smallTotal };
}

// ---------------------------------------------------------------------------
// iBox
// ---------------------------------------------------------------------------

/**
 * iBox bet: covers all permutations for RM1.
 * Uses the dedicated iBox lookup table (values vary by perm count).
 * Prize = iBox table value × bet amount.
 *
 * Not applicable when permCount is 1 (all digits identical).
 */
export function calculateIBox(
  bigAmount: number,
  smallAmount: number,
  permCount: PermCount,
): PrizeBreakdown {
  const prizes: PrizeRow[] = IBOX_PRIZES.map((entry) => ({
    tier: entry.tier,
    label: entry.label,
    bigPrize: entry.big[permCount] * bigAmount,
    smallPrize: entry.small[permCount] * smallAmount,
  }));

  const bigTotal = prizes.reduce((sum, p) => sum + p.bigPrize, 0);
  const smallTotal = prizes.reduce((sum, p) => sum + p.smallPrize, 0);

  return { prizes, bigTotal, smallTotal };
}

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------

/**
 * Box bet: bets on every permutation at full straight price.
 * Cost = bet amount × permutation count.
 * Prize = full straight prize × bet amount (same as Straight).
 */
export function calculateBox(
  bigAmount: number,
  smallAmount: number,
  _permCount: PermCount,
): PrizeBreakdown {
  // Prize-wise identical to Straight — you paid for all perms so you win the full amount.
  return calculateStraight(bigAmount, smallAmount);
}

// ---------------------------------------------------------------------------
// Cost
// ---------------------------------------------------------------------------

/**
 * Total ticket cost.
 * - Straight / iBox: bigAmount + smallAmount
 * - Box: (bigAmount + smallAmount) × permCount
 */
export function calculateTotalCost(
  betType: BetType,
  bigAmount: number,
  smallAmount: number,
  permCount: number,
): number {
  const base = bigAmount + smallAmount;
  if (betType === 'box') {
    return base * permCount;
  }
  return base;
}

// ---------------------------------------------------------------------------
// Combined totals
// ---------------------------------------------------------------------------

/**
 * Merge Big and Small totals into a single combined total.
 */
export function getCombinedTotals(
  bigTotal: number,
  smallTotal: number,
): CombinedTotals {
  return {
    bigTotal,
    smallTotal,
    combinedTotal: bigTotal + smallTotal,
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** Format a number as RM currency string. Returns '-' for zero. */
export function formatRM(amount: number): string {
  if (amount === 0) return '-';
  if (amount % 1 === 0) {
    return `RM ${amount.toLocaleString('en-MY')}`;
  }
  return `RM ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
