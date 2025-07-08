import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useEntityClass } from '../../../context/AppContext';
import { useEntityProperty } from './useEntityProperty';
import { useTranslation } from 'react-i18next';

export const EntityClassDatabaseTable = () => {
  const { entityClass } = useEntityClass();
  const setProperty = useEntityProperty();
  const { t } = useTranslation();

  return (
    <Collapsible defaultOpen={entityClass.entity.tableName !== ''}>
      <CollapsibleTrigger>{t('label.dbTable')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label={t('common.label.name')}>
            <BasicInput value={entityClass.entity.tableName} onChange={event => setProperty('tableName', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
