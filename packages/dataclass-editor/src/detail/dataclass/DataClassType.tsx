import { BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import type { DataClassType as ClassType, DataClass } from '@axonivy/dataclass-editor-protocol';
import { classTypeOf } from '../../data/dataclass-utils';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useClassType = () => {
  const { dataClass, setDataClass } = useAppContext();
  const setClassType = (classType: ClassType) => {
    setDataClass(old => {
      const newDataClass = structuredClone(old);

      newDataClass.isBusinessCaseData = false;
      newDataClass.entity = undefined;
      newDataClass.fields.forEach(field => {
        field.modifiers = field.modifiers.filter(modifier => modifier === 'PERSISTENT');
        field.entity = undefined;
      });

      if (classType === 'BUSINESS_DATA') {
        newDataClass.isBusinessCaseData = true;
      } else if (classType === 'ENTITY') {
        changeToEntityClass(newDataClass);
      }
      return newDataClass;
    });
  };
  return { classType: classTypeOf(dataClass), setClassType };
};

const changeToEntityClass = (newDataClass: DataClass) => {
  newDataClass.entity = { tableName: '', generateRepo: false };
  newDataClass.fields.forEach(
    field =>
      (field.entity = {
        databaseName: '',
        databaseFieldLength: '',
        cascadeTypes: ['PERSIST', 'MERGE'],
        mappedByFieldName: '',
        orphanRemoval: false
      })
  );
  if (!newDataClass.fields.some(field => field.name === 'id')) {
    newDataClass.fields.unshift({
      name: 'id',
      type: 'Integer',
      comment: 'Identifier',
      modifiers: ['PERSISTENT', 'ID', 'GENERATED'],
      annotations: [],
      entity: {
        databaseName: '',
        databaseFieldLength: '',
        cascadeTypes: ['PERSIST', 'MERGE'],
        mappedByFieldName: '',
        orphanRemoval: false
      }
    });
  }
};

export const DataClassType = () => {
  const { classType, setClassType } = useClassType();
  const { t } = useTranslation();
  const items = useMemo<Array<{ value: ClassType; label: string }>>(
    () => [
      { value: 'DATA', label: t('label.data') },
      { value: 'BUSINESS_DATA', label: t('label.businessData') },
      { value: 'ENTITY', label: t('label.entity') }
    ],
    [t]
  );

  return (
    <Collapsible>
      <CollapsibleTrigger>{t('label.classType')}</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicSelect value={classType} items={items} onValueChange={setClassType} />
      </CollapsibleContent>
    </Collapsible>
  );
};
