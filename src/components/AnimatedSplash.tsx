import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

let useVideoPlayer: any;
let VideoView: any;
let videoAvailable = false;

try {
  const mod = require('expo-video');
  useVideoPlayer = mod.useVideoPlayer;
  VideoView = mod.VideoView;
  videoAvailable = true;
} catch {
  videoAvailable = false;
}

const splashVideo = videoAvailable
  ? require('../../assets/splash-video.mp4')
  : null;

const splashImage = require('../../assets/splash-image.png');

interface AnimatedSplashProps {
  onFinish: () => void;
}

function SplashWithVideo({ onFinish }: AnimatedSplashProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [finished, setFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoReadyRef = useRef(false);
  const minDelayDoneRef = useRef(false);

  const fadeOut = useCallback(() => {
    if (finished) return;
    setFinished(true);
    Animated.timing(opacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => onFinish());
  }, [finished, onFinish, opacity]);

  // Don't auto-play — we'll play manually after the 1.5s image display
  const player = useVideoPlayer(splashVideo, (p: any) => {
    p.loop = false;
    p.muted = false;
  });

  const tryStartVideo = useCallback(() => {
    if (videoReadyRef.current && minDelayDoneRef.current) {
      setShowVideo(true);
      player.play();
    }
  }, [player]);

  useEffect(() => {
    // Minimum 1.5s splash image display
    const minDelay = setTimeout(() => {
      minDelayDoneRef.current = true;
      tryStartVideo();
    }, 1500);

    // When video ends, fade out
    const endSub = player.addListener('playToEnd', () => {
      fadeOut();
    });

    // Track video status
    const statusSub = player.addListener('statusChange', ({ status }: { status: string }) => {
      if (status === 'readyToPlay') {
        videoReadyRef.current = true;
        tryStartVideo();
      }
      if (status === 'error') {
        setTimeout(fadeOut, 500);
      }
    });

    // Safety timeout — never stay on splash longer than 6 seconds (1.5s image + video)
    const safety = setTimeout(fadeOut, 6000);

    return () => {
      clearTimeout(minDelay);
      endSub.remove();
      statusSub.remove();
      clearTimeout(safety);
    };
  }, [player, fadeOut, tryStartVideo]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Full-screen splash image shown for at least 1.5s */}
      {!showVideo && (
        <Image
          source={splashImage}
          style={styles.splashImage}
          resizeMode="contain"
        />
      )}
      {/* Video plays after 1.5s minimum */}
      {showVideo && (
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      )}
    </Animated.View>
  );
}

function SplashFallback({ onFinish }: AnimatedSplashProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={splashImage}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  if (videoAvailable && splashVideo) {
    return <SplashWithVideo onFinish={onFinish} />;
  }
  return <SplashFallback onFinish={onFinish} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
