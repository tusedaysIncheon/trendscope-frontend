import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nProvider } from './lib/i18n/I18nProvider'
import { queryClient } from './lib/queryClient'
import { HelmetProvider } from 'react-helmet-async';

declare global {
  interface Window {
    __TRENDSCOPE_ROOT__?: Root;
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container (#root) not found');
}

const root = window.__TRENDSCOPE_ROOT__ ?? createRoot(container);
window.__TRENDSCOPE_ROOT__ = root;

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <App />
      </I18nProvider>

      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />

    </QueryClientProvider>
  </HelmetProvider>
)
