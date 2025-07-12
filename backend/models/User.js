import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Core user info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // Space/Instance management
  spaces: [{
    spaceId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    config: {
      theme: {
        type: String,
        enum: ['mystical', 'minimal', 'corporate', 'custom'],
        default: 'mystical'
      },
      features: {
        mentalModels: { type: Boolean, default: true },
        journal: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true },
        bookReader: { type: Boolean, default: true },
        mappQuadrant: { type: Boolean, default: true },
        modelDealer: { type: Boolean, default: true },
        weeklyKicks: { type: Boolean, default: true },
        anchorReflection: { type: Boolean, default: true },
        portalGates: { type: Boolean, default: true },
        circadianPulse: { type: Boolean, default: true },
        cohortInvitation: { type: Boolean, default: true },
        reminderConfig: { type: Boolean, default: true },
        settings: { type: Boolean, default: true }
      },
      content: {
        bookPages: { type: Boolean, default: true },
        mentalModels: { type: Boolean, default: true },
        journalPrompts: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true }
      },
      permissions: {
        canCreateSpaces: { type: Boolean, default: false },
        canInviteUsers: { type: Boolean, default: false },
        canManageContent: { type: Boolean, default: false },
        canViewAnalytics: { type: Boolean, default: true }
      }
    },
    progress: {
      currentDay: { type: Number, default: 1 },
      totalDays: { type: Number, default: 68 },
      completedDays: [Number],
      journalEntries: { type: Number, default: 0 },
      mentalModelsUsed: [String],
      lastActivity: { type: Date, default: Date.now }
    },
    data: {
      journalEntries: [{
        id: String,
        content: String,
        mood: Number,
        tags: [String],
        createdAt: { type: Date, default: Date.now }
      }],
      mentalModelUsage: [{
        modelId: String,
        usageCount: Number,
        lastUsed: Date
      }],
      analytics: {
        moodTrends: [Number],
        activityStreak: Number,
        completionRate: Number
      }
    }
  }],
  
  // User preferences and settings
  preferences: {
    notifications: {
      dailyReminder: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      milestoneAlerts: { type: Boolean, default: true }
    },
    privacy: {
      shareProgress: { type: Boolean, default: false },
      allowAnalytics: { type: Boolean, default: true }
    }
  },
  
  // Subscription and access control
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    features: [String],
    expiresAt: Date,
    isActive: { type: Boolean, default: true }
  },
  
  // Security and authentication
  auth: {
    passwordHash: String,
    resetToken: String,
    resetTokenExpires: Date,
    lastLogin: Date,
    loginCount: { type: Number, default: 0 }
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate space ID
userSchema.methods.generateSpaceId = function() {
  return `space_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create new space
userSchema.methods.createSpace = function(spaceData) {
  const spaceId = this.generateSpaceId();
  const newSpace = {
    spaceId,
    name: spaceData.name || 'New SHIFT Space',
    description: spaceData.description || '',
    config: {
      ...this.schema.path('spaces.0.config').defaultValue(),
      ...spaceData.config
    },
    progress: {
      ...this.schema.path('spaces.0.progress').defaultValue()
    },
    data: {
      ...this.schema.path('spaces.0.data').defaultValue()
    }
  };
  
  this.spaces.push(newSpace);
  return newSpace;
};

// Get active space
userSchema.methods.getActiveSpace = function() {
  return this.spaces.find(space => space.isActive) || this.spaces[0];
};

// Update space progress
userSchema.methods.updateProgress = function(spaceId, progressData) {
  const space = this.spaces.find(s => s.spaceId === spaceId);
  if (space) {
    Object.assign(space.progress, progressData);
    space.progress.lastActivity = new Date();
  }
  return space;
};

export default mongoose.model('User', userSchema);