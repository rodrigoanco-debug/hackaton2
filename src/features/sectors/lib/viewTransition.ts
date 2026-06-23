import type { NavigateFunction } from 'react-router';

/** Narrow, `any`-free view of the optional View Transition API on Document. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/**
 * Navigates using the View Transition API when available, otherwise falls back to
 * a normal navigation. Keeps the same outcome regardless of browser support.
 */
export function navigateWithViewTransition(navigate: NavigateFunction, to: string): void {
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => navigate(to));
    return;
  }
  navigate(to);
}
