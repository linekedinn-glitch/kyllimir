import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

export default function GoldToggle({ value, onValueChange, size = 1 }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 80,
      friction: 8,
    }).start();
  }, [value]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.toggleOff, COLORS.gold],
  });

  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2 * size, 22 * size],
  });

  const thumbScale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.85, 1],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, {
        backgroundColor: trackColor,
        width: 46 * size,
        height: 26 * size,
        borderRadius: 13 * size,
      }]}>
        <Animated.View style={[styles.thumb, {
          width: 20 * size,
          height: 20 * size,
          borderRadius: 10 * size,
          transform: [{ translateX: thumbX }, { scale: thumbScale }],
          top: 3 * size,
        }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
