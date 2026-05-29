import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';
import {
  loadAlarms, saveAlarms, generateId,
  scheduleAlarmNotification, cancelAlarmNotification
} from '../utils/alarmUtils';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const ALL_WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const WEEKEND = ['Cmt', 'Paz'];

export default function AddAlarmScreen({ navigation, route }) {
  const editAlarm = route?.params?.alarm;

  const [hour, setHour] = useState(editAlarm ? editAlarm.time.split(':')[0] : '07');
  const [minute, setMinute] = useState(editAlarm ? editAlarm.time.split(':')[1] : '30');
  const [selectedDays, setSelectedDays] = useState(editAlarm?.days || []);
  const [label, setLabel] = useState(editAlarm?.label || '');

  const adjustTime = (type, delta) => {
    if (type === 'hour') {
      let h = (parseInt(hour) + delta + 24) % 24;
      setHour(h.toString().padStart(2, '0'));
    } else {
      let m = (parseInt(minute) + delta + 60) % 60;
      setMinute(m.toString().padStart(2, '0'));
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const setPreset = (preset) => {
    if (preset === 'everyday') setSelectedDays([...DAYS]);
    else if (preset === 'weekdays') setSelectedDays([...ALL_WEEKDAYS]);
    else if (preset === 'weekend') setSelectedDays([...WEEKEND]);
    else setSelectedDays([]);
  };

  const saveAlarm = async () => {
    const alarms = await loadAlarms();
    const time = `${hour}:${minute}`;

    if (editAlarm) {
      await cancelAlarmNotification(editAlarm.notificationId);
      const newAlarm = { ...editAlarm, time, days: selectedDays, label };
      const notifId = await scheduleAlarmNotification(newAlarm);
      newAlarm.notificationId = notifId;
      const updated = alarms.map(a => a.id === editAlarm.id ? newAlarm : a);
      await saveAlarms(updated);
    } else {
      const newAlarm = {
        id: generateId(),
        time,
        days: selectedDays,
        label,
        enabled: true,
        notificationId: null,
      };
      const notifId = await scheduleAlarmNotification(newAlarm);
      newAlarm.notificationId = notifId;
      await saveAlarms([...alarms, newAlarm]);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{editAlarm ? 'Alarmı Düzenle' : 'Yeni Alarm'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Time Picker */}
        <View style={styles.timePicker}>
          {/* Hour */}
          <View style={styles.timeColumn}>
            <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustTime('hour', 1)}>
              <Ionicons name="chevron-up" size={28} color={COLORS.gold} />
            </TouchableOpacity>
            <Text style={styles.timeDigit}>{hour}</Text>
            <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustTime('hour', -1)}>
              <Ionicons name="chevron-down" size={28} color={COLORS.gold} />
            </TouchableOpacity>
          </View>

          <Text style={styles.timeSep}>:</Text>

          {/* Minute */}
          <View style={styles.timeColumn}>
            <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustTime('minute', 5)}>
              <Ionicons name="chevron-up" size={28} color={COLORS.gold} />
            </TouchableOpacity>
            <Text style={styles.timeDigit}>{minute}</Text>
            <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustTime('minute', -5)}>
              <Ionicons name="chevron-down" size={28} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TEKRAR</Text>
          <View style={styles.presets}>
            {[
              { label: 'Bir kez', key: 'once' },
              { label: 'Her gün', key: 'everyday' },
              { label: 'Hafta içi', key: 'weekdays' },
              { label: 'Hafta sonu', key: 'weekend' },
            ].map(p => {
              const active =
                p.key === 'once' ? selectedDays.length === 0 :
                p.key === 'everyday' ? selectedDays.length === 7 :
                p.key === 'weekdays' ? JSON.stringify([...selectedDays].sort()) === JSON.stringify([...ALL_WEEKDAYS].sort()) :
                JSON.stringify([...selectedDays].sort()) === JSON.stringify([...WEEKEND].sort());
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.preset, active && styles.presetActive]}
                  onPress={() => setPreset(p.key)}
                >
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Day Selector */}
        <View style={styles.dayRow}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayBtn, selectedDays.includes(day) && styles.dayBtnActive]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[styles.dayText, selectedDays.includes(day) && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Label */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ETİKET</Text>
          <View style={styles.labelInput}>
            <Ionicons name="create-outline" size={16} color={COLORS.textMuted} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="Alarm etiketi (isteğe bağlı)"
              placeholderTextColor={COLORS.textMuted}
              selectionColor={COLORS.gold}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={saveAlarm} style={styles.saveBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.goldDim, COLORS.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtnGradient}
          >
            <Text style={styles.saveBtnText}>Kaydet</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 24 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.borderGold,
  },
  title: { fontSize: 18, color: COLORS.white, fontFamily: 'serif', letterSpacing: 1 },

  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    paddingVertical: 20,
    marginBottom: 28,
    gap: 12,
  },
  timeColumn: { alignItems: 'center', gap: 8 },
  arrowBtn: {
    width: 48, height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: 24, backgroundColor: COLORS.goldGlow,
  },
  timeDigit: {
    fontSize: 72, color: COLORS.white,
    fontFamily: 'sans-serif-thin', letterSpacing: 2,
    minWidth: 90, textAlign: 'center',
  },
  timeSep: {
    fontSize: 56, color: COLORS.gold,
    fontFamily: 'sans-serif-thin',
    marginBottom: 8,
  },

  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 10, color: COLORS.gold, letterSpacing: 3,
    fontFamily: 'sans-serif-medium', marginBottom: 12,
  },
  presets: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  preset: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  presetActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldGlow,
  },
  presetText: { fontSize: 12, color: COLORS.textMuted },
  presetTextActive: { color: COLORS.gold },

  dayRow: {
    flexDirection: 'row', gap: 8, marginBottom: 24, justifyContent: 'space-between',
  },
  dayBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard, alignItems: 'center',
  },
  dayBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldGlow },
  dayText: { fontSize: 10, color: COLORS.textMuted, fontFamily: 'sans-serif-medium' },
  dayTextActive: { color: COLORS.gold },

  labelInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  input: { flex: 1, color: COLORS.white, fontSize: 15 },

  saveBtn: { marginTop: 8, borderRadius: 30, overflow: 'hidden' },
  saveBtnGradient: { paddingVertical: 18, alignItems: 'center', borderRadius: 30 },
  saveBtnText: {
    color: '#0a0a0a', fontSize: 16, fontWeight: '700',
    letterSpacing: 2, fontFamily: 'sans-serif-medium',
  },
});
