import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { COLORS } from '../utils/theme';

export default function AnalogClock({ size = 160, time = null }) {
  const secondAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  const getAngles = () => {
    const now = time ? new Date(`2000-01-01T${time}:00`) : new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    return {
      hour: (h * 30) + (m * 0.5),
      minute: m * 6,
      second: s * 6,
    };
  };

  const [angles, setAngles] = React.useState(getAngles);

  useEffect(() => {
    if (!time) {
      intervalRef.current = setInterval(() => {
        setAngles(getAngles());
      }, 1000);
    } else {
      setAngles(getAngles());
    }
    return () => clearInterval(intervalRef.current);
  }, [time]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const toRad = (deg) => (deg - 90) * (Math.PI / 180);
  const handEnd = (angle, length) => ({
    x: cx + length * Math.cos(toRad(angle)),
    y: cy + length * Math.sin(toRad(angle)),
  });

  const hourEnd = handEnd(angles.hour, r * 0.5);
  const minuteEnd = handEnd(angles.minute, r * 0.72);
  const secondEnd = handEnd(angles.second, r * 0.78);

  // Hour markers
  const markers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const rad = toRad(angle);
    const isMajor = i % 3 === 0;
    const outer = r - 2;
    const inner = isMajor ? r - 10 : r - 6;
    return {
      x1: cx + outer * Math.cos(rad),
      y1: cy + outer * Math.sin(rad),
      x2: cx + inner * Math.cos(rad),
      y2: cy + inner * Math.sin(rad),
      isMajor,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="clockFace" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#1a1a1a" />
            <Stop offset="100%" stopColor="#0a0a0a" />
          </RadialGradient>
          <RadialGradient id="rimGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="80%" stopColor="transparent" />
            <Stop offset="100%" stopColor="rgba(201,168,76,0.15)" />
          </RadialGradient>
        </Defs>

        {/* Outer ring glow */}
        <Circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth={6} />
        {/* Outer ring */}
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.goldDim} strokeWidth={1.5} />
        {/* Clock face */}
        <Circle cx={cx} cy={cy} r={r - 1} fill="url(#clockFace)" />
        {/* Inner ring */}
        <Circle cx={cx} cy={cy} r={r * 0.88} fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth={1} />

        {/* Hour markers */}
        {markers.map((m, i) => (
          <Line
            key={i}
            x1={m.x1} y1={m.y1}
            x2={m.x2} y2={m.y2}
            stroke={m.isMajor ? COLORS.gold : COLORS.goldDim}
            strokeWidth={m.isMajor ? 1.5 : 0.8}
            strokeLinecap="round"
          />
        ))}

        {/* Hour hand */}
        <Line
          x1={cx} y1={cy}
          x2={hourEnd.x} y2={hourEnd.y}
          stroke={COLORS.gold}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <Line
          x1={cx} y1={cy}
          x2={minuteEnd.x} y2={minuteEnd.y}
          stroke={COLORS.goldLight}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Second hand */}
        {!time && (
          <Line
            x1={cx} y1={cy}
            x2={secondEnd.x} y2={secondEnd.y}
            stroke="#E05A2B"
            strokeWidth={1}
            strokeLinecap="round"
          />
        )}
        {/* Center dot */}
        <Circle cx={cx} cy={cy} r={4} fill={COLORS.gold} />
        <Circle cx={cx} cy={cy} r={2} fill={COLORS.bgCard} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
