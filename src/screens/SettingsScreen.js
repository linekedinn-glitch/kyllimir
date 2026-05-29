import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS = [
  { section: 'Uygulama', items: [
    { icon: 'notifications-outline', title: 'Bildirimler', desc: 'Alarm bildirimleri' },
    { icon: 'volume-high-outline', title: 'Alarm Sesi', desc: 'Varsayılan ses' },
    { icon: 'phone-portrait-outline', title: 'Titreşim', desc: 'Alarm titreşimi' },
  ]},
  { section: 'Kyllimir', items: [
    { icon: 'diamond-outline', title: 'Premium', desc: 'Tüm özellikleri aç' },
    { icon: 'star-outline', title: 'Uygulamayı Değerlendir', desc: 'Geri bildirim' },
    { icon: 'information-circle-outline', title: 'Hakkında', desc: 'v1.0.0' },
  ]},
];

export default function SettingsScreen({ navigation }) {
  const clearData = async () => {
    Alert.alert('Verileri Sil', 'Tüm alarmlar silinecek. Emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert('Tamam', 'Tüm veriler silindi.');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AYARLAR</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {SETTINGS.map((group) => (
          <View key={group.section} style={styles.group}>
            <Text style={styles.sectionLabel}>{group.section.toUpperCase()}</Text>
            <View style={styles.card}>
              {group.items.map((item, i) => (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.row, i < group.items.length - 1 && styles.rowBorder]}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowIcon}>
                    <Ionicons name={item.icon} size={18} color={COLORS.gold} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowDesc}>{item.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.dangerBtn} onPress={clearData}>
          <Text style={styles.dangerText}>Tüm Verileri Sil</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>kyllimir · Zamanı Sen Yönet.</Text>
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: 70, paddingHorizontal: 24, paddingBottom: 20,
  },
  title: {
    fontSize: 11, color: COLORS.gold, letterSpacing: 4,
    fontFamily: 'sans-serif-medium',
  },
  scroll: { paddingHorizontal: 20 },

  group: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10, color: COLORS.textMuted, letterSpacing: 3,
    marginBottom: 10, fontFamily: 'sans-serif-medium',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, color: COLORS.white, fontFamily: 'sans-serif-medium' },
  rowDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  dangerBtn: {
    marginTop: 8, marginBottom: 24,
    padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#3A1010',
    backgroundColor: 'rgba(139,32,32,0.1)',
    alignItems: 'center',
  },
  dangerText: { color: '#E05A5A', fontSize: 14, fontFamily: 'sans-serif-medium' },

  footer: {
    textAlign: 'center', color: COLORS.textMuted,
    fontSize: 11, letterSpacing: 2, fontFamily: 'serif',
  },
});
