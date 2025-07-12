import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';
const treeBg = require('../../assets/treeBg.png');

export default function HomeScreen() {
  return (
    <ImageBackground source={treeBg} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to SHIFT</Text>
        <Text style={styles.sub}>
          Begin your 68-day journey of awakening, purpose, and momentum.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontFamily: FONTS.heading, fontSize: 32, color: COLORS.accentGold, marginBottom: 12 },
  sub: { fontFamily: FONTS.body, fontSize: 16, color: COLORS.textPrimary, textAlign: 'center' }
});