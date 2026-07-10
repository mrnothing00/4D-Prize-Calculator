import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useTranslation } from '@/i18n/LanguageContext';
import { getPermutationCount } from '@/utils/calculator';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PERM_DESC_KEYS = {
  24: 'permAllDifferent',
  12: 'permOnePair',
  6: 'permTwoPairs',
  4: 'permThreeSame',
  1: 'permAllSame',
} as const;

const PAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'Del'],
];

export default function NumberInput({ value, onChange }: NumberInputProps) {
  const { t } = useTranslation();
  const digits = value.padEnd(4, ' ').split('');
  const isFull = value.length === 4;
  const permCount = isFull ? getPermutationCount(value) : null;

  const handleKey = (key: string) => {
    if (key === 'C') {
      onChange('');
    } else if (key === 'Del') {
      onChange(value.slice(0, -1));
    } else if (value.length < 4) {
      onChange(value + key);
    }
  };

  const getKeyLabel = (key: string) => {
    if (key === 'C') return t('padClear');
    if (key === 'Del') return t('padDelete');
    return `${t('padDigit')} ${key}`;
  };

  return (
    <View style={styles.container} accessibilityRole="none">
      {/* Digit boxes */}
      <View style={styles.digitRow} accessibilityLabel={`${value || ''}`}>
        {digits.map((d, i) => {
          const filled = i < value.length;
          const active = i === value.length && !isFull;
          return (
            <View
              key={i}
              style={[
                styles.digitBox,
                active && styles.digitBoxActive,
                filled && styles.digitBoxFilled,
              ]}
            >
              <Text style={[styles.digitText, filled && styles.digitTextFilled]}>
                {filled ? d : ''}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Permutation info */}
      <View style={styles.permRow}>
        {permCount !== null ? (
          <Text style={styles.permText}>
            {permCount} {permCount !== 1 ? t('permutations') : t('permutation')}
            {'  \u2022  '}
            {t(PERM_DESC_KEYS[permCount as keyof typeof PERM_DESC_KEYS])}
          </Text>
        ) : (
          <Text style={styles.permPlaceholder}>{t('enterNumber')}</Text>
        )}
      </View>

      {/* Number pad */}
      <View style={styles.pad}>
        {PAD_KEYS.map((row, ri) => (
          <View key={ri} style={styles.padRow}>
            {row.map((key) => {
              const isAction = key === 'C' || key === 'Del';
              return (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.padKey,
                    isAction && styles.padKeyAction,
                    pressed && styles.padKeyPressed,
                  ]}
                  onPress={() => handleKey(key)}
                  accessibilityRole="button"
                  accessibilityLabel={getKeyLabel(key)}
                >
                  <Text style={[styles.padKeyText, isAction && styles.padKeyActionText]}>
                    {key === 'C' ? t('padClear') : key === 'Del' ? t('padDelete') : key}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
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
    padding: 12,
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  digitBox: {
    flex: 1,
    maxWidth: 60,
    aspectRatio: 0.85,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF8',
  },
  digitBoxActive: {
    borderColor: '#1a1a1a',
    borderWidth: 2,
  },
  digitBoxFilled: {
    borderColor: '#1a1a1a',
    backgroundColor: '#FFFFFF',
  },
  digitText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#D1D5DB',
  },
  digitTextFilled: {
    color: '#1a1a1a',
  },
  permRow: {
    alignItems: 'center',
    minHeight: 28,
    justifyContent: 'center',
    marginBottom: 12,
  },
  permText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4B5563',
  },
  permPlaceholder: {
    fontSize: 17,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  pad: {
    gap: 8,
  },
  padRow: {
    flexDirection: 'row',
    gap: 8,
  },
  padKey: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 12,
    backgroundColor: '#F5F5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  padKeyAction: {
    backgroundColor: '#EEEDEA',
  },
  padKeyPressed: {
    backgroundColor: '#E0DFDC',
  },
  padKeyText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  padKeyActionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4B5563',
  },
});
