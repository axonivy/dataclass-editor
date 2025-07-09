import { BasicCheckbox, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useEntityClass } from '../../../context/AppContext';
import { useEntityProperty } from './useEntityProperty';
import { useTranslation } from 'react-i18next';

export const EntityClassRepository = () => {
  const { entityClass } = useEntityClass();
  const setProperty = useEntityProperty();
  const { t } = useTranslation();

  return (
    <Collapsible defaultOpen={entityClass.entity.generateRepo === true}>
      <CollapsibleTrigger>{t('label.dataRepository')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicCheckbox
            label={t('label.generateRepository')}
            checked={entityClass.entity.generateRepo}
            onCheckedChange={event => setProperty('generateRepo', event.valueOf() as boolean)}
          />
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
