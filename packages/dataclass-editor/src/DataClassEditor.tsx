import type { DataClass, DataClassData, DataClassEditorDataContext, EditorProps } from '@axonivy/dataclass-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  useDefaultLayout,
  useHistoryData,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './context/AppContext';
import { useAction } from './context/useAction';
import { Detail } from './detail/Detail';
import { DataClassMasterContent } from './master/DataClassMasterContent';
import { DataClassMasterToolbar } from './master/DataClassMasterToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';
import { useKnownHotkeys } from './utils/useKnownHotkeys';

function DataClassEditor({ context, directSave }: EditorProps) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(true);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'dataclass-editor-resize', storage: localStorage });
  const [initialData, setInitialData] = useState<DataClass | undefined>(undefined);
  const [selectedField, setSelectedField] = useState<number>();
  const history = useHistoryData<DataClass>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: (context: DataClassEditorDataContext) => genQueryKey('data', context),
      saveData: (context: DataClassEditorDataContext) => genQueryKey('saveData', context),
      validate: (context: DataClassEditorDataContext) => genQueryKey('validate', context)
    };
  }, []);

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const { data: validations } = useQuery({
    queryKey: queryKeys.validate(context),
    queryFn: () => client.validate(context),
    initialData: [],
    enabled: isSuccess
  });

  useEffect(() => {
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    return () => {
      dataDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  if (data?.data !== undefined && initialData === undefined) {
    setInitialData(data.data);
    history.push(data.data);
  }

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (updateData: Unary<DataClass>) => {
      const saveData = queryClient.setQueryData<DataClassData>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave });
      }
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.validate(context) })
  });

  const hotkeys = useKnownHotkeys();
  const openUrl = useAction('openUrl');
  useHotkeys(hotkeys.openHelp.hotkey, () => openUrl(data?.helpUrl), { scopes: ['global'] });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }
  if (data.data.simpleName === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.noDataClass')} />;
  }

  const dataClass = data.data;

  return (
    <AppProvider
      value={{
        context,
        isPersistable: data.isPersistable,
        dataClass,
        setDataClass: mutation.mutate,
        selectedField,
        setSelectedField,
        detail,
        setDetail,
        validations,
        history
      }}
    >
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <ResizablePanel id='dataclass-editor-main' defaultSize='75%' minSize='50%' className='bg-n75'>
          <Flex className='h-full' direction='column'>
            <DataClassMasterToolbar />
            <DataClassMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='dataclass-editor-detail' defaultSize='25%' minSize='20%'>
              <Detail helpUrl={data.helpUrl} />
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
}

export default DataClassEditor;
