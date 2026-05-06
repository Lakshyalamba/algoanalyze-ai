import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

function formatZodDetails(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : 'body',
    message: issue.message,
  }));
}

function isErrorWithStatus(error: unknown): error is { status: number; type?: string } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function notFoundHandler(_request: Request, response: Response) {
  response.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  void _next;
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({
      success: false,
      message: 'Invalid JSON request body.',
    });
    return;
  }

  if (isErrorWithStatus(error) && error.status === 413) {
    response.status(413).json({
      success: false,
      message: 'Request body is too large. Please keep requests under 1mb.',
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: 'Validation failed.',
      details: formatZodDetails(error),
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    });
    return;
  }

  console.error('Unhandled server error:', error);
  response.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
  });
}
