import { prisma } from '../lib/prisma.js';

type GroupCount = {
  name: string;
  count: number;
  percentage: number;
};

function normalize(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : 'Unknown';
}

function getPercentage(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function sortGroups(groups: GroupCount[]) {
  return [...groups].sort((first, second) => {
    if (second.count !== first.count) return second.count - first.count;
    return first.name.localeCompare(second.name);
  });
}

function countBy(values: Array<string | null | undefined>, total: number): GroupCount[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const name = normalize(value);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  });

  return sortGroups(
    [...counts.entries()].map(([name, count]) => ({
      name,
      count,
      percentage: getPercentage(count, total),
    })),
  );
}

function countComplexities(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const normalized = normalize(value);
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((first, second) => {
      if (second.count !== first.count) return second.count - first.count;
      return first.value.localeCompare(second.value);
    });
}

function normalizeDifficulty(name: string): 'Easy' | 'Medium' | 'Hard' | 'Unknown' {
  if (name === 'Easy' || name === 'Medium' || name === 'Hard') {
    return name;
  }

  return 'Unknown';
}

export async function getStatsOverview(userId: string) {
  const savedProblems = await prisma.savedProblem.findMany({
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

  const totalProblems = savedProblems.length;
  const topics = countBy(
    savedProblems.map((problem) => problem.pattern),
    totalProblems,
  );
  const difficulty = countBy(
    savedProblems.map((problem) => normalizeDifficulty(normalize(problem.difficulty))),
    totalProblems,
  ).map((group) => ({
    ...group,
    name: normalizeDifficulty(group.name),
  }));

  return {
    totalProblems,
    topics,
    difficulty,
    recentProblems: savedProblems.slice(0, 5).map((problem) => ({
      id: problem.id,
      title: problem.title,
      pattern: normalize(problem.pattern),
      difficulty: normalize(problem.difficulty),
      createdAt: problem.createdAt,
    })),
    complexityStats: {
      commonTimeComplexities: countComplexities(
        savedProblems.map((problem) => problem.timeComplexity),
      ),
      commonSpaceComplexities: countComplexities(
        savedProblems.map((problem) => problem.spaceComplexity),
      ),
    },
  };
}
