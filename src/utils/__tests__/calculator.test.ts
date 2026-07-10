import {
  getPermutationCount,
  calculateStraight,
  calculateIBox,
  calculateBox,
  calculateTotalCost,
  getCombinedTotals,
  formatRM,
} from '../calculator';

// ===========================================================================
// getPermutationCount
// ===========================================================================
describe('getPermutationCount', () => {
  test('all digits different (1234) → 24', () => {
    expect(getPermutationCount('1234')).toBe(24);
  });

  test('all digits different (5678) → 24', () => {
    expect(getPermutationCount('5678')).toBe(24);
  });

  test('one pair (1123) → 12', () => {
    expect(getPermutationCount('1123')).toBe(12);
  });

  test('one pair (9987) → 12', () => {
    expect(getPermutationCount('9987')).toBe(12);
  });

  test('two pairs (1122) → 6', () => {
    expect(getPermutationCount('1122')).toBe(6);
  });

  test('two pairs (3344) → 6', () => {
    expect(getPermutationCount('3344')).toBe(6);
  });

  test('three same digits (1112) → 4', () => {
    expect(getPermutationCount('1112')).toBe(4);
  });

  test('three same digits (0007) → 4', () => {
    expect(getPermutationCount('0007')).toBe(4);
  });

  test('all same digits (1111) → 1', () => {
    expect(getPermutationCount('1111')).toBe(1);
  });

  test('all zeros (0000) → 1', () => {
    expect(getPermutationCount('0000')).toBe(1);
  });

  test('all nines (9999) → 1', () => {
    expect(getPermutationCount('9999')).toBe(1);
  });
});

// ===========================================================================
// calculateStraight
// ===========================================================================
describe('calculateStraight', () => {
  test('RM1 Big, RM0 Small', () => {
    const result = calculateStraight(1, 0);
    expect(result.prizes).toHaveLength(5);

    // Per CLAUDE.md straight prizes
    expect(result.prizes[0]).toMatchObject({ label: '1st Prize',   bigPrize: 2500, smallPrize: 0 });
    expect(result.prizes[1]).toMatchObject({ label: '2nd Prize',   bigPrize: 1000, smallPrize: 0 });
    expect(result.prizes[2]).toMatchObject({ label: '3rd Prize',   bigPrize:  500, smallPrize: 0 });
    expect(result.prizes[3]).toMatchObject({ label: 'Special',     bigPrize:  180, smallPrize: 0 });
    expect(result.prizes[4]).toMatchObject({ label: 'Consolation', bigPrize:   60, smallPrize: 0 });

    expect(result.bigTotal).toBe(2500 + 1000 + 500 + 180 + 60);
    expect(result.smallTotal).toBe(0);
  });

  test('RM0 Big, RM1 Small', () => {
    const result = calculateStraight(0, 1);

    expect(result.prizes[0]).toMatchObject({ bigPrize: 0, smallPrize: 3500 });
    expect(result.prizes[1]).toMatchObject({ bigPrize: 0, smallPrize: 2000 });
    expect(result.prizes[2]).toMatchObject({ bigPrize: 0, smallPrize: 1000 });
    // Special and Consolation have small = 0
    expect(result.prizes[3]).toMatchObject({ bigPrize: 0, smallPrize: 0 });
    expect(result.prizes[4]).toMatchObject({ bigPrize: 0, smallPrize: 0 });

    expect(result.bigTotal).toBe(0);
    expect(result.smallTotal).toBe(3500 + 2000 + 1000);
  });

  test('RM1 Big, RM1 Small', () => {
    const result = calculateStraight(1, 1);

    expect(result.bigTotal).toBe(4240);
    expect(result.smallTotal).toBe(6500);
  });

  test('RM5 Big, RM3 Small — amounts multiply correctly', () => {
    const result = calculateStraight(5, 3);

    expect(result.prizes[0]).toMatchObject({ bigPrize: 12500, smallPrize: 10500 });
    expect(result.prizes[1]).toMatchObject({ bigPrize:  5000, smallPrize:  6000 });
    expect(result.prizes[2]).toMatchObject({ bigPrize:  2500, smallPrize:  3000 });
    expect(result.prizes[3]).toMatchObject({ bigPrize:   900, smallPrize:     0 });
    expect(result.prizes[4]).toMatchObject({ bigPrize:   300, smallPrize:     0 });

    expect(result.bigTotal).toBe(21200);
    expect(result.smallTotal).toBe(19500);
  });

  test('RM0 Big, RM0 Small — all zeros', () => {
    const result = calculateStraight(0, 0);
    expect(result.bigTotal).toBe(0);
    expect(result.smallTotal).toBe(0);
    result.prizes.forEach((p) => {
      expect(p.bigPrize).toBe(0);
      expect(p.smallPrize).toBe(0);
    });
  });
});

// ===========================================================================
// calculateIBox
// ===========================================================================
describe('calculateIBox', () => {
  test('24 perms (1234), RM1 Big, RM1 Small', () => {
    const result = calculateIBox(1, 1, 24);

    expect(result.prizes[0]).toMatchObject({ label: '1st Prize',   bigPrize: 105, smallPrize: 146 });
    expect(result.prizes[1]).toMatchObject({ label: '2nd Prize',   bigPrize:  42, smallPrize:  84 });
    expect(result.prizes[2]).toMatchObject({ label: '3rd Prize',   bigPrize:  21, smallPrize:  42 });
    expect(result.prizes[3]).toMatchObject({ label: 'Special',     bigPrize:   8, smallPrize:   0 });
    expect(result.prizes[4]).toMatchObject({ label: 'Consolation', bigPrize:   3, smallPrize:   0 });

    expect(result.bigTotal).toBe(105 + 42 + 21 + 8 + 3);
    expect(result.smallTotal).toBe(146 + 84 + 42);
  });

  test('12 perms (1123), RM1 Big, RM0 Small', () => {
    const result = calculateIBox(1, 0, 12);

    expect(result.prizes[0]).toMatchObject({ bigPrize: 209, smallPrize: 0 });
    expect(result.prizes[1]).toMatchObject({ bigPrize:  84, smallPrize: 0 });
    expect(result.prizes[2]).toMatchObject({ bigPrize:  42, smallPrize: 0 });
    expect(result.prizes[3]).toMatchObject({ bigPrize:  15, smallPrize: 0 });
    expect(result.prizes[4]).toMatchObject({ bigPrize:   5, smallPrize: 0 });

    expect(result.bigTotal).toBe(209 + 84 + 42 + 15 + 5);
  });

  test('6 perms (1122), RM2 Big, RM2 Small', () => {
    const result = calculateIBox(2, 2, 6);

    expect(result.prizes[0]).toMatchObject({ bigPrize: 834, smallPrize: 1168 });
    expect(result.prizes[1]).toMatchObject({ bigPrize: 334, smallPrize:  668 });
    expect(result.prizes[2]).toMatchObject({ bigPrize: 168, smallPrize:  334 });
    expect(result.prizes[3]).toMatchObject({ bigPrize:  60, smallPrize:    0 });
    expect(result.prizes[4]).toMatchObject({ bigPrize:  20, smallPrize:    0 });
  });

  test('4 perms (1112), RM1 Big, RM1 Small', () => {
    const result = calculateIBox(1, 1, 4);

    expect(result.prizes[0]).toMatchObject({ bigPrize: 625, smallPrize: 875 });
    expect(result.prizes[1]).toMatchObject({ bigPrize: 250, smallPrize: 500 });
    expect(result.prizes[2]).toMatchObject({ bigPrize: 125, smallPrize: 250 });
    expect(result.prizes[3]).toMatchObject({ bigPrize:  45, smallPrize:   0 });
    expect(result.prizes[4]).toMatchObject({ bigPrize:  15, smallPrize:   0 });

    expect(result.bigTotal).toBe(625 + 250 + 125 + 45 + 15);
    expect(result.smallTotal).toBe(875 + 500 + 250);
  });

  test('amount multiplier works', () => {
    const result = calculateIBox(5, 0, 24);
    // 1st prize big at 24 perms = 105 per RM1 → 525 for RM5
    expect(result.prizes[0].bigPrize).toBe(525);
  });
});

// ===========================================================================
// calculateBox
// ===========================================================================
describe('calculateBox', () => {
  test('prizes are identical to Straight (you paid for all perms)', () => {
    const straight = calculateStraight(1, 1);
    const box = calculateBox(1, 1, 24);

    expect(box.prizes).toEqual(straight.prizes);
    expect(box.bigTotal).toBe(straight.bigTotal);
    expect(box.smallTotal).toBe(straight.smallTotal);
  });

  test('RM3 Big, RM2 Small with 12 perms', () => {
    const box = calculateBox(3, 2, 12);
    // Same as straight RM3/RM2
    expect(box.prizes[0]).toMatchObject({ bigPrize: 7500, smallPrize: 7000 });
  });
});

// ===========================================================================
// calculateTotalCost
// ===========================================================================
describe('calculateTotalCost', () => {
  test('Straight: cost = big + small', () => {
    expect(calculateTotalCost('straight', 2, 3, 24)).toBe(5);
  });

  test('iBox: cost = big + small', () => {
    expect(calculateTotalCost('ibox', 2, 3, 12)).toBe(5);
  });

  test('Box 24 perms: cost = (big + small) × 24', () => {
    expect(calculateTotalCost('box', 1, 1, 24)).toBe(48);
  });

  test('Box 12 perms: cost = (big + small) × 12', () => {
    expect(calculateTotalCost('box', 2, 3, 12)).toBe(60);
  });

  test('Box 6 perms: cost = (big + small) × 6', () => {
    expect(calculateTotalCost('box', 1, 0, 6)).toBe(6);
  });

  test('Box 4 perms: cost = (big + small) × 4', () => {
    expect(calculateTotalCost('box', 5, 5, 4)).toBe(40);
  });

  test('Box 1 perm (all same): cost = big + small', () => {
    expect(calculateTotalCost('box', 1, 1, 1)).toBe(2);
  });

  test('zero amounts', () => {
    expect(calculateTotalCost('straight', 0, 0, 24)).toBe(0);
    expect(calculateTotalCost('box', 0, 0, 24)).toBe(0);
  });
});

// ===========================================================================
// getCombinedTotals
// ===========================================================================
describe('getCombinedTotals', () => {
  test('sums Big and Small into combined', () => {
    const totals = getCombinedTotals(4240, 6500);
    expect(totals.bigTotal).toBe(4240);
    expect(totals.smallTotal).toBe(6500);
    expect(totals.combinedTotal).toBe(10740);
  });

  test('Big only', () => {
    const totals = getCombinedTotals(4240, 0);
    expect(totals.combinedTotal).toBe(4240);
  });

  test('Small only', () => {
    const totals = getCombinedTotals(0, 6500);
    expect(totals.combinedTotal).toBe(6500);
  });

  test('both zero', () => {
    const totals = getCombinedTotals(0, 0);
    expect(totals.combinedTotal).toBe(0);
  });
});

// ===========================================================================
// formatRM
// ===========================================================================
describe('formatRM', () => {
  test('zero returns dash', () => {
    expect(formatRM(0)).toBe('-');
  });

  test('whole number has no decimals', () => {
    const result = formatRM(2500);
    expect(result).toMatch(/^RM/);
    expect(result).toContain('2');
    expect(result).toContain('500');
  });

  test('fractional number has 2 decimal places', () => {
    const result = formatRM(104.17);
    expect(result).toMatch(/^RM/);
    expect(result).toContain('104');
    expect(result).toContain('17');
  });
});

// ===========================================================================
// Edge-case numbers: full integration
// ===========================================================================
describe('edge-case numbers', () => {
  test('0000 — all same, 1 perm', () => {
    expect(getPermutationCount('0000')).toBe(1);
    // iBox not applicable for 1-perm numbers
    // Straight still works
    const straight = calculateStraight(1, 1);
    expect(straight.bigTotal).toBe(4240);
    expect(straight.smallTotal).toBe(6500);
    // Box with 1 perm = same cost as straight
    expect(calculateTotalCost('box', 1, 1, 1)).toBe(2);
  });

  test('1111 — all same, 1 perm', () => {
    expect(getPermutationCount('1111')).toBe(1);
  });

  test('1234 — all different, 24 perms', () => {
    const perms = getPermutationCount('1234');
    expect(perms).toBe(24);

    const ibox = calculateIBox(1, 1, 24);
    expect(ibox.prizes[0].bigPrize).toBe(105);
    expect(ibox.prizes[0].smallPrize).toBe(146);

    expect(calculateTotalCost('ibox', 1, 1, 24)).toBe(2);
    expect(calculateTotalCost('box', 1, 1, 24)).toBe(48);
  });

  test('1122 — two pairs, 6 perms', () => {
    const perms = getPermutationCount('1122');
    expect(perms).toBe(6);

    const ibox = calculateIBox(1, 1, 6);
    expect(ibox.prizes[0].bigPrize).toBe(417);
    expect(ibox.prizes[0].smallPrize).toBe(584);

    expect(calculateTotalCost('box', 1, 1, 6)).toBe(12);
  });

  test('1123 — one pair, 12 perms', () => {
    expect(getPermutationCount('1123')).toBe(12);
  });

  test('1112 — three same, 4 perms', () => {
    expect(getPermutationCount('1112')).toBe(4);

    const ibox = calculateIBox(1, 0, 4);
    expect(ibox.prizes[0].bigPrize).toBe(625);
    expect(ibox.bigTotal).toBe(625 + 250 + 125 + 45 + 15);
  });
});
