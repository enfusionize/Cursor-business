import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import dealRouter from './routes/deal.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import spacesRouter from './routes/spaces.js';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shift-framework';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/spaces', spacesRouter);
app.use('/api/v1/deal', dealRouter);
app.use('/api/v1/health', healthRouter);

app.listen(PORT, () => {
  console.log(`🚀 SHIFT Framework API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
});