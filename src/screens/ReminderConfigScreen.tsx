import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function ReminderConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reminder Settings</Text>
      <Text style={styles.text}>Configure your daily notifications and reminders.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  heading: { fontFamily: FONTS.heading, fontSize: 26, color: COLORS.accentGold, marginBottom: 12 },
  text: { fontFamily: FONTS.body, color: COLORS.textPrimary }
});