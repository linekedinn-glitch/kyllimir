import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnalogClock from '../components/AnalogClock';
import GoldToggle from '../components/GoldToggle';
import { COLORS } from '../utils/theme';
import {
  loadAlarms, saveAlarms,
  scheduleAlarmNotification, cancelAlarmNotification,
  getNextAlarmText, formatDays
} from '../utils/alarmUtils';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [alarms, setAlarms] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Günaydın,');
    else if (h < 18) setGreeting('İyi günler,');
    else setGreeting('İyi akşamlar,');

    const tick = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0')
      );
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAlarms);
    return unsubscribe;
  }, [navigation]);

  const fetchAlarms = useCallback(async () => {
    const data = await loadAlarms();
    setAlarms(data);
  }, []);

  const toggleAlarm = async (id) => {
    const updated = alarms.map(async (a) => {
      if (a.id !== id) return a;
      const newEnabled = !a.enabled;
      if (newEnabled) {
        const notifId = await scheduleAlarmNotification(a);
        return { ...a, enabled: true, notificationId: notifId };
      } else {
        await cancelAlarmNotification(a.notificationId);
        return { ...a, enabled: false, notificationId: null };
      }
    });
    const resolved = await Promise.all(updated);
    setAlarms(resolved);
    await saveAlarms(resolved);
  };

  const deleteAlarm = async (id) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm?.notificationId) await cancelAlarmNotification(alarm.notificationId);
    const filtered = alarms.filter(a => a.id !== id);
    setAlarms(filtered);
    await saveAlarms(filtered);
  };

  const nextAlarm = alarms.find(a => a.enabled);
  const nextAlarmText = nextAlarm ? getNextAlarmText(nextAlarm) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.appName}>Kyllimir.</Text>
            <Text style={styles.subText}>Güne mükemmel bir başlangıç yap.</Text>
          </View>
          <TouchableOpacity style={styles.crownBtn} onPress={() => navigation.navigate('Smart')}>
            <Ionicons name="diamond-outline" size={20} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Next Alarm Card */}
        <View style={styles.nextAlarmCard}>
          <View style={styles.nextAlarmLeft}>
            <Text style={styles.nextAlarmLabel}>SONRAKİ ALARM</Text>
            <Text style={styles.nextAlarmTime}>
              {nextAlarm ? nextAlarm.time : '--:--'}
            </Text>
            {nextAlarm && (
              <View style={styles.nextAlarmMeta}>
                <Ionicons name="alarm-outline" size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
                <Text style={styles.nextAlarmSub}>
                  {formatDays(nextAlarm?.days)}
                  {nextAlarmText ? `  ·  ${nextAlarmText}` : ''}
                </Text>
              </View>
            )}
            {!nextAlarm && (
              <Text style={styles.nextAlarmSub}>Aktif alarm yok</Text>
            )}
          </View>
          <View style={styles.clockWrap}>
            <AnalogClock size={110} />
          </View>
        </View>

        {/* Alarms Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALARMLARIM</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddAlarm', { alarm: null })}
          >
            <Ionicons name="add" size={22} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {alarms.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="alarm-outline" size={40} color={COLORS.border} />
            <Text style={styles.emptyText}>Henüz alarm yok</Text>
            <Text style={styles.emptySubText}>+ ile yeni alarm ekle</Text>
          </View>
        )}

        {alarms.map((alarm, index) => (
          <AlarmRow
            key={alarm.id}
            alarm={alarm}
            onToggle={() => toggleAlarm(alarm.id)}
            onDelete={() => deleteAlarm(alarm.id)}
            onEdit={() => navigation.navigate('AddAlarm', { alarm })}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function AlarmRow({ alarm, onToggle, onDelete, onEdit }) {
  return (
    <TouchableOpacity onPress={onEdit} onLongPress={onDelete} activeOpacity={0.85}>
      <View style={[styles.alarmRow, !alarm.enabled && styles.alarmRowDisabled]}>
        <View style={styles.alarmDots}>
          <View style={[styles.dot, alarm.enabled && styles.dotActive]} />
        </View>
        <View style={styles.alarmInfo}>
          <Text style={[styles.alarmTime, !alarm.enabled && styles.alarmTimeDim]}>
            {alarm.time}
          </Text>
          <View style={styles.alarmMeta}>
            <Ionicons name="alarm-outline" size={11} color={alarm.enabled ? COLORS.gold : COLORS.textMuted} style={{ marginRight: 4 }} />
            <Text style={[styles.alarmSub, !alarm.enabled && styles.alarmSubDim]}>
              {formatDays(alarm.days)}
              {alarm.label ? `  ·  ${alarm.label}` : ''}
            </Text>
          </View>
        </View>
        <GoldToggle value={alarm.enabled} onValueChange={onToggle} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 60 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: { fontSize: 14, color: COLORS.textMuted, fontFamily: 'sans-serif-light', letterSpacing: 1 },
  appName: { fontSize: 34, color: COLORS.white, fontFamily: 'serif', letterSpacing: 1, marginTop: 2 },
  subText: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.5 },
  crownBtn: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1, borderColor: COLORS.borderGold,
    backgroundColor: COLORS.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },

  nextAlarmCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  nextAlarmLeft: { flex: 1 },
  nextAlarmLabel: {
    fontSize: 10, color: COLORS.gold, letterSpacing: 3,
    fontFamily: 'sans-serif-medium', marginBottom: 8,
  },
  nextAlarmTime: {
    fontSize: 52, color: COLORS.white,
    fontFamily: 'sans-serif-thin', letterSpacing: 2,
  },
  nextAlarmMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  nextAlarmSub: { fontSize: 12, color: COLORS.textSub },
  clockWrap: {
    alignItems: 'center', justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10, color: COLORS.gold,
    letterSpacing: 3, fontFamily: 'sans-serif-medium',
  },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1, borderColor: COLORS.borderGold,
    backgroundColor: COLORS.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center', paddingVertical: 40, gap: 8,
  },
  emptyText: { color: COLORS.textMuted, fontSize: 16, fontFamily: 'serif' },
  emptySubText: { color: COLORS.textMuted, fontSize: 12 },

  alarmRow: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alarmRowDisabled: { opacity: 0.5 },
  alarmDots: { width: 20, alignItems: 'center', marginRight: 12 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: { backgroundColor: COLORS.gold },
  alarmInfo: { flex: 1 },
  alarmTime: {
    fontSize: 32, color: COLORS.white,
    fontFamily: 'sans-serif-thin', letterSpacing: 1,
  },
  alarmTimeDim: { color: COLORS.textMuted },
  alarmMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  alarmSub: { fontSize: 12, color: COLORS.textSub },
  alarmSubDim: { color: COLORS.textMuted },
});
