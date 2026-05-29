import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

const TABS = [
  { name: 'Home', label: 'Ana Sayfa', icon: 'home-outline', iconActive: 'home' },
  { name: 'Theme', label: 'Temalar', icon: 'color-palette-outline', iconActive: 'color-palette' },
  { name: 'Smart', label: 'Uyku', icon: 'moon-outline', iconActive: 'moon' },
  { name: 'Settings', label: 'Ayarlar', icon: 'settings-outline', iconActive: 'settings' },
];

export default function BottomNav({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const tab = TABS.find(t => t.name === route.name) || TABS[0];
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            {focused && <View style={styles.activeIndicator} />}
            <Ionicons
              name={focused ? tab.iconActive : tab.icon}
              size={22}
              color={focused ? COLORS.gold : COLORS.textMuted}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 12,
  },
  tab: {
    flex: 1, alignItems: 'center', gap: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 28, height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
  },
  label: {
    fontSize: 9, color: COLORS.textMuted,
    letterSpacing: 0.5, fontFamily: 'sans-serif-medium',
  },
  labelActive: { color: COLORS.gold },
});
