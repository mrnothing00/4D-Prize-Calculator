import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useTranslation } from '@/i18n/LanguageContext';
import type { TranslationKey } from '@/i18n/translations';
import type { BetType } from '@/utils/calculator';

interface BetTypeSelectorProps {
  value: BetType;
  onChange: (value: BetType) => void;
  permutationCount: number | null;
  singlePerm?: boolean;
}

interface BetOption {
  key: BetType;
  labelKey: TranslationKey;
  subtitleKey: TranslationKey;
}

const BET_OPTIONS: BetOption[] = [
  { key: 'straight', labelKey: 'straight', subtitleKey: 'straightSub' },
  { key: 'ibox', labelKey: 'ibox', subtitleKey: 'iboxSub' },
  { key: 'box', labelKey: 'box', subtitleKey: 'boxSub' },
];

export default function BetTypeSelector({
  value,
  onChange,
  permutationCount,
  singlePerm = false,
}: BetTypeSelectorProps) {
  const { t } = useTranslation();

  const getExplanation = (betType: BetType, permCount: number | null): string => {
    switch (betType) {
      case 'straight':
        return t('explainStraight');
      case 'ibox':
        if (permCount === null) return t('explainIboxDefault');
        if (permCount === 1) return t('explainIboxNA');
        return t('explainIbox', { n: permCount });
      case 'box':
        if (permCount === null) return t('explainBoxDefault');
        if (permCount === 1) return t('explainBox1Perm');
        return t('explainBox', { n: permCount });
    }
  };

  return (
    <View style={styles.container}>
      {/* Toggle buttons */}
      <View style={styles.toggleRow} accessibilityRole="radiogroup">
        {BET_OPTIONS.map((option) => {
          const active = value === option.key;
          const disabled = (option.key === 'ibox' || option.key === 'box') && singlePerm;
          const label = t(option.labelKey);
          const subtitle = t(option.subtitleKey);
          return (
            <Pressable
              key={option.key}
              style={[
                styles.toggleBtn,
                active && styles.toggleBtnActive,
                disabled && styles.toggleBtnDisabled,
              ]}
              onPress={() => !disabled && onChange(option.key)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, disabled }}
              accessibilityLabel={`${label}: ${subtitle}`}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  active && styles.toggleLabelActive,
                  disabled && styles.toggleLabelDisabled,
                ]}
              >
                {label}
              </Text>
              <Text
                style={[
                  styles.toggleSubtitle,
                  active && styles.toggleSubtitleActive,
                  disabled && styles.toggleSubtitleDisabled,
                ]}
              >
                {subtitle}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* iBox/Box disabled note */}
      {singlePerm && (
        <View style={styles.disabledNote}>
          <Text style={styles.disabledNoteText}>{t('iboxBoxDisabledNote')}</Text>
        </View>
      )}

      {/* Explanation */}
      <View style={styles.explanationBox}>
        <Text style={styles.explanationText}>
          {getExplanation(value, permutationCount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    minHeight: 56,
    backgroundColor: '#F5F5F0',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  toggleBtnDisabled: {
    backgroundColor: '#F0F0ED',
    borderColor: '#E5E5E0',
    opacity: 0.5,
  },
  toggleLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  toggleLabelActive: {
    color: '#FFFFFF',
  },
  toggleLabelDisabled: {
    color: '#9CA3AF',
  },
  toggleSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  toggleSubtitleActive: {
    color: '#D1D5DB',
  },
  toggleSubtitleDisabled: {
    color: '#9CA3AF',
  },
  disabledNote: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabledNoteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  explanationBox: {
    backgroundColor: '#F5F5F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  explanationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 24,
  },
});
