import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import MainTabs from './src/navigation/MainTabs';
import IntakeScreen from './src/screens/IntakeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SpaceCreationScreen from './src/screens/SpaceCreationScreen';
import SpacesScreen from './src/screens/SpacesScreen';
import { COLORS } from './src/styles/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Intake" component={IntakeScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="SpaceCreation" component={SpaceCreationScreen} />
          <Stack.Screen name="Spaces" component={SpacesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}