import mobileAds from 'react-native-google-mobile-ads';

// Initialize the Google Mobile Ads SDK (native platforms only).
export function initializeAds() {
  mobileAds().initialize();
}
