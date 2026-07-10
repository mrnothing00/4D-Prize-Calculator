import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import NumberInput from '@/components/NumberInput';
import BetTypeSelector from '@/components/BetTypeSelector';
import AmountInput from '@/components/AmountInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import HistoryBottomSheet from '@/components/HistoryBottomSheet';
import AdBanner from '@/components/AdBanner';

import { useTranslation } from '@/i18n/LanguageContext';
import type { PermCount } from '@/data/prizes';
import {
  type BetType,
  type PrizeBreakdown,
  getPermutationCount,
  calculateStraight,
  calculateIBox,
  calculateBox,
  calculateTotalCost,
  formatRM,
} from '@/utils/calculator';
import {
  type HistoryEntry,
  loadHistory,
  addHistoryEntry,
  clearHistory,
} from '@/utils/history';

export default function CalculatorScreen() {
  const { language, setLanguage, t } = useTranslation();

  // Input state
  const [number, setNumber] = useState('');
  const [betType, setBetType] = useState<BetType>('straight');
  const [bigAmount, setBigAmount] = useState(1);
  const [smallAmount, setSmallAmount] = useState(1);

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // About modal state
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  // Android back button exit confirmation
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      Alert.alert(
        t('exitAppTitle'),
        t('exitAppMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('exitApp'), style: 'destructive', onPress: () => BackHandler.exitApp() },
        ],
      );
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [t]);

  // Results state (shown only after pressing Calculate)
  const [showResults, setShowResults] = useState(false);
  const [resultSnapshot, setResultSnapshot] = useState<{
    number: string;
    betType: BetType;
    bigAmount: number;
    smallAmount: number;
    bigResults: PrizeBreakdown | null;
    smallResults: PrizeBreakdown | null;
    totalCost: number;
  } | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const resultsY = useRef(0);

  // Derived
  const isValidNumber = number.length === 4;
  const permCount = isValidNumber ? getPermutationCount(number) : null;
  const hasAmount = bigAmount > 0 || smallAmount > 0;
  const canCalculate = isValidNumber && hasAmount;

  // iBox and Box not applicable for 1-perm numbers (all same digits)
  const singlePerm = permCount === 1;
  const iboxDisabled = betType === 'ibox' && singlePerm;
  const boxDisabled = betType === 'box' && singlePerm;

  // Auto-switch to Straight when all digits are the same
  useEffect(() => {
    if (singlePerm && (betType === 'ibox' || betType === 'box')) {
      setBetType('straight');
    }
  }, [singlePerm, betType]);

  // Live cost preview
  const liveCost =
    canCalculate && !iboxDisabled && !boxDisabled
      ? calculateTotalCost(betType, bigAmount, smallAmount, permCount!)
      : null;

  // Clear results when any input changes
  const handleNumberChange = useCallback((v: string) => {
    setNumber(v);
    setShowResults(false);
  }, []);

  const handleBetTypeChange = useCallback((v: BetType) => {
    setBetType(v);
    setShowResults(false);
  }, []);

  const handleBigChange = useCallback((v: number) => {
    setBigAmount(v);
    setShowResults(false);
  }, []);

  const handleSmallChange = useCallback((v: number) => {
    setSmallAmount(v);
    setShowResults(false);
  }, []);

  // Clear all
  const handleClearAll = () => {
    setNumber('');
    setBetType('straight');
    setBigAmount(1);
    setSmallAmount(1);
    setShowResults(false);
    setResultSnapshot(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Calculate
  const handleCalculate = () => {
    if (!canCalculate || iboxDisabled || boxDisabled) return;

    const pc = permCount as PermCount;
    let bigResults: PrizeBreakdown | null = null;
    let smallResults: PrizeBreakdown | null = null;

    if (bigAmount > 0) {
      switch (betType) {
        case 'straight':
          bigResults = calculateStraight(bigAmount, 0);
          break;
        case 'ibox':
          bigResults = calculateIBox(bigAmount, 0, pc);
          break;
        case 'box':
          bigResults = calculateBox(bigAmount, 0, pc);
          break;
      }
    }

    if (smallAmount > 0) {
      switch (betType) {
        case 'straight':
          smallResults = calculateStraight(0, smallAmount);
          break;
        case 'ibox':
          smallResults = calculateIBox(0, smallAmount, pc);
          break;
        case 'box':
          smallResults = calculateBox(0, smallAmount, pc);
          break;
      }
    }

    const totalCost = calculateTotalCost(betType, bigAmount, smallAmount, permCount!);

    setResultSnapshot({
      number,
      betType,
      bigAmount,
      smallAmount,
      bigResults,
      smallResults,
      totalCost,
    });
    setShowResults(true);

    // Save to history
    addHistoryEntry({ number, betType, bigAmount, smallAmount }).then(setHistory);

    // Auto-scroll to results after render
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: resultsY.current, animated: true });
    }, 100);
  };

  // History handlers
  const handleHistorySelect = (entry: HistoryEntry) => {
    setNumber(entry.number);
    setBetType(entry.betType);
    setBigAmount(entry.bigAmount);
    setSmallAmount(entry.smallAmount);
    setShowHistory(false);

    // Calculate results directly from entry values
    const pc = getPermutationCount(entry.number) as PermCount;
    let bigRes: PrizeBreakdown | null = null;
    let smallRes: PrizeBreakdown | null = null;

    if (entry.bigAmount > 0) {
      switch (entry.betType) {
        case 'straight': bigRes = calculateStraight(entry.bigAmount, 0); break;
        case 'ibox': bigRes = calculateIBox(entry.bigAmount, 0, pc); break;
        case 'box': bigRes = calculateBox(entry.bigAmount, 0, pc); break;
      }
    }
    if (entry.smallAmount > 0) {
      switch (entry.betType) {
        case 'straight': smallRes = calculateStraight(0, entry.smallAmount); break;
        case 'ibox': smallRes = calculateIBox(0, entry.smallAmount, pc); break;
        case 'box': smallRes = calculateBox(0, entry.smallAmount, pc); break;
      }
    }

    const cost = calculateTotalCost(entry.betType, entry.bigAmount, entry.smallAmount, pc);

    setResultSnapshot({
      number: entry.number,
      betType: entry.betType,
      bigAmount: entry.bigAmount,
      smallAmount: entry.smallAmount,
      bigResults: bigRes,
      smallResults: smallRes,
      totalCost: cost,
    });
    setShowResults(true);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: resultsY.current, animated: true });
    }, 100);
  };

  const handleClearHistory = () => {
    Alert.alert(t('clearHistoryTitle'), t('clearHistoryMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('clear'),
        style: 'destructive',
        onPress: () => {
          clearHistory().then(() => setHistory([]));
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Pressable
                  style={styles.historyBtn}
                  onPress={() => setShowHistory(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t('history')}
                >
                  <Text style={styles.historyBtnText}>{t('history')}</Text>
                </Pressable>
                <Pressable
                  style={styles.infoBtn}
                  onPress={() => setShowAbout(true)}
                  accessibilityRole="button"
                  accessibilityLabel="About"
                >
                  <Text style={styles.infoBtnText}>i</Text>
                </Pressable>
              </View>
              <Text style={styles.titleLine2_4D}>4D</Text>
              <Text style={styles.titleLine2_rest}>
                {language === 'zh' ? '万字奖金计算器' : 'Prize Calculator'}
              </Text>
              <Text style={styles.subtitle}>{t('appSubtitle')}</Text>
              {/* Language toggle */}
              <View style={styles.langToggle}>
                <Pressable
                  style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                  onPress={() => setLanguage('en')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: language === 'en' }}
                >
                  <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>
                    {t('langEN')}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.langBtn, language === 'zh' && styles.langBtnActive]}
                  onPress={() => setLanguage('zh')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: language === 'zh' }}
                >
                  <Text style={[styles.langBtnText, language === 'zh' && styles.langBtnTextActive]}>
                    {t('langZH')}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Section: Number */}
            <Text style={styles.sectionLabel}>{t('sectionNumber')}</Text>
            <NumberInput value={number} onChange={handleNumberChange} />

            {/* Section: Bet Type */}
            <Text style={styles.sectionLabel}>{t('sectionBetType')}</Text>
            <BetTypeSelector
              value={betType}
              onChange={handleBetTypeChange}
              permutationCount={permCount}
              singlePerm={singlePerm}
            />

            {/* Section: Amounts */}
            <Text style={styles.sectionLabel}>{t('sectionBetAmount')}</Text>
            <View style={styles.amountGap}>
              <AmountInput
                label={t('big')}
                value={bigAmount}
                onChange={handleBigChange}
                accentColor="#2563EB"
              />
              <AmountInput
                label={t('small')}
                value={smallAmount}
                onChange={handleSmallChange}
                accentColor="#DC2626"
              />
            </View>

            {/* No-amount hint */}
            {!hasAmount && (
              <Text style={styles.hintText}>{t('setAtLeastOne')}</Text>
            )}

            {/* Live cost preview */}
            {liveCost !== null && (
              <View style={styles.costPreview}>
                <Text style={styles.costPreviewLabel}>{t('ticketCost')}</Text>
                <Text style={styles.costPreviewValue}>{formatRM(liveCost)}</Text>
              </View>
            )}

            {/* iBox warning */}
            {iboxDisabled && (
              <View style={styles.warningBar}>
                <Text style={styles.warningText}>{t('iboxWarning')}</Text>
              </View>
            )}

            {/* Hint for disabled button */}
            {!isValidNumber && (
              <Text style={styles.calcHint}>{t('hintEnterNumber')}</Text>
            )}
            {isValidNumber && !hasAmount && (
              <Text style={styles.calcHint}>{t('hintSetAmount')}</Text>
            )}

            {/* Calculate button */}
            <Pressable
              style={[
                styles.calcBtn,
                (!canCalculate || iboxDisabled || boxDisabled) && styles.calcBtnDisabled,
              ]}
              onPress={handleCalculate}
              disabled={!canCalculate || iboxDisabled || boxDisabled}
              accessibilityRole="button"
              accessibilityLabel="Calculate winnings"
              accessibilityState={{ disabled: !canCalculate || iboxDisabled || boxDisabled }}
            >
              <Text style={styles.calcBtnText}>{t('calculateWinnings')}</Text>
            </Pressable>

            {/* Results */}
            <View
              onLayout={(e) => {
                resultsY.current = e.nativeEvent.layout.y;
              }}
            >
              {showResults && resultSnapshot && (
                <ResultsDisplay
                  number={resultSnapshot.number}
                  betType={resultSnapshot.betType}
                  bigAmount={resultSnapshot.bigAmount}
                  smallAmount={resultSnapshot.smallAmount}
                  bigResults={resultSnapshot.bigResults}
                  smallResults={resultSnapshot.smallResults}
                  totalCost={resultSnapshot.totalCost}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Banner Ad - fixed at bottom (native only; renders nothing on web) */}
      <AdBanner />

      <HistoryBottomSheet
        visible={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
      />

      {/* About modal */}
      <Modal
        visible={showAbout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.aboutOverlay}>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>{t('aboutTitle')}</Text>
            <Text style={styles.aboutVersion}>{t('aboutVersion')}</Text>
            <ScrollView style={styles.aboutScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutText}>{t('aboutDisclaimer1')}</Text>
              <Text style={styles.aboutText}>{t('aboutDisclaimer2')}</Text>
              <Text style={styles.aboutText}>{t('aboutDisclaimer3')}</Text>
              <Text style={styles.aboutText}>{t('aboutDisclaimer4')}</Text>
            </ScrollView>
            <Pressable
              style={styles.aboutCloseBtn}
              onPress={() => setShowAbout(false)}
              accessibilityRole="button"
            >
              <Text style={styles.aboutCloseBtnText}>{t('aboutClose')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFF00',
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 48,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  historyBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  titleLine1: {
    fontSize: 30,
    fontWeight: '800',
    color: '#CC0000',
    textAlign: 'center',
  },
  titleLine2: {
    textAlign: 'center',
  },
  titleLine2_4D: {
    fontSize: 70,
    fontWeight: '900',
    color: '#CC0000',
    textAlign: 'center',
  },
  titleLine2_rest: {
    fontSize: 36,
    fontWeight: '800',
    color: '#CC0000',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#CC0000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  langToggle: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    backgroundColor: '#CC0000',
    borderColor: '#CC0000',
  },
  langBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Section labels
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Amount gap
  amountGap: {
    gap: 12,
  },

  // Hint
  hintText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },

  // Cost preview
  costPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  costPreviewLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    flexShrink: 1,
  },
  costPreviewValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    flexShrink: 0,
  },

  // Warning
  warningBar: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },

  // Calculate hint
  calcHint: {
    fontSize: 17,
    fontWeight: '800',
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  // Calculate button
  calcBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  calcBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  calcBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Info button
  infoBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CC0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },

  // About modal
  aboutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#CC0000',
    textAlign: 'center',
  },
  aboutVersion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  aboutScroll: {
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  aboutCloseBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  aboutCloseBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
