import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function JournalScreen() {
  const [entries, setEntries] = useState<string[]>([]);
  const [text, setText] = useState('');

  function addEntry() {
    if (!text.trim()) return;
    setEntries([{ id: Date.now().toString(), body: text }, ...entries]);
    setText('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write your reflection…"
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        multiline
      />
      <Button title="Save Entry" color={COLORS.accentGold} onPress={addEntry} />
      <FlatList
        data={entries}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => <Text style={styles.entry}>{item.body}</Text>}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.textPrimary,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontFamily: FONTS.body,
    marginBottom: 12
  },
  entry: {
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 8,
    fontFamily: FONTS.body,
    marginBottom: 8
  }
});