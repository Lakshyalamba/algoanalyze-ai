import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { SaveProblemInput } from '../types/savedProblem.js';

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value === undefined ? undefined : (value as Prisma.InputJsonValue);
}

export function createSavedProblem(userId: string, input: SaveProblemInput) {
  return prisma.savedProblem.create({
    data: {
      userId,
      title: input.title,
      problemStatement: input.problemStatement,
      code: input.code,
      sampleInput: input.sampleInput,
      expectedOutput: input.expectedOutput,
      pattern: input.pattern,
      difficulty: input.difficulty,
      timeComplexity: input.timeComplexity,
      spaceComplexity: input.spaceComplexity,
      explanation: toJson(input.explanation),
      visualizationSteps: toJson(input.visualizationSteps),
      dryRunTable: toJson(input.dryRunTable),
      bugsOrWarnings: toJson(input.bugsOrWarnings),
      edgeCases: toJson(input.edgeCases),
      similarProblems: toJson(input.similarProblems),
      quizQuestions: toJson(input.quizQuestions),
    },
  });
}

export function getSavedProblems(userId: string) {
  return prisma.savedProblem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      pattern: true,
      difficulty: true,
      timeComplexity: true,
      spaceComplexity: true,
      createdAt: true,
    },
  });
}

export function getSavedProblemById(userId: string, id: string) {
  return prisma.savedProblem.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function deleteSavedProblem(userId: string, id: string) {
  const savedProblem = await getSavedProblemById(userId, id);

  if (!savedProblem) {
    return null;
  }

  await prisma.savedProblem.delete({
    where: { id: savedProblem.id },
  });

  return savedProblem;
}
