import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/i18n/LanguageContext';
import type { HistoryEntry } from '@/utils/history';
import type { BetType } from '@/utils/calculator';

interface Props {
  visible: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) return time;

  const day = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${day}, ${time}`;
}

export default function HistoryBottomSheet({
  visible,
  history,
  onClose,
  onSelect,
  onClear,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const betTypeLabel = (bt: BetType): string => {
    switch (bt) {
      case 'straight':
        return t('straight');
      case 'ibox':
        return t('ibox');
      case 'box':
        return t('box');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFF00" />

        {/* Header bar */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text style={styles.backBtnText}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('history')}</Text>
          <View style={styles.headerRight}>
            {history.length > 0 && (
              <Pressable
                style={styles.clearBtn}
                onPress={onClear}
                accessibilityRole="button"
                accessibilityLabel={t('clearAll')}
              >
                <Text style={styles.clearBtnText}>{t('historyClearAll')}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* List */}
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noCalculationsYet')}</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {history.map((entry) => (
              <Pressable
                key={entry.id}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed,
                ]}
                onPress={() => onSelect(entry)}
                accessibilityRole="button"
                accessibilityLabel={`Load ${entry.number} ${betTypeLabel(entry.betType)}`}
              >
                <View style={styles.itemRow}>
                  <Text style={styles.itemNumber}>{entry.number}</Text>
                  <Text style={styles.itemTime}>{formatTime(entry.timestamp)}</Text>
                </View>
                <Text style={styles.itemDetails}>
                  {betTypeLabel(entry.betType)}
                  {entry.bigAmount > 0 ? `  \u00B7  ${t('historyBig')}: RM${entry.bigAmount}` : ''}
                  {entry.smallAmount > 0 ? `  \u00B7  ${t('historySmall')}: RM${entry.smallAmount}` : ''}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF00',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E0',
    backgroundColor: '#FFFF00',
  },
  backBtn: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E0',
  },
  backBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 48,
    alignItems: 'flex-end',
  },
  clearBtn: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  itemPressed: {
    backgroundColor: '#F5F5F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
    ...Platform.select({
      android: { fontFamily: 'monospace' },
    }),
  },
  itemDetails: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 6,
  },
  itemTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
