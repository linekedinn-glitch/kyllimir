import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AnalogClock from '../components/AnalogClock';
import { COLORS } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEMES = [
  { id: 'zenith', name: 'Zenith', subtitle: 'Güne zarif bir başlangıç.' },
  { id: 'aurora', name: 'Aurora', subtitle: 'Işığın doğuşuyla uyan.' },
  { id: 'noir', name: 'Noir', subtitle: 'Karanlığın içinden yüksel.' },
];

const FEATURES = [
  {
    icon: 'musical-notes-outline',
    title: 'Melodik Uyanış',
    desc: 'Yumuşak ve armonik melodiler.',
  },
  {
    icon: 'leaf-outline',
    title: 'Doğal Sesler',
    desc: 'Doğadan ilham alan huzurlu sesler.',
  },
  {
    icon: 'pulse-outline',
    title: 'Akıllı Şiddet',
    desc: 'Uykunuzun evresine göre artan ses.',
  },
];

export default function ThemeScreen({ navigation }) {
  const [activeTheme, setActiveTheme] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const applyTheme = async () => {
    await AsyncStorage.setItem('kyllimir_theme', THEMES[activeTheme].id);
    Alert.alert('Tema Uygulandı', `${THEMES[activeTheme].name} teması aktif edildi.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>ALARM TEMA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Theme Name */}
        <Text style={styles.themeName}>{THEMES[activeTheme].name}</Text>
        <Text style={styles.themeSubtitle}>{THEMES[activeTheme].subtitle}</Text>

        {/* Clock Display */}
        <View style={styles.clockContainer}>
          <View style={styles.clockGlow}>
            <AnalogClock size={200} />
          </View>
        </View>

        {/* Theme Dots */}
        <View style={styles.themeDots}>
          {THEMES.map((t, i) => (
            <TouchableOpacity key={t.id} onPress={() => setActiveTheme(i)}>
              <View style={[styles.dot, i === activeTheme && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.featureRow, i === activeFeature && styles.featureRowActive]}
              onPress={() => setActiveFeature(i)}
            >
              <View style={[styles.featureIcon, i === activeFeature && styles.featureIconActive]}>
                <Ionicons
                  name={f.icon}
                  size={20}
                  color={i === activeFeature ? COLORS.gold : COLORS.textMuted}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, i === activeFeature && styles.featureTitleActive]}>
                  {f.title}
                </Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              {i === activeFeature && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply Button */}
        <TouchableOpacity onPress={applyTheme} style={styles.applyBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.goldDim, COLORS.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyGradient}
          >
            <Text style={styles.applyText}>Bu Temayı Kullan</Text>
          </LinearGradient>
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

  themeName: {
    fontSize: 48, color: COLORS.gold,
    fontFamily: 'serif', letterSpacing: 2,
    textAlign: 'center', marginTop: 8,
  },
  themeSubtitle: {
    fontSize: 13, color: COLORS.textMuted,
    textAlign: 'center', marginTop: 4, marginBottom: 24,
    fontFamily: 'sans-serif-light',
  },

  clockContainer: {
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  clockGlow: {
    padding: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(201,168,76,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.1)',
  },

  themeDots: {
    flexDirection: 'row', gap: 10, marginBottom: 32,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.gold, width: 24, borderRadius: 4,
  },

  features: { width: '100%', gap: 10, marginBottom: 28 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16, padding: 16, gap: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  featureRowActive: {
    borderColor: COLORS.borderGold,
    backgroundColor: 'rgba(201,168,76,0.05)',
  },
  featureIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.bgCardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  featureIconActive: { backgroundColor: COLORS.goldGlow },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, color: COLORS.textSub, fontFamily: 'sans-serif-medium' },
  featureTitleActive: { color: COLORS.white },
  featureDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  applyBtn: { width: '100%', borderRadius: 30, overflow: 'hidden' },
  applyGradient: { paddingVertical: 18, alignItems: 'center', borderRadius: 30 },
  applyText: {
    color: '#0a0a0a', fontSize: 16, fontWeight: '700',
    letterSpacing: 1, fontFamily: 'sans-serif-medium',
  },
});
