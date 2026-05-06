import type { Request, Response } from 'express';
import {
  createSavedProblem,
  deleteSavedProblem,
  getSavedProblemById,
  getSavedProblems,
} from '../services/savedProblem.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { savedProblemSchema } from '../validators/savedProblem.validator.js';

function getUserId(request: Request) {
  const userId = request.user?.id;

  if (!userId) {
    throw new AppError('Authentication token is required.', 401);
  }

  return userId;
}

function getProblemId(request: Request) {
  const { id } = request.params;

  if (typeof id !== 'string' || !id.trim()) {
    throw new AppError('Saved problem ID is required.', 400);
  }

  return id;
}

export const createSavedProblemController = asyncHandler(async (request: Request, response: Response) => {
  const userId = getUserId(request);
  const input = savedProblemSchema.parse(request.body);
  const savedProblem = await createSavedProblem(userId, input);

  response.status(201).json(savedProblem);
});

export const getSavedProblemsController = asyncHandler(async (request: Request, response: Response) => {
  const userId = getUserId(request);
  const savedProblems = await getSavedProblems(userId);
  response.status(200).json(savedProblems);
});

export const getSavedProblemByIdController = asyncHandler(async (request: Request, response: Response) => {
  const userId = getUserId(request);
  const id = getProblemId(request);
  const savedProblem = await getSavedProblemById(userId, id);

  if (!savedProblem) {
    throw new AppError('Saved problem not found.', 404);
  }

  response.status(200).json(savedProblem);
});

export const deleteSavedProblemController = asyncHandler(async (request: Request, response: Response) => {
  const userId = getUserId(request);
  const id = getProblemId(request);
  const deletedProblem = await deleteSavedProblem(userId, id);

  if (!deletedProblem) {
    throw new AppError('Saved problem not found.', 404);
  }

  response.status(200).json({ message: 'Saved problem deleted successfully.' });
});
