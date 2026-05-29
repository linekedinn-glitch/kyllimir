import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { COLORS } from '../utils/theme';

const SLEEP_FEATURES = [
  {
    icon: 'bar-chart-outline',
    title: 'Uyku Analizi',
    desc: 'Uyku evrelerini analiz eder.',
  },
  {
    icon: 'time-outline',
    title: 'En Uygun Zaman',
    desc: 'Hafif uyku evresinde uyarır.',
  },
  {
    icon: 'sunny-outline',
    title: 'Güne Zinde Başla',
    desc: 'Yorgunluk hissini azaltır.',
  },
];

// Sleep wave SVG
function SleepWave({ width = 280, height = 100 }) {
  const path = `M 0 ${height * 0.7} 
    C ${width * 0.1} ${height * 0.3}, ${width * 0.2} ${height * 0.9}, ${width * 0.3} ${height * 0.5}
    C ${width * 0.4} ${height * 0.15}, ${width * 0.5} ${height * 0.85}, ${width * 0.6} ${height * 0.45}
    C ${width * 0.7} ${height * 0.1}, ${width * 0.8} ${height * 0.7}, ${width} ${height * 0.35}`;

  return (
    <Svg width={width} height={height}>
      <Path
        d={path}
        fill="none"
        stroke="rgba(201,168,76,0.5)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      {/* Sun dot at end */}
      <Circle
        cx={width}
        cy={height * 0.35}
        r={6}
        fill={COLORS.gold}
      />
      <Circle
        cx={width}
        cy={height * 0.35}
        r={12}
        fill="rgba(201,168,76,0.15)"
      />
    </Svg>
  );
}

const MOON_PHASES = [
  { icon: 'moon-outline', opacity: 0.3 },
  { icon: 'moon-outline', opacity: 0.5 },
  { icon: 'moon', opacity: 0.8 },
  { icon: 'moon', opacity: 0.4 },
];

export default function SmartWakeScreen({ navigation }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>AKILLI UYANIŞŞ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <Text style={styles.heroTitle}>Akıllı Uyanış</Text>
        <Text style={styles.heroSubtitle}>
          En hafif uyku evresinde{'\n'}seni nazikçe uyandırır.
        </Text>

        {/* Sleep wave viz */}
        <View style={styles.waveContainer}>
          <SleepWave width={300} height={90} />
          {/* Moon phases */}
          <View style={styles.moonRow}>
            {MOON_PHASES.map((m, i) => (
              <Ionicons
                key={i}
                name={m.icon}
                size={20}
                color={`rgba(201,168,76,${m.opacity})`}
              />
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {SLEEP_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={20} color={COLORS.gold} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={COLORS.gold} />
              </View>
            </View>
          ))}
        </View>

        {/* Enable Button */}
        <TouchableOpacity
          onPress={() => setEnabled(!enabled)}
          style={styles.enableBtn}
          activeOpacity={0.8}
        >
          {enabled ? (
            <View style={styles.enabledState}>
              <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />
              <Text style={styles.enabledText}>Akıllı Uyanış Aktif</Text>
            </View>
          ) : (
            <LinearGradient
              colors={[COLORS.goldDim, COLORS.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.enableGradient}
            >
              <Text style={styles.enableText}>Akıllı Uyanışı Etkinleştir</Text>
              <Ionicons name="diamond-outline" size={16} color="#0a0a0a" style={{ marginLeft: 8 }} />
            </LinearGradient>
          )}
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 24, alignItems: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.borderGold,
  },
  title: {
    fontSize: 11, color: COLORS.textSub, letterSpacing: 4,
    fontFamily: 'sans-serif-medium',
  },

  heroTitle: {
    fontSize: 40, color: COLORS.gold,
    fontFamily: 'serif', letterSpacing: 1,
    textAlign: 'center', marginTop: 8,
  },
  heroSubtitle: {
    fontSize: 14, color: COLORS.textMuted,
    textAlign: 'center', marginTop: 8, marginBottom: 28,
    fontFamily: 'sans-serif-light', lineHeight: 22,
  },

  waveContainer: {
    width: 300, alignItems: 'center', marginBottom: 32,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  moonRow: {
    flexDirection: 'row', gap: 20, marginTop: 12,
    justifyContent: 'space-between', width: '100%', paddingHorizontal: 10,
  },

  features: { width: '100%', gap: 10, marginBottom: 28 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16, padding: 16, gap: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  featureIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, color: COLORS.white, fontFamily: 'sans-serif-medium' },
  featureDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1, borderColor: COLORS.borderGold,
    backgroundColor: COLORS.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },

  enableBtn: { width: '100%', borderRadius: 30, overflow: 'hidden' },
  enableGradient: {
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', borderRadius: 30,
  },
  enableText: {
    color: '#0a0a0a', fontSize: 15, fontWeight: '700',
    letterSpacing: 1, fontFamily: 'sans-serif-medium',
  },
  enabledState: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 18,
    borderRadius: 30, borderWidth: 1, borderColor: COLORS.borderGold,
    backgroundColor: COLORS.goldGlow,
  },
  enabledText: { color: COLORS.gold, fontSize: 15, fontFamily: 'sans-serif-medium' },
});
