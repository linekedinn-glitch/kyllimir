import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onEnter }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(lineAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(btnAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const lineWidth = lineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] });

  return (
    <View style={styles.container}>
      {/* Background waves */}
      <View style={styles.waveBg}>
        <LinearGradient
          colors={['transparent', 'rgba(201,168,76,0.06)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.wave1}
        />
        <LinearGradient
          colors={['transparent', 'rgba(201,168,76,0.04)', 'transparent']}
          start={{ x: 0.2, y: 0.3 }}
          end={{ x: 0.8, y: 0.7 }}
          style={styles.wave2}
        />
      </View>

      {/* K Logo */}
      <Animated.View style={[styles.logoContainer, {
        opacity: logoAnim,
        transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
      }]}>
        <View style={styles.kLogo}>
          <View style={styles.kVertical} />
          <View style={styles.kTopDiag} />
          <View style={styles.kBottomDiag} />
        </View>
      </Animated.View>

      {/* Brand name */}
      <Animated.View style={{ opacity: textAnim, transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <Text style={styles.brandName}>kyllimir</Text>
        <Animated.View style={[styles.goldLine, { width: lineWidth }]} />
        <Text style={styles.tagline}>ZAMANI SEN YÖNET.</Text>
      </Animated.View>

      {/* Enter button */}
      <Animated.View style={[styles.enterBtn, { opacity: btnAnim }]}>
        <TouchableOpacity onPress={onEnter} style={styles.btnTouch} activeOpacity={0.75}>
          <LinearGradient
            colors={[COLORS.goldDim, COLORS.gold, COLORS.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Başla</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  waveBg: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  wave1: {
    position: 'absolute',
    bottom: height * 0.15,
    left: -width * 0.3,
    width: width * 1.6,
    height: height * 0.25,
    transform: [{ rotate: '-8deg' }],
    borderRadius: 200,
  },
  wave2: {
    position: 'absolute',
    bottom: height * 0.08,
    left: -width * 0.1,
    width: width * 1.2,
    height: height * 0.18,
    transform: [{ rotate: '-5deg' }],
    borderRadius: 200,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    borderRadius: 20,
    backgroundColor: 'rgba(201,168,76,0.05)',
  },
  kLogo: {
    width: 44,
    height: 54,
    position: 'relative',
  },
  kVertical: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  kTopDiag: {
    position: 'absolute',
    left: 6,
    top: 0,
    width: 38,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    transform: [{ rotate: '40deg' }, { translateY: 14 }, { translateX: 8 }],
  },
  kBottomDiag: {
    position: 'absolute',
    left: 6,
    bottom: 0,
    width: 38,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    transform: [{ rotate: '-40deg' }, { translateY: -14 }, { translateX: 8 }],
  },
  brandName: {
    fontSize: 42,
    color: COLORS.white,
    fontFamily: 'serif',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 8,
  },
  goldLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    alignSelf: 'center',
    marginVertical: 12,
  },
  tagline: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 5,
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
  },
  enterBtn: {
    marginTop: 60,
  },
  btnTouch: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingHorizontal: 52,
    paddingVertical: 16,
    borderRadius: 30,
  },
  btnText: {
    color: '#0a0a0a',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'sans-serif-medium',
  },
});
