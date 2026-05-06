import type { AnalysisResult, DryRunRow, LanguageMode, QuizQuestion } from '../../types/analysis';
import { NotesSection, type NotesSectionItem } from './NotesSection';

type NotesGeneratorProps = {
  analysisResult: AnalysisResult | null;
  title: string;
  problemStatement: string;
  code: string;
  languageMode: LanguageMode;
};

type BuildSectionsParams = {
  analysisResult: AnalysisResult;
  title: string;
  problemStatement: string;
  code: string;
  languageMode: LanguageMode;
};

const fallback = 'Not available from this analysis.';

function cleanText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function cleanArray(items: string[] | null | undefined, emptyText = fallback) {
  const cleaned = items?.map((item) => item.trim()).filter(Boolean) ?? [];
  return cleaned.length > 0 ? cleaned : [emptyText];
}

function summarizeDryRun(rows: DryRunRow[] | null | undefined) {
  const selectedRows = rows?.slice(0, 5) ?? [];

  if (selectedRows.length === 0) {
    return [fallback];
  }

  return selectedRows.map((row) => {
    const variables = Object.entries(row.variables ?? {})
      .slice(0, 3)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join(', ');
    const variableText = variables ? ` Variables: ${variables}.` : '';
    const outputText = row.output ? ` Output: ${row.output}.` : '';

    return `Step ${row.step}: line ${row.line}. ${row.explanation}${variableText}${outputText}`;
  });
}

function summarizeQuiz(questions: QuizQuestion[] | null | undefined) {
  if (!questions || questions.length === 0) {
    return [fallback];
  }

  return questions
    .slice(0, 5)
    .map((item, index) => `${index + 1}. ${item.question} Answer: ${item.answer}`);
}

function buildSections({
  analysisResult,
  title,
  problemStatement,
  code,
  languageMode,
}: BuildSectionsParams): NotesSectionItem[] {
  const codeProvided = code.trim().length > 0;
  const problemTitle = title.trim() || 'Untitled problem';
  const bugs = cleanArray(analysisResult.bugsOrWarnings, 'No major bugs or warnings found.');
  const edgeCases = cleanArray(analysisResult.edgeCases);

  const sections: NotesSectionItem[] = [
    {
      title: 'Problem Title',
      items: [problemTitle],
    },
    {
      title: 'Problem Summary',
      items: [cleanText(analysisResult.problemSummary)],
    },
    {
      title: 'What the Question Says',
      items: [cleanText(analysisResult.questionExplanation || problemStatement)],
    },
    {
      title: 'DSA Pattern Used',
      items: [cleanText(analysisResult.pattern)],
    },
    {
      title: 'Difficulty',
      items: [cleanText(analysisResult.difficulty)],
    },
    {
      title: 'Approach Summary',
      items: [cleanText(analysisResult.optimizedApproach || analysisResult.betterApproach)],
    },
    {
      title: 'Brute Force Approach',
      items: [cleanText(analysisResult.bruteForceApproach)],
    },
    {
      title: 'Better Approach',
      items: [cleanText(analysisResult.betterApproach)],
    },
    {
      title: 'Optimized Approach',
      items: [cleanText(analysisResult.optimizedApproach)],
    },
    {
      title: 'Time Complexity',
      items: [cleanText(analysisResult.timeComplexity)],
    },
    {
      title: 'Space Complexity',
      items: [cleanText(analysisResult.spaceComplexity)],
    },
    {
      title: 'Dry Run Summary',
      items: summarizeDryRun(analysisResult.dryRunTable),
    },
    {
      title: 'Bugs or Warnings',
      items: bugs,
    },
    {
      title: 'Important Edge Cases',
      items: edgeCases,
    },
    {
      title: 'Similar Problems',
      items: cleanArray(analysisResult.similarProblems),
    },
    {
      title: 'Quiz Questions',
      items: summarizeQuiz(analysisResult.quizQuestions),
    },
    {
      title: 'Key Takeaways',
      items: [
        `Recognize the ${cleanText(analysisResult.pattern)} pattern before coding.`,
        `Keep the optimized approach in mind: ${cleanText(analysisResult.optimizedApproach)}`,
        codeProvided
          ? 'Review the submitted code with the dry run before revising.'
          : 'Revisit the implementation once code is added.',
      ],
    },
    {
      title: 'Mistakes to Avoid',
      items: [
        ...bugs,
        ...edgeCases.map((edgeCase) => `Do not miss edge case: ${edgeCase}`),
      ],
    },
  ];

  if (languageMode === 'hinglish') {
    sections.push({
      title: 'Hinglish Quick Revision',
      items: [
        `Question kya keh raha hai: ${cleanText(
          analysisResult.hinglishExplanation || analysisResult.questionExplanation,
        )}`,
        `Code ka main logic: ${cleanText(
          analysisResult.optimizedApproach || analysisResult.betterApproach,
        )}`,
        `Complexity ka simple meaning: Time ${cleanText(analysisResult.timeComplexity)}, Space ${cleanText(analysisResult.spaceComplexity)}.`,
      ],
    });
  }

  return sections;
}

function buildMarkdown(title: string, sections: NotesSectionItem[]) {
  const lines = [`# ${title.trim() || 'Revision Notes'}`, ''];

  sections.forEach((section) => {
    lines.push(`## ${section.title}`);
    section.items.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  });

  return lines.join('\n').trim();
}

export function NotesGenerator({
  analysisResult,
  title,
  problemStatement,
  code,
  languageMode,
}: NotesGeneratorProps) {
  if (!analysisResult) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        Run an analysis first to generate notes.
      </div>
    );
  }

  const sections = buildSections({
    analysisResult,
    title,
    problemStatement,
    code,
    languageMode,
  });
  const notesTitle = title.trim() || 'Untitled problem';
  const markdown = buildMarkdown(notesTitle, sections);

  return <NotesSection title={notesTitle} sections={sections} markdown={markdown} />;
}
