import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use Google's test ad unit in development, real unit in production builds
const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-0000000000000000/0000000000';

export default function AdBanner() {
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(err) => console.log('Banner ad failed to load:', err)}
        onAdLoaded={() => console.log('Banner ad loaded')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFF00',
  },
});
