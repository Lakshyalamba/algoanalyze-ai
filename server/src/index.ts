import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { loadEnv } from './config/env.js';
import { analyzeRouter } from './routes/analyze.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { chatRouter } from './routes/chat.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { savedProblemRouter } from './routes/savedProblem.routes.js';
import { statsRouter } from './routes/stats.routes.js';

dotenv.config();

let env: ReturnType<typeof loadEnv>;

try {
  env = loadEnv();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Failed to load server environment.');
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/analyze-code', analyzeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/saved-problems', savedProblemRouter);
app.use('/api/stats', statsRouter);

app.listen(env.port, () => {
  console.log(`AlgoAnalyze AI API listening on port ${env.port}`);
});
