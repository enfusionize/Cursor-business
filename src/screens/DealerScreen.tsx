import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { COLORS, FONTS } from '../styles/theme';

export default function DealerScreen() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      const res = await axios.post('http://localhost:3001/api/v1/deal', {
        problem,
        context: { domains: ['strategy'], urgency: 5, recent: [] }
      });
      setAnswer(res.data.summary);
    } catch (err) {
      setAnswer('Error contacting server.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Model Dealer</Text>
      <TextInput
        placeholder="Describe your challenge..."
        placeholderTextColor={COLORS.textSecondary}
        value={problem}
        onChangeText={setProblem}
        style={styles.input}
      />
      <Button title="Deal Me a Model" color={COLORS.accentGold} onPress={handleSubmit} />
      {answer && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  heading: { fontFamily: FONTS.heading, color: COLORS.accentGold, fontSize: 26, marginBottom: 24 },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.textPrimary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontFamily: FONTS.body
  },
  answer: { marginTop: 16, color: COLORS.textPrimary, fontFamily: FONTS.body }
});