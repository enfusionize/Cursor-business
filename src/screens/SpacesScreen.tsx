import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS } from '../styles/theme';

export default function SpacesScreen({ navigation }: any) {
  const { user, activeSpace, switchSpace, logout } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchSpace = async (spaceId: string) => {
    setIsSwitching(true);
    try {
      await switchSpace(spaceId);
      Alert.alert('Success', 'Space switched successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const renderSpaceItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.spaceCard,
        item.spaceId === activeSpace?.spaceId && styles.activeSpaceCard
      ]}
      onPress={() => handleSwitchSpace(item.spaceId)}
      disabled={isSwitching}
    >
      <View style={styles.spaceHeader}>
        <Text style={styles.spaceName}>{item.name}</Text>
        {item.spaceId === activeSpace?.spaceId && (
          <Text style={styles.activeBadge}>Active</Text>
        )}
      </View>
      
      <Text style={styles.spaceDescription}>{item.description}</Text>
      
      <View style={styles.spaceStats}>
        <Text style={styles.statText}>
          Day {item.progress.currentDay} of {item.progress.totalDays}
        </Text>
        <Text style={styles.statText}>
          {item.progress.journalEntries} journal entries
        </Text>
      </View>
      
      <View style={styles.spaceFeatures}>
        {Object.entries(item.config.features)
          .filter(([_, enabled]) => enabled)
          .slice(0, 3)
          .map(([feature, _]) => (
            <Text key={feature} style={styles.featureTag}>
              {feature.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Spaces</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('SpaceCreation')}
        >
          <Text style={styles.createButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {user?.spaces && user.spaces.length > 0 ? (
        <FlatList
          data={user.spaces}
          renderItem={renderSpaceItem}
          keyExtractor={(item) => item.spaceId}
          contentContainerStyle={styles.spacesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Spaces Yet</Text>
          <Text style={styles.emptyDescription}>
            Create your first SHIFT space to begin your journey
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => navigation.navigate('SpaceCreation')}
          >
            <Text style={styles.createFirstButtonText}>Create Your First Space</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBg
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary
  },
  createButton: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6
  },
  createButtonText: {
    color: COLORS.background,
    fontFamily: FONTS.body,
    fontWeight: 'bold'
  },
  spacesList: {
    padding: 16
  },
  spaceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  activeSpaceCard: {
    borderWidth: 2,
    borderColor: COLORS.accentGold
  },
  spaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  spaceName: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary
  },
  activeBadge: {
    backgroundColor: COLORS.accentGold,
    color: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: FONTS.body,
    fontWeight: 'bold'
  },
  spaceDescription: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 12
  },
  spaceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  statText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary
  },
  spaceFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  featureTag: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: FONTS.body,
    marginRight: 8,
    marginBottom: 4
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  createFirstButton: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  createFirstButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.heading,
    fontWeight: 'bold'
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBg
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.body
  }
});