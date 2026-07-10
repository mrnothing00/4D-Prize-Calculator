import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { initializeAds } from '@/utils/ads';

import { LanguageProvider } from '@/i18n/LanguageContext';
import AnimatedSplash from '@/components/AnimatedSplash';

// Disable system font scaling — app controls its own font sizes
if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.allowFontScaling = false;
if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.allowFontScaling = false;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Initialize Google Mobile Ads SDK (native only; no-op on web)
  useEffect(() => {
    initializeAds();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }} />
        {showSplash && (
          <AnimatedSplash onFinish={() => setShowSplash(false)} />
        )}
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
