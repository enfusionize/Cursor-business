import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MAPPView from '../screens/MAPPView';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import JournalScreen from '../screens/JournalScreen';
import DealerScreen from '../screens/DealerScreen';
import MentalModelsScreen from '../screens/MentalModelsScreen';
import WeeklyKicksScreen from '../screens/WeeklyKicksScreen';
import AnchorReflectionScreen from '../screens/AnchorReflectionScreen';
import PortalGateScreen from '../screens/PortalGateScreen';
import CircadianPulseScreen from '../screens/CircadianPulseScreen';
import CohortInvitationScreen from '../screens/CohortInvitationScreen';
import ReminderConfigScreen from '../screens/ReminderConfigScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookReaderScreen from '../screens/BookReaderScreen';
import { COLORS } from '../styles/theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.background, borderTopColor: COLORS.accentGold, height: 66 }
      }}
    >
      <Tab.Screen name="Home"        component={HomeScreen} />
      <Tab.Screen name="Book"        component={BookReaderScreen} />
      <Tab.Screen name="MAPP"        component={MAPPView} />
      <Tab.Screen name="Analytics"   component={AnalyticsScreen} />
      <Tab.Screen name="Journal"     component={JournalScreen} />
      <Tab.Screen name="Dealer"      component={DealerScreen} />
      <Tab.Screen name="Models"      component={MentalModelsScreen} />
      <Tab.Screen name="Weekly"      component={WeeklyKicksScreen} />
      <Tab.Screen name="Anchors"     component={AnchorReflectionScreen} />
      <Tab.Screen name="Portals"     component={PortalGateScreen} />
      <Tab.Screen name="Circadian"   component={CircadianPulseScreen} />
      <Tab.Screen name="Cohort"      component={CohortInvitationScreen} />
      <Tab.Screen name="Reminders"   component={ReminderConfigScreen} />
      <Tab.Screen name="Settings"    component={SettingsScreen} />
    </Tab.Navigator>
  );
}