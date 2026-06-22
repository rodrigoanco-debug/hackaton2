import type { NavigateFunction } from 'react-router';

export function navigateWithViewTransition(navigate: NavigateFunction, to: string) {
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => navigate(to));
    return;
  }
  navigate(to);
}
