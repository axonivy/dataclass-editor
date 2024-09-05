import { ClientContextProvider, ClientJsonRpc, DataClassEditor, QueryProvider, initQueryClient } from '@axonivy/dataclass-editor';
import { ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const file = URLParams.file();
  const directSave = URLParams.directSave();
  const theme = URLParams.theme();
  const readonly = URLParams.readonly();

  const client = await ClientJsonRpc.startWebSocketClient(server);
  const queryClient = initQueryClient();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <DataClassEditor context={{ app, pmv, file: file }} directSave={directSave} />
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
