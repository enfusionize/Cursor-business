import express from 'express';
import morgan from 'morgan';
import dealRouter from './routes/deal.js';
import healthRouter from './routes/health.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/deal', dealRouter);
app.use('/api/v1/health', healthRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});