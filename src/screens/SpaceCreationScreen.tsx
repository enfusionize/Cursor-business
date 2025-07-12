import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS } from '../styles/theme';

export default function SpaceCreationScreen({ navigation }: any) {
  const { createSpace } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    {
      id: 'personal',
      name: 'Personal Growth',
      description: 'Your personal 68-day transformation journey',
      icon: '🌟',
      features: ['Mental Models', 'Journal', 'Analytics', 'Book Reader']
    },
    {
      id: 'professional',
      name: 'Professional Development',
      description: 'Career-focused growth and skill development',
      icon: '💼',
      features: ['Mental Models', 'Journal', 'Analytics', 'MAPP Quadrant']
    },
    {
      id: 'minimal',
      name: 'Minimal Focus',
      description: 'Streamlined experience for focused growth',
      icon: '🎯',
      features: ['Mental Models', 'Journal', 'Book Reader']
    }
  ];

  const handleCreateSpace = async (templateId?: string) => {
    if (!name.trim() && !templateId) {
      Alert.alert('Error', 'Please enter a space name');
      return;
    }

    setIsCreating(true);
    try {
      let spaceData = {
        name: name || 'New SHIFT Space',
        description: description || ''
      };

      if (templateId) {
        // Use template
        const template = templates.find(t => t.id === templateId);
        spaceData = {
          name: template?.name || name,
          description: template?.description || description,
          config: {
            theme: templateId === 'professional' ? 'corporate' : 
                   templateId === 'minimal' ? 'minimal' : 'mystical'
          }
        };
      }

      await createSpace(spaceData);
      Alert.alert('Success', 'Space created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickCreate = async (templateId: string) => {
    setIsCreating(true);
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      await createSpace({
        name: template.name,
        description: template.description,
        config: {
          theme: templateId === 'professional' ? 'corporate' : 
                 templateId === 'minimal' ? 'minimal' : 'mystical'
        }
      });

      Alert.alert('Success', `${template.name} space created!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Space</Text>
      
      {/* Quick Templates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Templates</Text>
        <Text style={styles.sectionSubtitle}>One-click space creation</Text>
        
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={styles.templateCard}
            onPress={() => handleQuickCreate(template.id)}
            disabled={isCreating}
          >
            <Text style={styles.templateIcon}>{template.icon}</Text>
            <View style={styles.templateContent}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
              <View style={styles.featuresList}>
                {template.features.map((feature, index) => (
                  <Text key={index} style={styles.feature}>
                    • {feature}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Space */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Space</Text>
        <Text style={styles.sectionSubtitle}>Create your own configuration</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Space Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter space name"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your space"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.disabledButton]}
          onPress={() => handleCreateSpace()}
          disabled={isCreating}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? 'Creating...' : 'Create Custom Space'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.heading,
    color: COLORS.accentGold,
    textAlign: 'center',
    marginBottom: 24
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 16
  },
  templateCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  templateIcon: {
    fontSize: 32,
    marginRight: 16
  },
  templateContent: {
    flex: 1
  },
  templateName: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  templateDescription: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 8
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  feature: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.accentGold,
    marginRight: 12
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textPrimary,
    fontFamily: FONTS.body,
    fontSize: 16
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  createButton: {
    backgroundColor: COLORS.accentGold,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16
  },
  disabledButton: {
    opacity: 0.6
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.heading,
    fontWeight: 'bold'
  }
});