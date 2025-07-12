import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function CircadianPulseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Circadian Pulse</Text>
      <Text style={styles.text}>Daily rhythm and energy optimization.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  heading: { fontFamily: FONTS.heading, fontSize: 26, color: COLORS.accentGold, marginBottom: 12 },
  text: { fontFamily: FONTS.body, color: COLORS.textPrimary }
});