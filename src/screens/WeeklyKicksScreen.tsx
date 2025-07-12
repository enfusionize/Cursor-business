import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function WeeklyKicksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weekly Kicks</Text>
      <Text style={styles.text}>Weekly challenges and momentum builders.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  heading: { fontFamily: FONTS.heading, fontSize: 26, color: COLORS.accentGold, marginBottom: 12 },
  text: { fontFamily: FONTS.body, color: COLORS.textPrimary }
});