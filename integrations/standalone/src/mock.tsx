import { ClientContextProvider, DataClassEditor, initQueryClient, QueryProvider } from '@axonivy/dataclass-editor';
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
        <QueryProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <DataClassEditor context={{ app, pmv: '', file }} />
            </HotkeysProvider>
          </ReadonlyProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
