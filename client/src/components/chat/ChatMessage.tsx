export type ChatMessageItem = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type ChatMessageProps = {
  message: ChatMessageItem;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const createdAt = new Date(message.createdAt);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? 'rounded-br-md bg-slate-950 text-white dark:bg-brand-500'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`mt-2 text-[11px] ${isUser ? 'text-slate-300' : 'text-slate-400'}`}>
          {Number.isNaN(createdAt.getTime())
            ? ''
            : createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
