import type { EntityField } from '@axonivy/dataclass-editor-protocol';
import { useEntityField } from '../../../context/DetailContext';

export const useFieldEntityProperty = () => {
  const { field, setField } = useEntityField();
  const setProperty = <FEKey extends keyof EntityField>(key: FEKey, value: EntityField[FEKey]) => {
    const newField = structuredClone(field);
    newField.entity[key] = value;
    setField(newField);
  };
  return { field, setProperty };
};
