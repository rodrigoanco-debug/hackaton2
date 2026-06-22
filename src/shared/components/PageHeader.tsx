import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p> : null}
        <h2 className="mt-1 text-3xl font-bold tracking-tight">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-slate-400">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
