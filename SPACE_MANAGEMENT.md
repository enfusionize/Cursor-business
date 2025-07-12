# SHIFT Framework Space Management System

## Overview

The SHIFT Framework App now includes a comprehensive space management system that allows users to create multiple personalized instances of the app with different configurations, features, and content access. This system enables dynamic feature control and personalized user experiences.

## 🚀 One-Click Space Creation

### Quick Templates
Users can instantly create new spaces using pre-configured templates:

1. **Personal Growth** 🌟
   - Full feature set
   - Mystical theme
   - Complete 68-day program
   - All mental models and tools

2. **Professional Development** 💼
   - Career-focused features
   - Corporate theme
   - Enhanced analytics
   - Community features enabled

3. **Minimal Focus** 🎯
   - Streamlined experience
   - Essential features only
   - Clean, distraction-free interface

### Custom Spaces
Users can create fully customized spaces with:
- Custom names and descriptions
- Feature toggles
- Theme selection
- Permission controls

## 🏗️ Architecture

### Backend Components

#### User Model (`backend/models/User.js`)
```javascript
{
  email: String,
  name: String,
  spaces: [{
    spaceId: String,
    name: String,
    description: String,
    config: {
      theme: String,
      features: Object,
      permissions: Object
    },
    progress: Object,
    data: Object
  }]
}
```

#### Space Service (`backend/services/spaceService.js`)
- User registration with initial space
- Space creation and management
- Feature access control
- Progress tracking
- Analytics management

#### API Endpoints
- `POST /api/v1/auth/register` - Create user with initial space
- `POST /api/v1/auth/login` - Authenticate and get active space
- `POST /api/v1/spaces/create` - Create new space
- `POST /api/v1/spaces/switch/:spaceId` - Switch active space
- `GET /api/v1/spaces/:spaceId/features` - Get space features
- `PUT /api/v1/spaces/:spaceId/config` - Update space configuration

### Frontend Components

#### Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages user state and authentication
- Handles space switching
- Provides space creation methods
- Manages JWT tokens

#### Space Management Screens
- `SpaceCreationScreen.tsx` - One-click space creation
- `SpacesScreen.tsx` - Space listing and switching
- `LoginScreen.tsx` - User authentication
- `RegisterScreen.tsx` - User registration

## 🔧 Feature Control System

### Dynamic Feature Access
Each space can have different features enabled/disabled:

```javascript
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
  cohortInvitation: true,
  reminderConfig: true,
  settings: true
}
```

### Permission System
```javascript
permissions: {
  canCreateSpaces: false,
  canInviteUsers: false,
  canManageContent: false,
  canViewAnalytics: true
}
```

### Theme Support
- **Mystical**: Gold accents, deep navy background
- **Corporate**: Professional, clean interface
- **Minimal**: Distraction-free, focused design
- **Custom**: User-defined themes

## 📊 Progress Tracking

### Per-Space Progress
Each space maintains its own progress:
- Current day in the 68-day program
- Completed days tracking
- Journal entry count
- Mental model usage
- Activity streaks

### Analytics
- Mood trends over time
- Completion rates
- Feature usage statistics
- Progress visualization

## 🔄 Space Switching

### Seamless Transitions
- Instant space switching
- Preserved progress per space
- Feature availability updates
- Theme changes
- Content access control

### State Management
- Active space tracking
- User preferences per space
- Configuration persistence
- Real-time updates

## 🎯 Use Cases

### Individual Users
- Multiple personal development journeys
- Different focus areas (career, health, relationships)
- A/B testing different approaches
- Progress comparison across spaces

### Organizations
- Team-specific spaces
- Role-based feature access
- Progress tracking per department
- Custom content and branding

### Coaches & Mentors
- Client-specific spaces
- Progress monitoring
- Customized content delivery
- Analytics and insights

## 🚀 Quick Start

### 1. User Registration
```javascript
// Create user with initial space
const response = await axios.post('/api/v1/auth/register', {
  email: 'user@example.com',
  name: 'John Doe',
  password: 'securepassword'
});
```

### 2. Create New Space
```javascript
// Quick template creation
const newSpace = await createSpace({
  name: 'Career Growth',
  description: 'Professional development focus',
  config: {
    theme: 'corporate',
    features: {
      mentalModels: true,
      journal: true,
      analytics: true,
      bookReader: true
    }
  }
});
```

### 3. Switch Spaces
```javascript
// Switch to different space
await switchSpace('space_1234567890');
```

### 4. Update Configuration
```javascript
// Update space features
await updateSpaceConfig('space_1234567890', {
  features: {
    mentalModels: true,
    journal: false,
    analytics: true
  }
});
```

## 🔒 Security & Privacy

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token refresh mechanism
- Session management

### Data Isolation
- Per-space data separation
- User-specific content access
- Progress isolation
- Analytics privacy

### Permissions
- Role-based access control
- Feature-level permissions
- Content management controls
- User invitation system

## 📈 Analytics & Insights

### Space Analytics
- Feature usage tracking
- Progress metrics
- User engagement
- Completion rates

### Business Intelligence
- User behavior patterns
- Feature popularity
- Space creation trends
- Performance metrics

## 🔄 Evolution & Updates

### Dynamic Feature Updates
- Backend-controlled feature access
- Real-time feature toggles
- A/B testing capabilities
- Gradual rollouts

### Content Management
- Dynamic content delivery
- Space-specific content
- Version control
- Content scheduling

### User Experience
- Seamless updates
- Backward compatibility
- Migration tools
- User onboarding

## 🛠️ Development

### Backend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Database setup
# Ensure MongoDB is running locally or set MONGODB_URI
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on device/simulator
npm run ios
npm run android
```

### Environment Variables
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/shift-framework
JWT_SECRET=your-secret-key
PORT=3001
```

## 🎯 Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Team collaboration tools
- Content management system
- Advanced permission system
- Real-time notifications
- Offline support
- Data export/import
- API rate limiting
- Advanced security features

### Integration Possibilities
- Third-party authentication
- Payment processing
- Email notifications
- Push notifications
- Social media integration
- Calendar integration
- File upload system
- Video content support

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Space Management Endpoints
- `POST /api/v1/spaces/create` - Create new space
- `GET /api/v1/spaces` - Get user spaces
- `POST /api/v1/spaces/switch/:spaceId` - Switch active space
- `GET /api/v1/spaces/:spaceId/features` - Get space features
- `PUT /api/v1/spaces/:spaceId/config` - Update space config
- `PUT /api/v1/spaces/:spaceId/progress` - Update progress
- `POST /api/v1/spaces/:spaceId/journal` - Add journal entry
- `GET /api/v1/spaces/:spaceId/analytics` - Get analytics
- `DELETE /api/v1/spaces/:spaceId` - Delete space

### Template Endpoints
- `POST /api/v1/spaces/templates/:template` - Create from template

## 🎉 Success Metrics

### User Engagement
- Space creation rate
- Feature usage statistics
- Progress completion rates
- User retention metrics

### Business Metrics
- User acquisition
- Conversion rates
- Revenue per user
- Customer satisfaction

### Technical Metrics
- API response times
- Error rates
- Database performance
- System uptime

---

**The SHIFT Framework Space Management System provides a powerful foundation for personalized user experiences with dynamic feature control and comprehensive progress tracking.**