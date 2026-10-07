import { ClientContextProvider, DataClassEditor, initQueryClient } from '@axonivy/dataclass-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { DataClassClientMock } from './mock/dataclass-client-mock';
import { appParam, fileParam, readonlyParam } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found.');
}
const root = ReactDOM.createRoot(rootElement);

const client = new DataClassClientMock();
const queryClient = initQueryClient();

const readonly = readonlyParam();
const app = appParam();
const file = fileParam();

initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <DataClassEditor context={{ app, project: '', file }} />
            </HotkeysProvider>
          </ReadonlyProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
        </QueryClientProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
