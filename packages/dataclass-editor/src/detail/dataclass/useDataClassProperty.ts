import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { useAppContext } from '../../context/AppContext';

export const useDataClassProperty = () => {
  const { dataClass, setDataClass } = useAppContext();
  const setProperty = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) => {
    setDataClass(old => {
      const newDataClass = structuredClone(old);
      newDataClass[key] = value;
      return newDataClass;
    });
  };
  return { dataClass, setProperty };
};
