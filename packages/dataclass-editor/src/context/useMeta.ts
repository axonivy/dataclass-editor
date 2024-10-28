import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import type { MetaRequestTypes } from '@axonivy/dataclass-editor-protocol';
import { useClient } from '../protocol/ClientContextProvider';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof MetaRequestTypes>(
  path: TMeta,
  args: MetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<MetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
): { data: MetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
