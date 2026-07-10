import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTranslation } from '@/i18n/LanguageContext';
import type { BetType, PrizeBreakdown } from '@/utils/calculator';
import { formatRM } from '@/utils/calculator';

interface ResultsDisplayProps {
  number: string;
  betType: BetType;
  bigAmount: number;
  smallAmount: number;
  bigResults: PrizeBreakdown | null;
  smallResults: PrizeBreakdown | null;
  totalCost: number;
}

interface TableRow {
  label: string;
  amount: number;
  note?: string;
}

function PrizeTable({
  title,
  accentColor,
  rows,
  prizeHeader,
  youWinHeader,
}: {
  title: string;
  accentColor: string;
  rows: TableRow[];
  prizeHeader: string;
  youWinHeader: string;
}) {
  return (
    <View style={styles.tableCard} accessibilityRole="summary">
      {/* Title */}
      <View style={[styles.tableTitle, { borderLeftColor: accentColor }]}>
        <Text style={styles.tableTitleText}>{title}</Text>
      </View>

      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cellLabel, styles.headerText]}>{prizeHeader}</Text>
        <Text style={[styles.cellValue, styles.headerTextGreen]}>{youWinHeader}</Text>
      </View>

      {/* Rows */}
      {rows.map((r, i) => (
        <View
          key={r.label}
          style={[styles.row, i % 2 === 0 && styles.rowAlt]}
          accessibilityLabel={`${r.label}: ${r.amount > 0 ? `RM ${r.amount}` : 'none'}${r.note ? ` (${r.note})` : ''}`}
        >
          <View style={styles.cellLabelCol}>
            <Text style={styles.cellLabel}>{r.label}</Text>
            {r.note && <Text style={styles.cellNote}>{r.note}</Text>}
          </View>
          <Text style={styles.cellValueGreen}>{formatRM(r.amount)}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ResultsDisplay({
  number,
  betType,
  bigAmount,
  smallAmount,
  bigResults,
  smallResults,
  totalCost,
}: ResultsDisplayProps) {
  const { t } = useTranslation();
  const hasBig = bigAmount > 0 && bigResults;
  const hasSmall = smallAmount > 0 && smallResults;
  const hasBoth = hasBig && hasSmall;

  if (!hasBig && !hasSmall) return null;

  const prizeLabels = [
    t('prize1st'),
    t('prize2nd'),
    t('prize3rd'),
    t('prizeSpecial'),
    t('prizeConsolation'),
  ];

  // Build Big table rows
  const bigRows: TableRow[] = hasBig
    ? bigResults.prizes.map((p, i) => ({ label: prizeLabels[i] ?? p.label, amount: p.bigPrize }))
    : [];

  // Build Small table rows
  const smallRows: TableRow[] = hasSmall
    ? smallResults.prizes
        .filter((p) => p.smallPrize > 0)
        .map((p, i) => ({ label: prizeLabels[i] ?? p.label, amount: p.smallPrize }))
    : [];

  // Build Combined table rows
  const combinedRows: TableRow[] = [];
  if (hasBoth) {
    // 1st, 2nd, 3rd have both Big + Small
    for (let i = 0; i < 3; i++) {
      const bp = bigResults.prizes[i];
      const sp = smallResults.prizes[i];
      combinedRows.push({
        label: prizeLabels[i],
        amount: bp.bigPrize + sp.smallPrize,
      });
    }
    // Special and Consolation are Big only
    for (let i = 3; i < bigResults.prizes.length; i++) {
      const bp = bigResults.prizes[i];
      if (bp.bigPrize > 0) {
        combinedRows.push({
          label: prizeLabels[i] ?? bp.label,
          amount: bp.bigPrize,
          note: t('bigOnly'),
        });
      }
    }
  }

  // Prize totals for highlight bars
  const getPrizeTotal = (index: number) => {
    const big = hasBig ? bigResults.prizes[index].bigPrize : 0;
    const small = hasSmall ? smallResults.prizes[index].smallPrize : 0;
    return big + small;
  };

  const top1stPrize = getPrizeTotal(0);
  const top2ndPrize = getPrizeTotal(1);
  const top3rdPrize = getPrizeTotal(2);
  // Special and Consolation are Big-only (indices 3 and 4)
  const specialPrize = hasBig ? bigResults.prizes[3]?.bigPrize ?? 0 : 0;
  const consolationPrize = hasBig ? bigResults.prizes[4]?.bigPrize ?? 0 : 0;

  const betLabel = betType === 'straight' ? t('straight') : betType === 'ibox' ? t('ibox') : t('box');

  return (
    <View style={styles.container}>
      {/* Cost summary */}
      <View style={styles.costBar}>
        <Text style={styles.costLabel}>
          {t('totalCost')} ({betLabel})
        </Text>
        <Text style={styles.costValue}>{formatRM(totalCost)}</Text>
      </View>

      {/* Big table */}
      {hasBig && (
        <PrizeTable
          title={`${t('bigDash')} \u2014 RM${bigAmount}`}
          accentColor="#2563EB"
          rows={bigRows}
          prizeHeader={t('prize')}
          youWinHeader={t('youWin')}
        />
      )}

      {/* Small table */}
      {hasSmall && (
        <PrizeTable
          title={`${t('smallDash')} \u2014 RM${smallAmount}`}
          accentColor="#DC2626"
          rows={smallRows}
          prizeHeader={t('prize')}
          youWinHeader={t('youWin')}
        />
      )}

      {/* Combined table */}
      {hasBoth && (
        <PrizeTable
          title={t('combinedTotal')}
          accentColor="#2E7D32"
          rows={combinedRows}
          prizeHeader={t('prize')}
          youWinHeader={t('youWin')}
        />
      )}

      {/* Highlighted 1st prize bar */}
      <View
        style={styles.highlightBar}
        accessibilityLabel={`${t('ifYouWin1st')}: ${formatRM(top1stPrize)}`}
      >
        <Text style={styles.highlightLabel}>{t('ifYouWin1st')}</Text>
        <Text style={styles.highlightValue}>{formatRM(top1stPrize)}</Text>
      </View>

      {/* Highlighted 2nd prize bar */}
      <View
        style={styles.highlightBar2nd}
        accessibilityLabel={`${t('ifYouWin2nd')}: ${formatRM(top2ndPrize)}`}
      >
        <Text style={styles.highlightLabel2nd}>{t('ifYouWin2nd')}</Text>
        <Text style={styles.highlightValue2nd}>{formatRM(top2ndPrize)}</Text>
      </View>

      {/* Highlighted 3rd prize bar */}
      <View
        style={styles.highlightBar3rd}
        accessibilityLabel={`${t('ifYouWin3rd')}: ${formatRM(top3rdPrize)}`}
      >
        <Text style={styles.highlightLabel3rd}>{t('ifYouWin3rd')}</Text>
        <Text style={styles.highlightValue3rd}>{formatRM(top3rdPrize)}</Text>
      </View>

      {/* Special prize bar (Big only) */}
      {specialPrize > 0 && (
        <View
          style={styles.highlightBarMinor}
          accessibilityLabel={`${t('ifYouWinSpecial')}: ${formatRM(specialPrize)}`}
        >
          <Text style={styles.highlightLabelMinor}>{t('ifYouWinSpecial')}</Text>
          <Text style={styles.highlightValueMinor}>{formatRM(specialPrize)}</Text>
        </View>
      )}

      {/* Consolation prize bar (Big only) */}
      {consolationPrize > 0 && (
        <View
          style={styles.highlightBarMinor}
          accessibilityLabel={`${t('ifYouWinConsolation')}: ${formatRM(consolationPrize)}`}
        >
          <Text style={styles.highlightLabelMinor}>{t('ifYouWinConsolation')}</Text>
          <Text style={styles.highlightValueMinor}>{formatRM(consolationPrize)}</Text>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  // Cost bar
  costBar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  costLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    flexShrink: 1,
  },
  costValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    flexShrink: 0,
  },

  // Table card
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableTitle: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E0',
  },
  tableTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Table rows
  headerRow: {
    backgroundColor: '#F5F5F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E0',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowAlt: {
    backgroundColor: '#FAFAF8',
  },
  cellLabelCol: {
    flex: 1,
  },
  cellLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cellNote: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 1,
  },
  cellValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  headerTextGreen: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cellValueGreen: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'right',
  },

  // Highlight bar — 1st prize
  highlightBar: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  highlightLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  highlightValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    flexShrink: 0,
  },

  // Highlight bar — 2nd prize
  highlightBar2nd: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  highlightLabel2nd: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    flexShrink: 1,
  },
  highlightValue2nd: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E7D32',
    flexShrink: 0,
  },

  // Highlight bar — 3rd prize
  highlightBar3rd: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  highlightLabel3rd: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B5563',
    flexShrink: 1,
  },
  highlightValue3rd: {
    fontSize: 30,
    fontWeight: '800',
    color: '#4B5563',
    flexShrink: 0,
  },

  // Highlight bar — Special / Consolation
  highlightBarMinor: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  highlightLabelMinor: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    flexShrink: 1,
  },
  highlightValueMinor: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6B7280',
    flexShrink: 0,
  },

  // Disclaimer
  disclaimer: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
