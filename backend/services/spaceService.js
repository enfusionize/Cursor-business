import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'shift-framework-secret';

export class SpaceService {
  
  // Create new user with initial space
  static async createUser(userData) {
    try {
      const { email, name, password } = userData;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);
      
      // Create user with initial space
      const user = new User({
        email,
        name,
        auth: { passwordHash },
        spaces: []
      });
      
      // Create initial space
      const initialSpace = user.createSpace({
        name: 'My SHIFT Journey',
        description: 'Your personal 68-day transformation space'
      });
      
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, spaceId: initialSpace.spaceId },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          spaces: user.spaces
        },
        token,
        activeSpace: initialSpace
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  
  // Create new space for existing user
  static async createSpace(userId, spaceData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if user can create spaces
      const activeSpace = user.getActiveSpace();
      if (activeSpace && !activeSpace.config.permissions.canCreateSpaces) {
        throw new Error('Insufficient permissions to create spaces');
      }
      
      // Deactivate current active space
      user.spaces.forEach(space => {
        space.isActive = false;
      });
      
      // Create new space
      const newSpace = user.createSpace(spaceData);
      newSpace.isActive = true;
      
      await user.save();
      
      return newSpace;
    } catch (error) {
      throw new Error(`Failed to create space: ${error.message}`);
    }
  }
  
  // Get user's spaces
  static async getUserSpaces(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return user.spaces;
    } catch (error) {
      throw new Error(`Failed to get spaces: ${error.message}`);
    }
  }
  
  // Switch active space
  static async switchSpace(userId, spaceId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Deactivate all spaces
      user.spaces.forEach(space => {
        space.isActive = false;
      });
      
      // Activate target space
      const targetSpace = user.spaces.find(space => space.spaceId === spaceId);
      if (!targetSpace) {
        throw new Error('Space not found');
      }
      
      targetSpace.isActive = true;
      await user.save();
      
      return targetSpace;
    } catch (error) {
      throw new Error(`Failed to switch space: ${error.message}`);
    }
  }
  
  // Update space configuration
  static async updateSpaceConfig(userId, spaceId, config) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const space = user.spaces.find(s => s.spaceId === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }
      
      // Update configuration
      Object.assign(space.config, config);
      await user.save();
      
      return space;
    } catch (error) {
      throw new Error(`Failed to update space config: ${error.message}`);
    }
  }
  
  // Get space features and permissions
  static async getSpaceFeatures(userId, spaceId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const space = user.spaces.find(s => s.spaceId === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }
      
      return {
        features: space.config.features,
        permissions: space.config.permissions,
        theme: space.config.theme,
        content: space.config.content
      };
    } catch (error) {
      throw new Error(`Failed to get space features: ${error.message}`);
    }
  }
  
  // Update space progress
  static async updateProgress(userId, spaceId, progressData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const space = user.spaces.find(s => s.spaceId === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }
      
      // Update progress
      Object.assign(space.progress, progressData);
      space.progress.lastActivity = new Date();
      
      await user.save();
      
      return space.progress;
    } catch (error) {
      throw new Error(`Failed to update progress: ${error.message}`);
    }
  }
  
  // Add journal entry
  static async addJournalEntry(userId, spaceId, entryData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const space = user.spaces.find(s => s.spaceId === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }
      
      const entry = {
        id: `entry_${Date.now()}`,
        content: entryData.content,
        mood: entryData.mood || 5,
        tags: entryData.tags || [],
        createdAt: new Date()
      };
      
      space.data.journalEntries.push(entry);
      space.progress.journalEntries = space.data.journalEntries.length;
      
      await user.save();
      
      return entry;
    } catch (error) {
      throw new Error(`Failed to add journal entry: ${error.message}`);
    }
  }
  
  // Get space analytics
  static async getSpaceAnalytics(userId, spaceId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const space = user.spaces.find(s => s.spaceId === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }
      
      return {
        progress: space.progress,
        analytics: space.data.analytics,
        journalCount: space.data.journalEntries.length,
        mentalModelUsage: space.data.mentalModelUsage
      };
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }
  
  // Delete space
  static async deleteSpace(userId, spaceId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const spaceIndex = user.spaces.findIndex(s => s.spaceId === spaceId);
      if (spaceIndex === -1) {
        throw new Error('Space not found');
      }
      
      // Don't allow deletion if it's the only space
      if (user.spaces.length === 1) {
        throw new Error('Cannot delete the only space');
      }
      
      user.spaces.splice(spaceIndex, 1);
      
      // If deleted space was active, activate first remaining space
      if (user.spaces.length > 0 && !user.spaces.some(s => s.isActive)) {
        user.spaces[0].isActive = true;
      }
      
      await user.save();
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete space: ${error.message}`);
    }
  }
}

export default SpaceService;