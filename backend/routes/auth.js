import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SpaceService from '../services/spaceService.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'shift-framework-secret';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    const result = await SpaceService.createUser({ email, name, password });
    
    res.status(201).json({
      message: 'User created successfully',
      user: result.user,
      token: result.token,
      activeSpace: result.activeSpace
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.auth.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update login info
    user.auth.lastLogin = new Date();
    user.auth.loginCount += 1;
    await user.save();

    // Get active space
    const activeSpace = user.getActiveSpace();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, spaceId: activeSpace?.spaceId },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        spaces: user.spaces
      },
      token,
      activeSpace
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeSpace = user.getActiveSpace();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        spaces: user.spaces,
        preferences: user.preferences,
        subscription: user.subscription
      },
      activeSpace
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeSpace = user.getActiveSpace();
    
    const newToken = jwt.sign(
      { userId: user._id, spaceId: activeSpace?.spaceId },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token: newToken,
      activeSpace
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

export { authenticateToken };
export default router;