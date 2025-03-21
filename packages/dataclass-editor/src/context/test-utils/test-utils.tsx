/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  DataClass,
  DataClassEditorDataContext,
  EntityClassField,
  EntityDataClass,
  Field,
  ValidationResult
} from '@axonivy/dataclass-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AppProvider, EntityClassProvider } from '../AppContext';
import { DetailContextProvider } from '../DetailContext';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTrans from '../../translation/dataclass-editor/en.json';
import { enCommonTranslation } from '../..';

type ContextHelperProps = {
  appContext?: {
    context?: DataClassEditorDataContext;
    dataClass?: DataClass;
    setDataClass?: (dataclass: DataClass) => void;
    selectedField?: number;
    setSelectedField?: (index?: number) => void;
    detail?: boolean;
    setDetail?: (detail: boolean) => void;
    validations?: Array<ValidationResult>;
  };
  entityClassContext?: {
    entityClass?: EntityDataClass;
    setEntityClass?: (entityClass: EntityDataClass) => void;
  };
  detailContext?: {
    field?: Field | EntityClassField;
    setField?: (field: Field | EntityClassField) => void;
    messages?: Record<string, MessageData>;
  };
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['dataclass-editor'],
    defaultNS: 'dataclass-editor',
    resources: { en: { 'dataclass-editor': enTrans, common: enCommonTranslation } }
  });
};

const ContextHelper = ({ appContext, entityClassContext, detailContext, children }: ContextHelperProps & { children: ReactNode }) => {
  const dataClass = appContext?.dataClass ?? ({} as DataClass);

  const aContext = {
    context: appContext?.context ?? ({ file: '' } as DataClassEditorDataContext),
    dataClass,
    // @ts-ignore
    setDataClass: appContext?.setDataClass ? getData => appContext.setDataClass(getData(dataClass)) : () => {},
    selectedField: appContext?.selectedField,
    setSelectedField: appContext?.setSelectedField ?? (() => {}),
    detail: appContext?.detail !== undefined ? appContext.detail : true,
    setDetail: appContext?.setDetail ?? (() => {}),
    validations: appContext?.validations ?? [],
    history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
  };

  const entityClass = entityClassContext?.entityClass ?? ({} as EntityDataClass);

  const edContext = {
    entityClass,
    // @ts-ignore
    setEntityClass: entityClassContext?.setEntityClass ? getData => entityClassContext.setEntityClass(getData(entityClass)) : () => {}
  };

  const dContext = {
    field: detailContext?.field,
    setField: detailContext?.setField,
    messages: detailContext?.messages ?? {}
  };

  initTranslation();

  return (
    <AppProvider value={aContext}>
      <EntityClassProvider value={edContext}>
        <DetailContextProvider value={dContext}>{children}</DetailContextProvider>
      </EntityClassProvider>
    </AppProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};
