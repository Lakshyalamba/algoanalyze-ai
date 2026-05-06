-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedProblem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problemStatement" TEXT,
    "code" TEXT NOT NULL,
    "sampleInput" TEXT,
    "expectedOutput" TEXT,
    "pattern" TEXT,
    "difficulty" TEXT,
    "timeComplexity" TEXT,
    "spaceComplexity" TEXT,
    "explanation" JSONB,
    "visualizationSteps" JSONB,
    "dryRunTable" JSONB,
    "bugsOrWarnings" JSONB,
    "edgeCases" JSONB,
    "similarProblems" JSONB,
    "quizQuestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SavedProblem_userId_idx" ON "SavedProblem"("userId");

-- CreateIndex
CREATE INDEX "SavedProblem_pattern_idx" ON "SavedProblem"("pattern");

-- CreateIndex
CREATE INDEX "SavedProblem_difficulty_idx" ON "SavedProblem"("difficulty");

-- CreateIndex
CREATE INDEX "SavedProblem_createdAt_idx" ON "SavedProblem"("createdAt");

-- AddForeignKey
ALTER TABLE "SavedProblem" ADD CONSTRAINT "SavedProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
