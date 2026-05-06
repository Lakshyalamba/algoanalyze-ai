import { BookOpen, Lightbulb, ListChecks } from 'lucide-react';
import { CopyNotesButton } from './CopyNotesButton';

export type NotesSectionItem = {
  title: string;
  items: string[];
};

type NotesSectionProps = {
  title: string;
  sections: NotesSectionItem[];
  markdown: string;
};

function NotesCard({ section }: { section: NotesSectionItem }) {
  if (section.items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
        <ListChecks className="h-4 w-4 text-brand-600" aria-hidden="true" />
        {section.title}
      </h3>
      <ul className="mt-3 space-y-2">
        {section.items.map((item, index) => (
          <li
            key={`${section.title}-${index}`}
            className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NotesSection({ title, sections, markdown }: NotesSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
            <BookOpen className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Revision notes
          </div>
          <h2 className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-100">
            {title}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            Short notes generated from the current analysis.
          </p>
        </div>
        <CopyNotesButton notesText={markdown} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <NotesCard key={section.title} section={section} />
        ))}
      </div>
    </div>
  );
}
