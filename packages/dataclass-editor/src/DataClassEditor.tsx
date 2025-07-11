import type {
  DataClass,
  DataClassData,
  DataClassEditorDataContext,
  EditorProps,
  ValidationResult
} from '@axonivy/dataclass-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Spinner,
  useHistoryData,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './context/AppContext';
import { useAction } from './context/useAction';
import './DataClassEditor.css';
import { Detail } from './detail/Detail';
import { DataClassMasterContent } from './master/DataClassMasterContent';
import { DataClassMasterToolbar } from './master/DataClassMasterToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';
import { useKnownHotkeys } from './utils/useKnownHotkeys';

function DataClassEditor(props: EditorProps) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const [selectedField, setSelectedField] = useState<number>();
  const [validations, setValidations] = useState<Array<ValidationResult>>([]);
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

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => {
      const data = await client.data(context);
      history.push(data.data);
      return data;
    },
    structuralSharing: false
  });

  useQuery({
    queryKey: queryKeys.validate(context),
    queryFn: async () => {
      const validations = await client.validate(context);
      setValidations(validations);
      return validations;
    }
  });

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
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='dataclass-editor-main-panel'>
          <Flex className='dataclass-editor-panel-content' direction='column'>
            <DataClassMasterToolbar />
            <DataClassMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Detail helpUrl={data.helpUrl} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default DataClassEditor;
