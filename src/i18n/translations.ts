export type Language = 'en' | 'zh';

const translations = {
  // Header
  appTitleLine1: { en: '', zh: '马来西亚' },
  appTitle: { en: 'Malaysia 4D Prize Calculator', zh: '' },
  appSubtitle: {
    en: 'Calculate your winnings instantly',
    zh: '轻松计算你的万字奖金',
  },
  clearAll: { en: 'Clear All', zh: '全部清除' },

  // Section labels
  sectionNumber: { en: 'YOUR NUMBER', zh: '你的号码' },
  sectionBetType: { en: 'BET TYPE', zh: '下注方式' },
  sectionBetAmount: { en: 'BET AMOUNT', zh: '下注金额' },

  // NumberInput
  enterNumber: { en: 'Enter a 4-digit number', zh: '输入4位数号码' },
  permutations: { en: 'permutations', zh: '个排列' },
  permutation: { en: 'permutation', zh: '个排列' },
  permAllDifferent: { en: 'All different', zh: '全不同' },
  permOnePair: { en: 'One pair', zh: '一对' },
  permTwoPairs: { en: 'Two pairs', zh: '两对' },
  permThreeSame: { en: 'Three same', zh: '三个相同' },
  permAllSame: { en: 'All same', zh: '全部相同' },
  padClear: { en: 'Clear', zh: '清除' },
  padDelete: { en: 'Delete', zh: '删除' },
  padDigit: { en: 'Digit', zh: '数字' },

  // BetTypeSelector
  straight: { en: 'Straight', zh: '正字' },
  straightSub: { en: 'Exact match', zh: '准确号码' },
  ibox: { en: 'iBox', zh: '全保' },
  iboxSub: { en: 'Any order', zh: '任何排列' },
  box: { en: 'Box', zh: '包字' },
  boxSub: { en: 'All permutations', zh: '所有排列' },
  iboxDisabledNote: {
    en: 'iBox not available \u2014 all digits are the same',
    zh: '全保不适用 \u2014 所有数字相同',
  },
  iboxBoxDisabledNote: {
    en: 'iBox and Box not available \u2014 all digits are the same',
    zh: '全保和包字不可用 \u2014 所有数字相同',
  },
  explainStraight: {
    en: 'Your number must match the winning number exactly. Lowest cost, highest prize.',
    zh: '你的号码必须与中奖号码完全一致。费用最低，奖金最高。',
  },
  explainIboxDefault: {
    en: 'Covers all permutations of your number for RM1.',
    zh: '以 RM1 包含你号码的所有排列。',
  },
  explainIboxNA: {
    en: 'iBox is not applicable for numbers with all identical digits.',
    zh: '全保不适用于所有数字相同的号码。',
  },
  explainIbox: {
    en: 'Covers all {n} permutations of your number for RM1. Prize is divided across {n} combinations.',
    zh: '以 RM1 包含你号码的全部 {n} 个排列。奖金分配到 {n} 个组合。',
  },
  explainBoxDefault: {
    en: 'Bets on every permutation at full price.',
    zh: '以全额下注每一个排列。',
  },
  explainBox1Perm: {
    en: 'Only 1 permutation \u2014 same as a Straight bet.',
    zh: '只有 1 个排列 \u2014 和正字一样。',
  },
  explainBox: {
    en: 'Bets on all {n} permutations at full price. Cost is {n}x your bet amount, but you win the full Straight prize.',
    zh: '以全额下注全部 {n} 个排列。费用是下注额的 {n} 倍，但可赢取完整正字奖金。',
  },

  // AmountInput
  big: { en: 'Big (ABC)', zh: '大 (ABC)' },
  small: { en: 'Small (A)', zh: '小 (A)' },
  decreaseAmount: { en: 'Decrease {label} amount', zh: '减少{label}金额' },
  increaseAmount: { en: 'Increase {label} amount', zh: '增加{label}金额' },
  setAmountTo: { en: 'Set {label} to RM {n}', zh: '设置{label}为 RM {n}' },

  // Cost & hints
  ticketCost: { en: 'Ticket Cost', zh: '总票价' },
  setAtLeastOne: { en: 'Set at least one bet amount', zh: '请设置至少一个下注金额' },
  iboxWarning: {
    en: 'iBox is not available for numbers with all identical digits.',
    zh: '全保不适用于所有数字相同的号码。',
  },
  calculateWinnings: { en: 'Calculate Winnings', zh: '计算奖金' },

  // ResultsDisplay
  prize: { en: 'Prize', zh: '奖项' },
  youWin: { en: 'You Win', zh: '可赢' },
  totalCost: { en: 'Total Cost', zh: '总票价' },
  winningBreakdown: { en: 'Winning Breakdown', zh: '中奖明细' },
  bigDash: { en: 'Big', zh: '大' },
  smallDash: { en: 'Small', zh: '小' },
  combinedTotal: { en: 'Combined Total', zh: '合计' },
  bigOnly: { en: 'Big only', zh: '只限大' },
  ifYouWin1st: { en: 'If you win 1st Prize', zh: '如果中头奖' },
  ifYouWin2nd: { en: 'If you win 2nd Prize', zh: '如果中二奖' },
  ifYouWin3rd: { en: 'If you win 3rd Prize', zh: '如果中三奖' },
  ifYouWinSpecial: { en: 'If you win Special', zh: '如果中入围' },
  ifYouWinConsolation: { en: 'If you win Consolation', zh: '如果中安慰奖' },
  disclaimer: {
    en: 'Prize amounts are calculated based on the standard 4D prize structure set by Malaysian 4D operators. Actual payouts are subject to the respective operator\'s official terms and conditions. Special and Consolation prizes apply to Big bets only. This app is for reference only.',
    zh: '奖金金额根据马来西亚万字运营商所设定的标准万字奖金结构计算。实际派彩以各运营商的官方条款与条件为准。入围奖和安慰奖仅适用于大 (ABC)。本应用仅供参考。',
  },

  // Prize tier labels
  prize1st: { en: '1st Prize', zh: '头奖' },
  prize2nd: { en: '2nd Prize', zh: '二奖' },
  prize3rd: { en: '3rd Prize', zh: '三奖' },
  prizeSpecial: { en: 'Special', zh: '入围' },
  prizeConsolation: { en: 'Consolation', zh: '安慰奖' },

  // History
  history: { en: 'History', zh: '历史记录' },
  historyClearAll: { en: 'Clear All', zh: '清除全部' },
  historyBig: { en: 'Big', zh: '大' },
  historySmall: { en: 'Small', zh: '小' },
  noCalculationsYet: { en: 'No calculations yet', zh: '还没有计算记录' },
  clearHistoryTitle: { en: 'Clear History', zh: '清除记录' },
  clearHistoryMessage: { en: 'Delete all calculation history?', zh: '删除所有计算记录？' },
  cancel: { en: 'Cancel', zh: '取消' },
  clear: { en: 'Clear', zh: '清除' },

  // Language toggle
  langEN: { en: 'EN', zh: 'EN' },
  langZH: { en: '中文', zh: '中文' },

  // Exit app
  exitAppTitle: { en: 'Exit App?', zh: '退出应用?' },
  exitAppMessage: { en: 'Are you sure you want to exit?', zh: '确定要退出吗?' },
  exitApp: { en: 'Exit', zh: '退出' },

  // Calculate hints
  hintEnterNumber: { en: 'Please enter a 4-digit number first', zh: '请先输入4位数号码' },
  hintSetAmount: { en: 'Please set a bet amount (Big or Small)', zh: '请设置投注金额 (大或小)' },

  // About
  aboutTitle: { en: '4D Prize Calculator', zh: '4D万字奖金计算器' },
  aboutVersion: { en: 'Version 1.0.0', zh: '版本 1.0.0' },
  aboutDisclaimer1: {
    en: 'This app is a calculator tool for reference only. It is not affiliated with, endorsed by, or connected to any lottery operator in Malaysia.',
    zh: '本应用仅为计算工具，仅供参考。本应用与任何马来西亚万字运营商无关，未获任何运营商认可或授权。',
  },
  aboutDisclaimer2: {
    en: 'Prize amounts shown are based on standard 4D prize structures. Actual payouts may vary and are subject to the respective operator\'s terms and conditions.',
    zh: '所显示的奖金金额基于标准万字奖金结构。实际派彩可能有所不同，以各运营商的条款与条件为准。',
  },
  aboutDisclaimer3: {
    en: 'This app does not facilitate or encourage gambling. Please gamble responsibly.',
    zh: '本应用不鼓励赌博行为。请理性投注。',
  },
  aboutDisclaimer4: {
    en: 'No personal data is collected. All calculations are performed locally on your device.',
    zh: '本应用不收集任何个人数据。所有计算均在您的设备上本地完成。',
  },
  aboutClose: { en: 'Close', zh: '关闭' },
} as const;

export type TranslationKey = keyof typeof translations;

export default translations;
