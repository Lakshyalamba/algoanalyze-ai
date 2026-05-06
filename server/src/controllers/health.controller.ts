import type { Request, Response } from 'express';

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({
    status: 'ok',
    service: 'AlgoAnalyze AI API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
}
