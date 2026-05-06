import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createSavedProblem,
  deleteSavedProblem,
  getSavedProblemById,
  getSavedProblems,
} from '../services/savedProblem.service.js';
import { savedProblemSchema } from '../validators/savedProblem.validator.js';

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid saved problem request.';
}

function getUserId(request: Request, response: Response) {
  const userId = request.user?.id;

  if (!userId) {
    response.status(401).json({ message: 'Authentication token is required.' });
    return null;
  }

  return userId;
}

function getProblemId(request: Request, response: Response) {
  const { id } = request.params;

  if (typeof id !== 'string' || !id.trim()) {
    response.status(400).json({ message: 'Saved problem ID is required.' });
    return null;
  }

  return id;
}

export async function createSavedProblemController(request: Request, response: Response) {
  const userId = getUserId(request, response);
  if (!userId) return;

  try {
    const input = savedProblemSchema.parse(request.body);
    const savedProblem = await createSavedProblem(userId, input);

    response.status(201).json(savedProblem);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ message: getValidationMessage(error) });
      return;
    }

    console.error('Failed to save problem:', error);
    response.status(500).json({ message: 'Unable to save analysis. Please try again.' });
  }
}

export async function getSavedProblemsController(request: Request, response: Response) {
  const userId = getUserId(request, response);
  if (!userId) return;

  try {
    const savedProblems = await getSavedProblems(userId);
    response.status(200).json(savedProblems);
  } catch (error) {
    console.error('Failed to load saved problems:', error);
    response.status(500).json({ message: 'Unable to load saved problems. Please try again.' });
  }
}

export async function getSavedProblemByIdController(request: Request, response: Response) {
  const userId = getUserId(request, response);
  if (!userId) return;
  const id = getProblemId(request, response);
  if (!id) return;

  try {
    const savedProblem = await getSavedProblemById(userId, id);

    if (!savedProblem) {
      response.status(404).json({ message: 'Saved problem not found.' });
      return;
    }

    response.status(200).json(savedProblem);
  } catch (error) {
    console.error('Failed to load saved problem:', error);
    response.status(500).json({ message: 'Unable to load saved problem. Please try again.' });
  }
}

export async function deleteSavedProblemController(request: Request, response: Response) {
  const userId = getUserId(request, response);
  if (!userId) return;
  const id = getProblemId(request, response);
  if (!id) return;

  try {
    const deletedProblem = await deleteSavedProblem(userId, id);

    if (!deletedProblem) {
      response.status(404).json({ message: 'Saved problem not found.' });
      return;
    }

    response.status(200).json({ message: 'Saved problem deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete saved problem:', error);
    response.status(500).json({ message: 'Unable to delete saved problem. Please try again.' });
  }
}
