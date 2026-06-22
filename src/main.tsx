import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AppProviders } from './app/AppProviders';
import { AppRouter } from './app/router';
import './styles/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
