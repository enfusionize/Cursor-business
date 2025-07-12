#!/bin/bash

echo "🚀 Setting up SHIFT Framework Space Management System..."

# Install new backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install mongoose bcryptjs jsonwebtoken

# Install new frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ..
npm install @react-native-async-storage/async-storage

# Create MongoDB setup instructions
echo "🗄️ MongoDB Setup Instructions:"
echo "1. Install MongoDB locally or use MongoDB Atlas"
echo "2. Create a database named 'shift-framework'"
echo "3. Set MONGODB_URI in your environment variables"
echo "   - Local: mongodb://localhost:27017/shift-framework"
echo "   - Atlas: mongodb+srv://username:password@cluster.mongodb.net/shift-framework"

# Create environment file template
echo "🔧 Creating .env template..."
cat > .env.template << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/shift-framework

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001

# Optional: MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shift-framework
EOF

echo "✅ Space Management System setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy .env.template to .env and configure your settings"
echo "2. Start MongoDB (local or Atlas)"
echo "3. Run 'npm run dev' to start the backend"
echo "4. Run 'npm start' to start the frontend"
echo "5. Test the space creation functionality"
echo ""
echo "🎯 Features Available:"
echo "- User registration and authentication"
echo "- One-click space creation with templates"
echo "- Dynamic feature control per space"
echo "- Space switching and management"
echo "- Progress tracking per space"
echo "- Analytics and insights"
echo ""
echo "📚 Documentation: See SPACE_MANAGEMENT.md for detailed information"