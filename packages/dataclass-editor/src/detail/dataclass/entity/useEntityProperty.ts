import type { EntityClass } from '@axonivy/dataclass-editor-protocol';
import { useEntityClass } from '../../../context/AppContext';

export const useEntityProperty = () => {
  const { setEntityClass } = useEntityClass();
  const setProperty = <EKey extends keyof EntityClass>(key: EKey, value: EntityClass[EKey]) => {
    setEntityClass(old => {
      const newEntityClass = structuredClone(old);
      newEntityClass.entity[key] = value;
      return newEntityClass;
    });
  };
  return setProperty;
};
