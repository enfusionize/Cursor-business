import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function MAPPView() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MAPP Quadrant</Text>
      <View style={styles.quadrantRow}>
        <View style={styles.cell}><Text style={styles.cellTxt}>Mindset</Text></View>
        <View style={styles.cell}><Text style={styles.cellTxt}>Action</Text></View>
      </View>
      <View style={styles.quadrantRow}>
        <View style={styles.cell}><Text style={styles.cellTxt}>Physical</Text></View>
        <View style={styles.cell}><Text style={styles.cellTxt}>Purpose</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  heading: { fontSize: 26, color: COLORS.accentGold, fontFamily: FONTS.heading, marginBottom: 24, alignSelf: 'center' },
  quadrantRow: { flex: 1, flexDirection: 'row' },
  cell: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    margin: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellTxt: { color: COLORS.textPrimary, fontFamily: FONTS.body, fontSize: 18 }
});