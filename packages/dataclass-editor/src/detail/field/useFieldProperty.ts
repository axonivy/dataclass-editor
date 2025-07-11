import type { Field } from '@axonivy/dataclass-editor-protocol';
import { useField } from '../../context/DetailContext';

export const useFieldProperty = () => {
  const { field, setField } = useField();
  const setProperty = <FKey extends keyof Field>(key: FKey, value: Field[FKey]) => {
    const newField = structuredClone(field);
    newField[key] = value;
    setField(newField);
  };
  return { field, setProperty };
};
