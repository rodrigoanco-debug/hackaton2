import type { ReactNode } from 'react';

interface AsyncPanelProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function AsyncPanel({ title, message, action }: AsyncPanelProps) {
  return (
    <div className="panel grid min-h-56 place-items-center text-center" aria-live="polite">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {message ? <p className="mt-2 max-w-xl text-sm text-slate-400">{message}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
