import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { loadEnv } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
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

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests. Please try again later.',
  },
});

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/api', generalApiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/analyze-code', aiLimiter);
app.use('/api/chat', aiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/analyze-code', analyzeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/saved-problems', savedProblemRouter);
app.use('/api/stats', statsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, env.host, () => {
  console.log(`AlgoAnalyze AI API listening on http://${env.host}:${env.port}`);
  console.log(`Allowed client origin: ${env.clientUrl}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down AlgoAnalyze AI API...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('HTTP server closed and Prisma disconnected.');
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
