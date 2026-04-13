import type { EntityClassField, Field } from '@axonivy/dataclass-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { createContext, use } from 'react';

type DetailContext = {
  field?: Field;
  setField?: (field: Field) => void;
  messages: Record<string, MessageData>;
};

const DetailContext = createContext<DetailContext>({
  messages: {}
});

export const DetailContextProvider = DetailContext.Provider;

export const useDetail = () => {
  return use(DetailContext);
};

type FieldContext = {
  field: Field;
  setField: (field: Field) => void;
  messages: Record<string, MessageData>;
};

export const useField = (): FieldContext => {
  return useDetail() as FieldContext;
};

type EntityFieldContext = {
  field: EntityClassField;
  setField: (field: EntityClassField) => void;
  messages: Record<string, MessageData>;
};

export const useEntityField = (): EntityFieldContext => {
  return useField() as EntityFieldContext;
};
