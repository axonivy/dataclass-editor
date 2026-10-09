import { ClientContextProvider, ClientJsonRpc, DataClassEditor, initQueryClient } from '@axonivy/dataclass-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReadonlyProvider, ThemeProvider, toast, Toaster, Spinner, Flex, HotkeysProvider } from '@axonivy/ui-components';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { appParam, directSaveParam, fileParam, pmvParam, readonlyParam, themeParam, webSocketBaseParam } from './url-helper';

export async function start(): Promise<void> {
  const server = webSocketBaseParam();
  const app = appParam();
  const pmv = pmvParam();
  const file = fileParam();
  const directSave = directSaveParam();
  const theme = themeParam();
  const readonly = readonlyParam();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found.');
  }
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await ClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryClientProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <DataClassEditor context={{ app, pmv, file: file }} directSave={directSave} />
                </HotkeysProvider>
              </ReadonlyProvider>
              <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
            </QueryClientProvider>
          </ClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: ClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<ClientJsonRpc>(ClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
