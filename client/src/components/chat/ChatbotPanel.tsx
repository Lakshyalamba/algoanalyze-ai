import { Eraser, SendHorizonal, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage } from '../../services/chatApi';
import type { AnalysisResult, LanguageMode } from '../../types/analysis';
import { ChatMessage, type ChatMessageItem } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';

type ChatbotPanelProps = {
  problemStatement: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  languageMode: LanguageMode;
  analysisContext: AnalysisResult | null;
};

const initialQuestions = [
  'Explain this code',
  'Explain this question',
  'Dry run this',
  'Explain in Hinglish',
  'Find bug',
  'Optimize this code',
  'Explain complexity',
  'What pattern is used?',
  'Give edge cases',
];

function createMessage(role: ChatMessageItem['role'], content: string): ChatMessageItem {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function ChatbotPanel({
  problemStatement,
  code,
  sampleInput,
  expectedOutput,
  languageMode,
  analysisContext,
}: ChatbotPanelProps) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [draft, setDraft] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState(initialQuestions);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const hasContext = Boolean(problemStatement.trim() || code.trim() || analysisContext);
  const emptyMessage = useMemo(
    () =>
      hasContext
        ? 'Ask about the current problem, code, dry run, complexity, bugs, or optimization.'
        : 'Add a problem or code to get more specific DSA help.',
    [hasContext],
  );

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  async function submitMessage(message: string) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setError('');
    setDraft('');
    setIsSending(true);

    const userMessage = createMessage('user', trimmedMessage);
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      const response = await sendChatMessage(
        {
          message: trimmedMessage,
          problemStatement,
          code,
          sampleInput,
          expectedOutput,
          languageMode,
          analysisContext,
        },
        token,
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('assistant', response.reply),
      ]);

      if (response.suggestedQuestions.length > 0) {
        setSuggestedQuestions(response.suggestedQuestions);
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to send message.';
      setError(message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">AlgoAnalyze Chatbot</h3>
            <p className="text-xs text-slate-500">DSA-focused help for this workspace</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setError('');
            setSuggestedQuestions(initialQuestions);
          }}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <Eraser className="h-4 w-4" aria-hidden="true" />
          Clear chat
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            {emptyMessage}
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}

        {isSending ? (
          <div className="flex justify-start">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              Thinking...
            </div>
          </div>
        ) : null}

        <div ref={scrollAnchorRef} />
      </div>

      <div className="space-y-3 border-t border-slate-200 bg-white p-4">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <SuggestedQuestions
          questions={suggestedQuestions}
          isDisabled={isSending}
          onSelect={submitMessage}
        />

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void submitMessage(draft);
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about the code, dry run, bugs, complexity..."
            className="min-h-11 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizonal className="h-4 w-4" aria-hidden="true" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
