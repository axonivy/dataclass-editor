import { createContext, useContext } from 'react';
import type { DataClass, EntityDataClass, DataClassEditorDataContext, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import type { UpdateConsumer, useHistoryData } from '@axonivy/ui-components';

type AppContext = {
  context: DataClassEditorDataContext;
  isPersistable: boolean;
  dataClass: DataClass;
  setDataClass: UpdateConsumer<DataClass>;
  selectedField?: number;
  setSelectedField: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  validations: Array<ValidationResult>;
  history: ReturnType<typeof useHistoryData<DataClass>>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  isPersistable: true,
  dataClass: {} as DataClass,
  setDataClass: () => {},
  selectedField: undefined,
  setSelectedField: () => {},
  detail: true,
  setDetail: () => {},
  validations: [],
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext & { setUnhistorisedDataClass: UpdateConsumer<DataClass>; isHdData: boolean } => {
  const context = useContext(appContext);
  return {
    ...context,
    setDataClass: updater => {
      context.setDataClass(old => {
        const newData = updater(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistorisedDataClass: context.setDataClass,
    isHdData: context.context.file.includes('src_hd')
  };
};

type EntityClassContext = {
  entityClass: EntityDataClass;
  setEntityClass: UpdateConsumer<EntityDataClass>;
};

const entityClassContext = createContext<EntityClassContext>({
  entityClass: {} as EntityDataClass,
  setEntityClass: () => {}
});

export const EntityClassProvider = entityClassContext.Provider;

export const useEntityClass = () => {
  return useContext(entityClassContext);
};
