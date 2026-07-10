/**
 * Malaysian 4D prize tables.
 * Prizes are per RM1 bet. Identical across ALL operators.
 *
 * Straight prizes and iBox lookup tables sourced from CLAUDE.md.
 */

export type PrizeTier = '1st' | '2nd' | '3rd' | 'special' | 'consolation';

export interface PrizeEntry {
  tier: PrizeTier;
  label: string;
  big: number;   // per RM1
  small: number;  // per RM1 (0 = not applicable)
}

/** Straight prizes per RM1 bet */
export const STRAIGHT_PRIZES: PrizeEntry[] = [
  { tier: '1st',         label: '1st Prize',   big: 2500, small: 3500 },
  { tier: '2nd',         label: '2nd Prize',   big: 1000, small: 2000 },
  { tier: '3rd',         label: '3rd Prize',   big:  500, small: 1000 },
  { tier: 'special',     label: 'Special',     big:  180, small:    0 },
  { tier: 'consolation', label: 'Consolation', big:   60, small:    0 },
];

/**
 * iBox prizes per RM1 bet, keyed by permutation count.
 * Only 24, 12, 6, 4 are valid. 1 perm (all-same) = iBox not applicable.
 */
export type PermCount = 24 | 12 | 6 | 4;

export interface IBoxPrizeRow {
  tier: PrizeTier;
  label: string;
  big: Record<PermCount, number>;
  small: Record<PermCount, number>;
}

export const IBOX_PRIZES: IBoxPrizeRow[] = [
  {
    tier: '1st', label: '1st Prize',
    big:   { 24: 105, 12: 209, 6: 417, 4: 625 },
    small: { 24: 146, 12: 292, 6: 584, 4: 875 },
  },
  {
    tier: '2nd', label: '2nd Prize',
    big:   { 24: 42, 12: 84, 6: 167, 4: 250 },
    small: { 24: 84, 12: 167, 6: 334, 4: 500 },
  },
  {
    tier: '3rd', label: '3rd Prize',
    big:   { 24: 21, 12: 42, 6: 84, 4: 125 },
    small: { 24: 42, 12: 84, 6: 167, 4: 250 },
  },
  {
    tier: 'special', label: 'Special',
    big:   { 24: 8, 12: 15, 6: 30, 4: 45 },
    small: { 24: 0, 12: 0, 6: 0, 4: 0 },
  },
  {
    tier: 'consolation', label: 'Consolation',
    big:   { 24: 3, 12: 5, 6: 10, 4: 15 },
    small: { 24: 0, 12: 0, 6: 0, 4: 0 },
  },
];
