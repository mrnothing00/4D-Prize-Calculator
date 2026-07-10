import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

interface AmountInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accentColor: string;
}

const PRESETS = [1, 2, 5, 10, 20];

export default function AmountInput({
  label,
  value,
  onChange,
  accentColor,
}: AmountInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const decrement = () => {
    const next = value - 1;
    onChange(next < 0 ? 0 : next);
  };

  const increment = () => {
    onChange(value + 1);
  };

  const handleStartEdit = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const handleEndEdit = () => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Label with colored left border */}
      <View style={[styles.labelRow, { borderLeftColor: accentColor }]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      {/* Plus / Minus stepper */}
      <View style={styles.stepperRow}>
        <Pressable
          style={({ pressed }) => [styles.stepperBtn, pressed && styles.stepperBtnPressed]}
          onPress={decrement}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label} amount`}
        >
          <Text style={styles.stepperBtnText}>{'\u2212'}</Text>
        </Pressable>

        <Pressable
          style={styles.valueBox}
          onPress={handleStartEdit}
          accessibilityLabel={`${label} amount: RM ${value}. Tap to edit.`}
          accessibilityRole="button"
        >
          {editing ? (
            <TextInput
              style={styles.valueInput}
              value={draft}
              onChangeText={setDraft}
              onBlur={handleEndEdit}
              onSubmitEditing={handleEndEdit}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <Text style={styles.valueText}>RM {value}</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.stepperBtn, pressed && styles.stepperBtnPressed]}
          onPress={increment}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label} amount`}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>

      {/* Preset buttons */}
      <View style={styles.presetRow}>
        {PRESETS.map((amount) => {
          const active = value === amount;
          return (
            <Pressable
              key={amount}
              style={[
                styles.presetBtn,
                active && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => onChange(amount)}
              accessibilityRole="button"
              accessibilityLabel={`Set ${label} to RM ${amount}`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.presetText, active && styles.presetTextActive]}>
                {amount}
              </Text>
            </Pressable>
          );
        })}
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

  // Label
  labelRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#000',
    paddingLeft: 10,
  },
  labelText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#F5F5F0',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnPressed: {
    backgroundColor: '#E0DFDC',
  },
  stepperBtnText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  valueBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#FAFAF8',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  valueInput: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    padding: 0,
    width: '100%',
    height: '100%',
  },

  // Presets
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    minWidth: 48,
    minHeight: 48,
    flex: 1,
    backgroundColor: '#F5F5F0',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  presetText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
});
