import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Analytics</Text>
      <Text style={styles.placeholder}>Charts & insights will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  heading: { fontFamily: FONTS.heading, color: COLORS.accentGold, fontSize: 26, marginBottom: 24 },
  placeholder: { fontFamily: FONTS.body, color: COLORS.textSecondary }
});