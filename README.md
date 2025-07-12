# SHIFT Framework App

A complete React Native/Expo mobile application for the 68-day SHIFT Framework journey, featuring mental models, journaling, analytics, and a comprehensive book reader.

## Features

- **68-Day Program**: Complete book reader with all program pages
- **Mental Models**: Interactive library of cognitive frameworks
- **Journal**: Daily reflection and progress tracking
- **Analytics**: Progress visualization and insights
- **MAPP Quadrant**: Mindset, Action, Physical, Purpose tracking
- **Model Dealer**: AI-powered mental model suggestions
- **Community**: Cohort and community features
- **Settings**: Customizable notifications and preferences

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Navigation**: React Navigation
- **Styling**: Custom theme with mystical gold accents
- **State Management**: React Context API
- **Storage**: Expo SecureStore

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shift-framework-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the Expo development server and the backend API server concurrently.

### Development

- **Frontend**: `npm start` - Starts Expo development server
- **Backend**: `npm run server` - Starts Express API server
- **Both**: `npm run dev` - Starts both servers concurrently

### API Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/deal` - Mental model suggestions

## Project Structure

```
shift-framework-app/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   ├── deal.js           # Mental model API
│   │   └── health.js         # Health check
│   └── services/
│       ├── mentalModels.js   # Model database
│       └── constraintSolver.js # AI ranking logic
├── src/
│   ├── navigation/
│   │   └── MainTabs.tsx      # Tab navigation
│   ├── screens/
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
└── package.json              # Dependencies
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

## Support

For support, email support@shiftframework.com or create an issue in the repository.