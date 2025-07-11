import { isIDType, isVersionType } from '@axonivy/dataclass-editor-protocol';
import {
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  Textarea
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useField } from '../../context/DetailContext';
import { isEntityField, updateCardinality, updateModifiers } from '../../data/dataclass-utils';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { InputFieldWithTypeBrowser } from './InputFieldWithTypeBrowser';
import { useFieldProperty } from './useFieldProperty';

export const useType = () => {
  const { field, setField } = useField();
  const setType = (type: string) => {
    const newField = structuredClone(field);
    if (!isIDType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'ID');
    }
    if (!isVersionType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'VERSION');
    }
    if (isEntityField(newField)) {
      updateCardinality(newField);
    }
    newField.type = type;
    setField(newField);
  };
  return { type: field.type, setType };
};

export const FieldNameTypeComment = () => {
  const { messages } = useField();
  const { field, setProperty } = useFieldProperty();
  const { type, setType } = useType();
  const { t } = useTranslation();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messages, 'NAME', 'TYPE')} />}>
        {t('label.nameTypeComment')}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label={t('common.label.name')} message={messages.NAME}>
            <BasicInput value={field.name} onChange={event => setProperty('name', event.target.value)} />
          </BasicField>
          <InputFieldWithTypeBrowser value={type} onChange={setType} message={messages.TYPE} />
          <BasicField label={t('common.label.comment')}>
            <Textarea value={field.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
