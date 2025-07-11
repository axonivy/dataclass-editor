import type { DataActionArgs } from '@axonivy/dataclass-editor-protocol';
import { useClient } from '../protocol/ClientContextProvider';
import { useAppContext } from './AppContext';

export function useAction(actionId: DataActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: DataActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
