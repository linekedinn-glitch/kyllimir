import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const ALARMS_KEY = 'kyllimir_alarms';

// --- Notification Setup ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
  return false;
}

// --- Alarm Scheduling ---
export async function scheduleAlarmNotification(alarm) {
  const [hours, minutes] = alarm.time.split(':').map(Number);

  let trigger;
  const now = new Date();
  const alarmDate = new Date();
  alarmDate.setHours(hours, minutes, 0, 0);

  if (alarm.days && alarm.days.length > 0) {
    // Repeating alarm - schedule for next occurrence
    const dayMap = { 'Pzt': 2, 'Sal': 3, 'Çar': 4, 'Per': 5, 'Cum': 6, 'Cmt': 7, 'Paz': 1 };
    const firstDay = alarm.days[0];
    trigger = {
      weekday: dayMap[firstDay] || 2,
      hour: hours,
      minute: minutes,
      second: 0,
      repeats: true,
    };
  } else {
    // One-time alarm
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    trigger = alarmDate;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Kyllimir',
      body: alarm.label || `${alarm.time} — Uyanma zamanı`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      vibrate: [0, 500, 200, 500],
    },
    trigger,
  });

  return id;
}

export async function cancelAlarmNotification(notificationId) {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}

// --- Storage ---
export async function loadAlarms() {
  try {
    const json = await AsyncStorage.getItem(ALARMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveAlarms(alarms) {
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getNextAlarmText(alarm) {
  if (!alarm.enabled) return null;
  const [h, m] = alarm.time.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diffMs = next - now;
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);
  if (diffH === 0) return `${diffM} dakika sonra`;
  return `${diffH} saat ${diffM} dakika sonra`;
}

export function formatDays(days) {
  if (!days || days.length === 0) return 'Bir kez';
  if (days.length === 7) return 'Her gün';
  if (days.length === 5 && !days.includes('Cmt') && !days.includes('Paz')) return 'Hafta içi';
  if (days.length === 2 && days.includes('Cmt') && days.includes('Paz')) return 'Hafta sonu';
  return days.join(', ');
}
