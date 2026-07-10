# 4D Prize Calculator 🎯

A **React Native (Expo)** mobile app that instantly calculates Malaysian **4D lottery prizes**
for any 4-digit number across all bet types — **Straight, iBox, and Box**. Published on the
**Google Play Store**.

> A utility/educational tool for calculating potential prize amounts. It does not facilitate
> gambling, sell tickets, or connect to any lottery operator — all calculations run on-device.

## ✨ Features
- 🧮 Calculate prizes for **Straight, iBox, and Box** bets
- 💵 Independent **Big (ABC)** and **Small (A)** bet amounts, with combined totals
- 🏆 Full prize breakdown — 1st, 2nd, 3rd, Special & Consolation
- 🔁 Automatic **permutation detection** (24 / 12 / 6 / 4 / 1)
- 🧾 Live ticket-cost preview before calculating
- 🕘 **Calculation history** — recall and reload past calculations
- 🌐 **Bilingual** — English & Chinese (中文)
- 📴 Works fully **offline**
- Works for Magnum, Toto, Damacai, CashSweep, Sabah 88, Sandakan and other MY operators

## 🛠️ Tech stack
React Native · **Expo** · TypeScript · Expo Router (file-based routing) · i18n (EN/中文) ·
Jest (unit tests) · Google AdMob

## 📂 Project structure
```
src/
  app/          # Expo Router screens (file-based routing)
  components/   # UI: AmountInput, BetTypeSelector, ResultsDisplay, HistoryBottomSheet, AdBanner…
  screens/      # CalculatorScreen
  utils/        # calculator logic (+ __tests__), history, ads
  data/         # 4D prize tables
  i18n/         # LanguageContext + translations (English / 中文)
```

## 🚀 Getting started
```bash
npm install
npx expo start
```

## 🔐 Note for this public copy
This is a **sanitized copy** of the production app. The **AdMob IDs** in `app.json` and
`src/components/AdBanner.tsx` are placeholders (`ca-app-pub-0000...`) — replace them with your
own to enable ads. Signing keystores and credentials are **not** included.

## 📱 Availability
Published on **Google Play** as *4D Prize Calculator* — version 1.1.1.

## ⚖️ Disclaimer
For informational and educational purposes only. Not affiliated with any lottery operator.
