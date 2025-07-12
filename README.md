# SHIFT Framework App

A complete React Native/Expo mobile application for the 68-day SHIFT Framework journey, featuring mental models, journaling, analytics, and a comprehensive book reader.

## Features

### Core Framework
- **68-Day Program**: Complete book reader with all program pages
- **Mental Models**: Interactive library of cognitive frameworks
- **Journal**: Daily reflection and progress tracking
- **Analytics**: Progress visualization and insights
- **MAPP Quadrant**: Mindset, Action, Physical, Purpose tracking
- **Model Dealer**: AI-powered mental model suggestions
- **Community**: Cohort and community features
- **Settings**: Customizable notifications and preferences

### 🆕 Space Management System
- **One-Click Space Creation**: Instant personalized spaces with templates
- **Dynamic Feature Control**: Backend-controlled feature access per space
- **Multi-Space Support**: Create and manage multiple SHIFT journeys
- **Template System**: Pre-configured spaces (Personal, Professional, Minimal)
- **Progress Isolation**: Separate progress tracking per space
- **User Authentication**: Secure JWT-based authentication
- **Space Switching**: Seamless transitions between spaces
- **Analytics Per Space**: Individual progress and usage analytics

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Navigation**: React Navigation
- **Styling**: Custom theme with mystical gold accents
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data
- **HTTP Client**: Axios for API communication

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Expo CLI (for mobile development)

### 1. Setup Space Management System
```bash
# Run the setup script
./setup-spaces.sh

# Or manually install dependencies
npm install
cd backend && npm install mongoose bcryptjs jsonwebtoken
cd .. && npm install @react-native-async-storage/async-storage
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.template .env

# Edit .env with your settings
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Your secret key for JWT tokens
# - PORT: Backend server port (default: 3001)
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. Start the Backend
```bash
npm run dev
```

### 5. Start the Frontend
```bash
npm start
```

### 6. Run on Device/Simulator
- iOS: `npm run ios`
- Android: `npm run android`

### 7. Test the System
```bash
# Run comprehensive tests
node test-spaces.js
```

### Development

- **Frontend**: `npm start` - Starts Expo development server
- **Backend**: `npm run server` - Starts Express API server
- **Both**: `npm run dev` - Starts both servers concurrently

### API Endpoints

#### Core Endpoints
- `GET /api/v1/health` - Health check
- `POST /api/v1/deal` - Mental model suggestions

#### 🆕 Space Management Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/spaces/create` - Create new space
- `GET /api/v1/spaces` - Get user spaces
- `POST /api/v1/spaces/switch/:spaceId` - Switch active space
- `GET /api/v1/spaces/:spaceId/features` - Get space features
- `PUT /api/v1/spaces/:spaceId/config` - Update space configuration
- `POST /api/v1/spaces/templates/:template` - Create from template

## Project Structure

```
shift-framework-app/
├── backend/
│   ├── server.js              # Express server
│   ├── models/
│   │   └── User.js           # User and space models
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── spaces.js         # Space management routes
│   │   ├── deal.js           # Mental model API
│   │   └── health.js         # Health check
│   └── services/
│       ├── spaceService.js   # Space management logic
│       ├── mentalModels.js   # Model database
│       └── constraintSolver.js # AI ranking logic
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── navigation/
│   │   └── MainTabs.tsx      # Tab navigation
│   ├── screens/
│   │   ├── LoginScreen.tsx   # User authentication
│   │   ├── RegisterScreen.tsx # User registration
│   │   ├── SpaceCreationScreen.tsx # Space creation
│   │   ├── SpacesScreen.tsx  # Space management
│   │   ├── HomeScreen.tsx    # Welcome screen
│   │   ├── BookReaderScreen.tsx # 68-day content
│   │   ├── JournalScreen.tsx # Daily reflections
│   │   ├── DealerScreen.tsx  # Model suggestions
│   │   └── ...               # Other screens
│   ├── styles/
│   │   └── theme.ts          # Design system
│   └── data/
│       └── pages.ts          # Book content
├── assets/
│   ├── pages/                # Book page images
│   └── treeBg.png           # Home background
├── App.tsx                   # Main app component
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── setup-spaces.sh           # Space system setup script
├── test-spaces.js            # Space system tests
├── SPACE_MANAGEMENT.md       # Detailed documentation
└── .env.template             # Environment template
```

## Design System

The app uses a mystical theme with:
- **Background**: Deep navy (#070D1B)
- **Accent**: Gold (#D4AF37)
- **Text**: Light colors for contrast
- **Fonts**: Cinzel (headings), OpenSans (body)

## Features in Detail

### Book Reader
- Horizontal swipe navigation through all 68 days
- High-quality page images
- Progress tracking
- Day-by-day content delivery

### Mental Models
- 10 core cognitive frameworks
- Interactive explanations
- Domain-specific suggestions
- AI-powered model selection

### Journal
- Daily reflection prompts
- Rich text input
- Entry history
- Export capabilities

### Analytics
- Progress visualization
- Habit tracking
- Mood trends
- Completion statistics

### MAPP Quadrant
- Mindset tracking
- Action planning
- Physical wellness
- Purpose alignment

## Deployment

### Backend
The Express server can be deployed to:
- Heroku
- Vercel
- AWS
- Railway

### Mobile App
Use Expo EAS Build for:
- iOS App Store
- Google Play Store
- Internal distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## 🆕 Space Management System

The SHIFT Framework now includes a comprehensive space management system that allows users to create multiple personalized instances of the app with different configurations and feature access.

### Key Features
- **One-Click Creation**: Instant spaces with pre-configured templates
- **Dynamic Features**: Backend-controlled feature access per space
- **Progress Isolation**: Separate tracking for each space
- **Template System**: Personal, Professional, and Minimal templates
- **User Authentication**: Secure JWT-based authentication
- **Space Switching**: Seamless transitions between spaces

### Quick Start for Spaces
```bash
# Setup the space management system
./setup-spaces.sh

# Configure environment
cp .env.template .env

# Start MongoDB and servers
npm run dev

# Test the system
node test-spaces.js
```

### Documentation
For detailed information about the space management system, see [SPACE_MANAGEMENT.md](SPACE_MANAGEMENT.md).

## Support

For support, email support@shiftframework.com or create an issue in the repository.