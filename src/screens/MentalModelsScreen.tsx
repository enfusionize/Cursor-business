import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';
import { MODEL_DB } from '../../backend/services/mentalModels.js';

export default function MentalModelsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MODEL_DB}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontFamily: FONTS.heading, color: COLORS.accentGold, fontSize: 18, marginBottom: 4 },
  desc: { fontFamily: FONTS.body, color: COLORS.textPrimary, fontSize: 14 }
});