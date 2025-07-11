import {
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useEntityField } from '../../../context/DetailContext';
import { combineMessagesOfProperties } from '../../../data/validation-utils';
import { useModifiers } from '../../../utils/useLabels';
import { FieldModifierCheckbox } from '../FieldModifierCheckbox';
import { useFieldEntityProperty } from './useFieldEntityProperty';

const DATABASE_TYPE_LENGTHS = {
  String: '255',
  BigInteger: '19,2',
  BigDecimal: '19,2'
} as const;

export const typeCanHaveDatabaseLength = (type: string) => Object.hasOwn(DATABASE_TYPE_LENGTHS, type);
export const defaultLengthOfType = (type: string) => DATABASE_TYPE_LENGTHS[type as keyof typeof DATABASE_TYPE_LENGTHS] || '';

export const FieldEntityDatabaseField = () => {
  const { messages } = useEntityField();
  const { field, setProperty } = useFieldEntityProperty();
  const { t } = useTranslation();
  const modifierLabels = useModifiers();

  const mappedByFieldNameIsSet = field.entity.mappedByFieldName !== '';
  const canHaveDatabaseLength = typeCanHaveDatabaseLength(field.type);

  return (
    <Collapsible
      defaultOpen={
        (!mappedByFieldNameIsSet && field.entity.databaseName !== '') ||
        (canHaveDatabaseLength && field.entity.databaseFieldLength !== '') ||
        field.modifiers.some(modifier => modifier !== 'PERSISTENT')
      }
    >
      <CollapsibleTrigger
        state={
          <CollapsibleState messages={combineMessagesOfProperties(messages, 'DB_FIELD_NAME', 'DB_FIELD_LENGTH', 'PROPERTIES_ENTITY')} />
        }
      >
        {t('label.dbField')}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label={t('common.label.name')} message={messages.DB_FIELD_NAME}>
            <BasicInput
              value={mappedByFieldNameIsSet ? '' : field.entity.databaseName}
              onChange={event => setProperty('databaseName', event.target.value)}
              placeholder={mappedByFieldNameIsSet ? '' : field.name}
              disabled={mappedByFieldNameIsSet}
            />
          </BasicField>
          <BasicField label={t('common.label.length')} message={messages.DB_FIELD_LENGTH}>
            <BasicInput
              value={canHaveDatabaseLength ? field.entity.databaseFieldLength : ''}
              onChange={event => setProperty('databaseFieldLength', event.target.value)}
              placeholder={defaultLengthOfType(field.type)}
              disabled={!canHaveDatabaseLength}
            />
          </BasicField>
          <BasicField label={t('common.label.properties')} message={messages.PROPERTIES_ENTITY} data-testid='database-field-properties'>
            <FieldModifierCheckbox label={modifierLabels.ID} modifier='ID' />
            <FieldModifierCheckbox label={modifierLabels.GENERATED} modifier='GENERATED' />
            <FieldModifierCheckbox label={modifierLabels.NOT_NULLABLE} modifier='NOT_NULLABLE' />
            <FieldModifierCheckbox label={modifierLabels.UNIQUE} modifier='UNIQUE' />
            <FieldModifierCheckbox label={modifierLabels.NOT_UPDATEABLE} modifier='NOT_UPDATEABLE' />
            <FieldModifierCheckbox label={modifierLabels.NOT_INSERTABLE} modifier='NOT_INSERTABLE' />
            <FieldModifierCheckbox label={modifierLabels.VERSION} modifier='VERSION' />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
