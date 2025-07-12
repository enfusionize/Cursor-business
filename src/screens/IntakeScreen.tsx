import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

export default function IntakeScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  function handleComplete() {
    // Save to SecureStore in real app
    navigation.replace('Main');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SHIFT</Text>
      <Text style={styles.subtitle}>Let's begin your 68-day journey</Text>
      
      <TextInput
        placeholder="Your name"
        placeholderTextColor={COLORS.textSecondary}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        placeholder="What's your primary goal?"
        placeholderTextColor={COLORS.textSecondary}
        value={goal}
        onChangeText={setGoal}
        style={styles.input}
        multiline
      />
      
      <Button 
        title="Begin Journey" 
        color={COLORS.accentGold} 
        onPress={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24
  },
  title: { 
    fontFamily: FONTS.heading, 
    fontSize: 32, 
    color: COLORS.accentGold, 
    marginBottom: 8 
  },
  subtitle: { 
    fontFamily: FONTS.body, 
    fontSize: 16, 
    color: COLORS.textPrimary, 
    marginBottom: 32,
    textAlign: 'center'
  },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.textPrimary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontFamily: FONTS.body,
    width: '100%'
  }
});