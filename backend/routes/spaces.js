import { Router } from 'express';
import SpaceService from '../services/spaceService.js';
import { authenticateToken } from './auth.js';

const router = Router();

// Create new space (one-click)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, config } = req.body;
    const userId = req.user.userId;

    const spaceData = {
      name: name || 'New SHIFT Space',
      description: description || '',
      config: config || {}
    };

    const newSpace = await SpaceService.createSpace(userId, spaceData);

    res.status(201).json({
      message: 'Space created successfully',
      space: newSpace
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all user spaces
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const spaces = await SpaceService.getUserSpaces(userId);

    res.json({
      spaces,
      count: spaces.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Switch active space
router.post('/switch/:spaceId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;

    const activeSpace = await SpaceService.switchSpace(userId, spaceId);

    res.json({
      message: 'Space switched successfully',
      activeSpace
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get space features and permissions
router.get('/:spaceId/features', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;

    const features = await SpaceService.getSpaceFeatures(userId, spaceId);

    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update space configuration
router.put('/:spaceId/config', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;
    const config = req.body;

    const updatedSpace = await SpaceService.updateSpaceConfig(userId, spaceId, config);

    res.json({
      message: 'Space configuration updated',
      space: updatedSpace
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update space progress
router.put('/:spaceId/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;
    const progressData = req.body;

    const progress = await SpaceService.updateProgress(userId, spaceId, progressData);

    res.json({
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add journal entry
router.post('/:spaceId/journal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;
    const entryData = req.body;

    const entry = await SpaceService.addJournalEntry(userId, spaceId, entryData);

    res.status(201).json({
      message: 'Journal entry added',
      entry
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get space analytics
router.get('/:spaceId/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;

    const analytics = await SpaceService.getSpaceAnalytics(userId, spaceId);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete space
router.delete('/:spaceId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { spaceId } = req.params;

    await SpaceService.deleteSpace(userId, spaceId);

    res.json({
      message: 'Space deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quick space templates
router.post('/templates/:template', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { template } = req.params;
    const { name, description } = req.body;

    const templates = {
      'personal': {
        name: name || 'Personal Growth',
        description: description || 'Your personal 68-day transformation journey',
        config: {
          theme: 'mystical',
          features: {
            mentalModels: true,
            journal: true,
            analytics: true,
            bookReader: true,
            mappQuadrant: true,
            modelDealer: true,
            weeklyKicks: true,
            anchorReflection: true,
            portalGates: true,
            circadianPulse: true,
            cohortInvitation: false,
            reminderConfig: true,
            settings: true
          }
        }
      },
      'professional': {
        name: name || 'Professional Development',
        description: description || 'Career-focused growth and skill development',
        config: {
          theme: 'corporate',
          features: {
            mentalModels: true,
            journal: true,
            analytics: true,
            bookReader: true,
            mappQuadrant: true,
            modelDealer: true,
            weeklyKicks: false,
            anchorReflection: true,
            portalGates: true,
            circadianPulse: false,
            cohortInvitation: true,
            reminderConfig: true,
            settings: true
          }
        }
      },
      'minimal': {
        name: name || 'Minimal Focus',
        description: description || 'Streamlined experience for focused growth',
        config: {
          theme: 'minimal',
          features: {
            mentalModels: true,
            journal: true,
            analytics: false,
            bookReader: true,
            mappQuadrant: false,
            modelDealer: false,
            weeklyKicks: false,
            anchorReflection: false,
            portalGates: false,
            circadianPulse: false,
            cohortInvitation: false,
            reminderConfig: true,
            settings: true
          }
        }
      }
    };

    const templateConfig = templates[template];
    if (!templateConfig) {
      return res.status(400).json({ error: 'Invalid template' });
    }

    const newSpace = await SpaceService.createSpace(userId, templateConfig);

    res.status(201).json({
      message: 'Template space created successfully',
      space: newSpace,
      template
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;