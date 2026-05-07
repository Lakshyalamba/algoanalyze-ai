import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { buildChatPrompt } from '../prompts/chat.prompt.js';
import { chatSchema, type ChatInput } from '../validators/chat.validator.js';

const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'] as const;

type ChatResponse = {
  reply: string;
  suggestedQuestions: string[];
};

const defaultSuggestedQuestions = [
  'Explain this code line by line',
  'Dry run this code',
  'Why this pattern is used?',
  'What is the time complexity?',
  'How can I optimize this?',
  'What edge cases should I test?',
];

const defaultFallbackInput: ChatInput = {
  message: '',
  languageMode: 'english',
  analysisContext: null,
};

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid chat request.';
}

function getValidationDetails(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : 'body',
    message: issue.message,
  }));
}

function extractJson(text: string) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Gemini chat response did not contain a JSON object.');
    }

    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as unknown;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function getAnalysisString(input: ChatInput, key: string) {
  const context = input.analysisContext;

  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return '';
  }

  const value = context[key];
  return typeof value === 'string' ? value : '';
}

function getAnalysisList(input: ChatInput, key: string) {
  const context = input.analysisContext;

  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return [];
  }

  const value = context[key];
  return Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'string') return item;
          if (isRecord(item)) {
            return [item.title, item.explanation, item.fix ? `Fix: ${String(item.fix)}` : '']
              .filter(Boolean)
              .map(String)
              .join(' - ');
          }
          return '';
        })
        .filter(Boolean)
    : [];
}

function getAnalysisRecords(input: ChatInput, key: string) {
  const context = input.analysisContext;

  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return [];
  }

  const value = context[key];
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function formatCodeLineExplanation(code: string, isHinglish: boolean) {
  const meaningfulLines = code
    .split('\n')
    .map((line, index) => ({ lineNumber: index + 1, text: line.trim() }))
    .filter((line) => line.text.length > 0)
    .slice(0, 10);

  if (meaningfulLines.length === 0) {
    return isHinglish
      ? 'Code abhi available nahi hai. Python code paste karo, phir main line-by-line explain kar dunga.'
      : 'No code is available yet. Paste Python code and I can explain it line by line.';
  }

  const explanations = meaningfulLines.map(({ lineNumber, text }) => {
    let explanation = isHinglish ? 'Ye line code flow ka part hai.' : 'This line is part of the code flow.';

    if (text.startsWith('class ')) {
      explanation = isHinglish
        ? 'Ye class define karti hai, usually platform solution wrapper ke liye.'
        : 'Defines a class, usually the solution wrapper required by the platform.';
    } else if (text.startsWith('def ')) {
      explanation = isHinglish
        ? 'Ye function define karta hai jahan main logic run hota hai.'
        : 'Defines the function where the main logic runs.';
    } else if (text.startsWith('for ') || text.startsWith('while ')) {
      explanation = isHinglish
        ? 'Ye loop repeatedly values process karta hai.'
        : 'Runs a loop to repeatedly process values.';
    } else if (text.startsWith('if ') || text.startsWith('elif ') || text === 'else:') {
      explanation = isHinglish
        ? 'Ye condition decide karti hai kaunsa branch execute hoga.'
        : 'Checks a condition and decides which branch should run.';
    } else if (text.startsWith('return ')) {
      explanation = isHinglish
        ? 'Ye final answer function se return karta hai.'
        : 'Returns the final answer from the function.';
    } else if (text.includes('=')) {
      explanation = isHinglish
        ? 'Ye variable ya data structure update/initialize karta hai.'
        : 'Initializes or updates a variable or data structure.';
    }

    return `${lineNumber}. \`${text}\` - ${explanation}`;
  });

  const suffix =
    meaningfulLines.length === 10
      ? isHinglish
        ? '\n\nMaine first 10 non-empty lines explain ki hain. Specific line number bhejo to aur detail de sakta hoon.'
        : '\n\nI explained the first 10 non-empty lines. Send a specific line number for more detail.'
      : '';

  return `${explanations.join('\n')}${suffix}`;
}

function formatDryRun(input: ChatInput, isHinglish: boolean) {
  const rows = getAnalysisRecords(input, 'dryRunTable').slice(0, 6);

  if (rows.length > 0) {
    const formattedRows = rows.map((row) => {
      const step = Number(row.step ?? 0);
      const line = Number(row.line ?? 0);
      const explanation = String(row.explanation ?? 'Update the tracked variables.');
      const output = String(row.output ?? '-');
      return `Step ${step || '?'}${line ? `, line ${line}` : ''}: ${explanation} Output: ${output}`;
    });

    return isHinglish
      ? `Dry run:\n${formattedRows.join('\n')}`
      : `Dry run:\n${formattedRows.join('\n')}`;
  }

  const sample = input.sampleInput?.trim();

  if (sample) {
    return isHinglish
      ? `Sample input se start karo: ${sample}\nHar line execute karo, variables update karo, output note karo, aur expected output (${input.expectedOutput || '-'}) se compare karo.`
      : `Start with sample input: ${sample}\nExecute each line, update variables, note the output, and compare it with expected output (${input.expectedOutput || '-'}).`;
  }

  return isHinglish
    ? 'Dry run ke liye sample input add karo. Phir har line par variables update karke output compare karo.'
    : 'Add a sample input for a precise dry run. Then update variables line by line and compare the output.';
}

function createContextualFallbackChatResponse(input: ChatInput): ChatResponse {
  const lowerMessage = input.message.toLowerCase();
  const isHinglish = input.languageMode === 'hinglish';
  const problemSummary = getAnalysisString(input, 'problemSummary');
  const questionExplanation = getAnalysisString(input, 'questionExplanation');
  const pattern = getAnalysisString(input, 'pattern');
  const timeComplexity = getAnalysisString(input, 'timeComplexity');
  const spaceComplexity = getAnalysisString(input, 'spaceComplexity');
  const optimizedApproach = getAnalysisString(input, 'optimizedApproach');
  const bugsOrWarnings = getAnalysisList(input, 'bugsOrWarnings');
  const edgeCases = getAnalysisList(input, 'edgeCases');

  let reply: string;

  if (
    lowerMessage.includes('question') ||
    lowerMessage.includes('problem') ||
    lowerMessage.includes('statement')
  ) {
    const explanation = questionExplanation || problemSummary || input.problemStatement?.trim();
    reply = explanation
      ? isHinglish
        ? `Question ka idea: ${explanation}\nGoal ko input, required output, aur constraints mein break karo.`
        : `Question idea: ${explanation}\nBreak it into input, required output, and constraints.`
      : isHinglish
        ? 'Problem statement abhi available nahi hai. Question paste karo, phir main simple explanation de dunga.'
        : 'No problem statement is available yet. Paste the question and I can explain it simply.';
  } else if (
    lowerMessage.includes('line by line') ||
    lowerMessage.includes('explain this code') ||
    lowerMessage.includes('code explanation') ||
    lowerMessage.includes('explain code')
  ) {
    reply = formatCodeLineExplanation(input.code ?? '', isHinglish);
  } else if (lowerMessage.includes('complex')) {
    reply =
      isHinglish
        ? `Time complexity: ${timeComplexity || 'analysis ke baad clearer hoga'}. Space complexity: ${spaceComplexity || 'analysis ke baad clearer hoga'}. Main idea ye hai ki loops aur extra data structures ko count karo.`
        : `Time complexity: ${timeComplexity || 'not available yet'}. Space complexity: ${spaceComplexity || 'not available yet'}. To verify it, count loops for runtime and extra data structures for memory.`;
  } else if (lowerMessage.includes('bug')) {
    const bugs = bugsOrWarnings.length > 0 ? bugsOrWarnings.join('\n- ') : 'No specific bug list is available yet.';
    reply =
      isHinglish
        ? `Possible bugs/warnings:\n- ${bugs}\nSample input par dry run karke variables aur expected output compare karo.`
        : `Possible bugs/warnings:\n- ${bugs}\nDry run the sample input and compare variable values with the expected output.`;
  } else if (lowerMessage.includes('edge')) {
    const cases = edgeCases.length > 0 ? edgeCases.join('\n- ') : 'Empty input, single item input, duplicates, and large constraints.';
    reply =
      isHinglish
        ? `Edge cases test karo:\n- ${cases}`
        : `Test these edge cases:\n- ${cases}`;
  } else if (lowerMessage.includes('optimi')) {
    reply =
      isHinglish
        ? optimizedApproach || 'Optimize karne ke liye repeated work reduce karo aur suitable data structure use karo.'
        : optimizedApproach || 'To optimize, reduce repeated work and use the right data structure for lookups or ordering.';
  } else if (lowerMessage.includes('pattern')) {
    reply =
      isHinglish
        ? `Pattern: ${pattern || 'not identified yet'}. Is pattern ko choose karo jab problem ka structure same repeated decision ya lookup demand karta ho.`
        : `Pattern: ${pattern || 'not identified yet'}. This pattern is useful when the problem repeatedly needs the same kind of lookup, traversal, or state update.`;
  } else if (lowerMessage.includes('dry')) {
    reply = formatDryRun(input, isHinglish);
  } else {
    reply =
      isHinglish
        ? 'Main current DSA problem aur code ke context se help kar sakta hoon. Aap code explanation, dry run, complexity, bugs, optimization, pattern, ya edge cases pooch sakte ho.'
        : 'I can help with the current DSA problem and code. Ask about code explanation, dry run, complexity, bugs, optimization, pattern, or edge cases.';
  }

  return {
    reply,
    suggestedQuestions: defaultSuggestedQuestions,
  };
}

function normalizeChatResponse(value: unknown): ChatResponse {
  if (!isRecord(value)) {
    throw new Error('Gemini chat response was not an object.');
  }

  const suggestedQuestions = toStringArray(value.suggestedQuestions).slice(0, 6);

  return {
    reply: String(value.reply ?? '').trim() || 'I can help with this DSA problem or code.',
    suggestedQuestions:
      suggestedQuestions.length >= 4 ? suggestedQuestions : defaultSuggestedQuestions,
  };
}

export async function chatController(request: Request, response: Response) {
  let input: ChatInput | null = null;

  try {
    input = chatSchema.parse(request.body);
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      response.status(200).json(createContextualFallbackChatResponse(input));
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    let lastError: unknown = null;

    for (const model of models) {
      try {
        const geminiResponse = await ai.models.generateContent({
          model,
          contents: buildChatPrompt(input),
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        });

        const json = extractJson(geminiResponse.text ?? '');
        response.status(200).json(normalizeChatResponse(json));
        return;
      } catch (error) {
        lastError = error;
        console.error(`Gemini chat failed with ${model}:`, error);
      }
    }

    console.error('All Gemini chat models failed:', lastError);
    response.status(200).json(createContextualFallbackChatResponse(input));
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        success: false,
        message: getValidationMessage(error),
        details: getValidationDetails(error),
      });
      return;
    }

    console.error('Gemini chat failed:', error);
    response.status(200).json(createContextualFallbackChatResponse(input ?? defaultFallbackInput));
  }
}
