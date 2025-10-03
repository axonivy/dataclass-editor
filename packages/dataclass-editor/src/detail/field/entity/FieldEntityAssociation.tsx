import { type Association } from '@axonivy/dataclass-editor-protocol';
import {
  BasicCheckbox,
  BasicField,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  type MessageData
} from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useEntityField } from '../../../context/DetailContext';
import { useMeta } from '../../../context/useMeta';
import { updateCardinality } from '../../../data/dataclass-utils';
import { combineMessagesOfProperties } from '../../../data/validation-utils';
import { useCardinalities, useCascadeTypes } from '../../../utils/useLabels';
import './FieldEntityAssociation.css';
import { FieldEntityCascadeTypeCheckbox } from './FieldEntityCascadeTypeCheckbox';
import { useFieldEntityProperty } from './useFieldEntityProperty';

export const useMappedByFieldName = () => {
  const { field, setField } = useEntityField();
  const setMappedByFieldName = (mappedByFieldName: string) => {
    const newField = structuredClone(field);
    newField.modifiers = newField.modifiers.filter(modifier => modifier === 'PERSISTENT');
    newField.entity.mappedByFieldName = mappedByFieldName;
    setField(newField);
  };
  const isDisabled = field.entity.association !== 'ONE_TO_ONE' && field.entity.association !== 'ONE_TO_MANY';
  return { mappedByFieldName: field.entity.mappedByFieldName, setMappedByFieldName, isDisabled };
};

export const useCardinality = () => {
  const { field, setField } = useEntityField();
  const setCardinality = (association: Association) => {
    const newField = structuredClone(field);
    updateCardinality(newField, association);
    setField(newField);
  };
  return { cardinality: field.entity.association, setCardinality };
};

export const cardinalityMessage = (cardinality?: Association): MessageData | undefined => {
  if (cardinality === 'ONE_TO_MANY') {
    return {
      message: 'A One-to-Many association comes with a significant performance impact. Only use it if it is absolutely necessary.',
      variant: 'warning'
    };
  }
  return undefined;
};

export const FieldEntityAssociation = () => {
  const { messages } = useEntityField();
  const { context } = useAppContext();
  const { field, setProperty } = useFieldEntityProperty();
  const { mappedByFieldName, setMappedByFieldName, isDisabled: mappedByFieldNameIsDisabled } = useMappedByFieldName();
  const { cardinality, setCardinality } = useCardinality();
  const { t } = useTranslation();

  const fieldContext = { ...context, field: field.name };

  const cardinalityLabels = useCardinalities();
  const cardinalityItems = useMemo(
    () =>
      Object.entries(cardinalityLabels).map(([key, value]) => ({
        value: key as Association,
        label: value
      })),
    [cardinalityLabels]
  );

  const possibleCardinalities = useMeta('meta/entity/cardinalities', fieldContext, []).data;
  const cardinalities = cardinalityItems.filter(cardinality => possibleCardinalities.includes(cardinality.value));

  const mappedByFields = useMeta('meta/entity/mappedByFields', { ...fieldContext, cardinality }, []).data.map(mappedByField => ({
    value: mappedByField,
    label: mappedByField
  }));

  const cascadeTypeLabels = useCascadeTypes();

  return (
    possibleCardinalities.length !== 0 && (
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messages, 'CARDINALITY', 'MAPPED_BY')} />}>
          {t('label.association')}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={4}>
            <BasicField
              label={t('label.cardinality')}
              message={messages.CARDINALITY ?? cardinalityMessage(cardinality)}
              aria-label={t('label.cardinality')}
            >
              <BasicSelect value={cardinality} emptyItem items={cardinalities} onValueChange={setCardinality} />
            </BasicField>
            <BasicField label={t('label.cascade')}>
              <FieldEntityCascadeTypeCheckbox label={cascadeTypeLabels.ALL} cascadeType='ALL' />
              <Flex direction='column' gap={1} className='dataclass-editor-cascade-types'>
                <FieldEntityCascadeTypeCheckbox label={cascadeTypeLabels.PERSIST} cascadeType='PERSIST' />
                <FieldEntityCascadeTypeCheckbox label={cascadeTypeLabels.MERGE} cascadeType='MERGE' />
                <FieldEntityCascadeTypeCheckbox label={cascadeTypeLabels.REMOVE} cascadeType='REMOVE' />
                <FieldEntityCascadeTypeCheckbox label={cascadeTypeLabels.REFRESH} cascadeType='REFRESH' />
              </Flex>
            </BasicField>
            <BasicField label={t('label.mappedBy')} message={messages.MAPPED_BY}>
              <BasicSelect
                value={mappedByFieldName}
                emptyItem
                items={mappedByFields}
                onValueChange={setMappedByFieldName}
                disabled={mappedByFieldNameIsDisabled}
              />
            </BasicField>
            <BasicCheckbox
              label={t('label.removeOrphans')}
              checked={field.entity.orphanRemoval}
              onCheckedChange={event => setProperty('orphanRemoval', event.valueOf() as boolean)}
              disabled={mappedByFieldNameIsDisabled}
            />
          </Flex>
        </CollapsibleContent>
      </Collapsible>
    )
  );
};
