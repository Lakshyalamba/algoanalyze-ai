import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

type CopyNotesButtonProps = {
  notesText: string;
};

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

export function CopyNotesButton({ notesText }: CopyNotesButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!notesText.trim()) {
      return;
    }

    await copyText(notesText);
    setCopied(true);
    showToast('Notes copied!', 'success');
    window.setTimeout(() => setCopied(false), 1800);
  }

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Copy revision notes"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {copied ? 'Notes copied!' : 'Copy notes'}
    </button>
  );
}
