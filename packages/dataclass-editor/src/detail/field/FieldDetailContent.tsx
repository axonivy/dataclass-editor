import { Accordion, AccordionContent, AccordionItem, AccordionState, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import { useField } from '../../context/DetailContext';
import { isEntityField } from '../../data/dataclass-utils';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';
import { useFieldProperty } from './useFieldProperty';

export const FieldDetailContent = () => {
  const { isPersistable } = useAppContext();
  const { field, messages } = useField();
  const { setProperty } = useFieldProperty();

  return (
    <Accordion type='single' collapsible defaultValue='general' className='dataclass-editor-field-detail'>
      <AccordionItem value='general'>
        <AccordionTrigger
          state={<AccordionState messages={combineMessagesOfProperties(messages, 'NAME', 'TYPE', 'PROPERTIES_GENERAL', 'ANNOTATION')} />}
        >
          General
        </AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <FieldNameTypeComment />
            {isPersistable && <FieldProperties />}
            <AnnotationsTable
              annotations={field.annotations}
              setAnnotations={(annotations: Array<string>) => setProperty('annotations', annotations)}
              message={messages.ANNOTATION}
            />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntityField(field) && (
        <AccordionItem value='entity'>
          <AccordionTrigger
            state={
              <AccordionState
                messages={combineMessagesOfProperties(
                  messages,
                  'DB_FIELD_NAME',
                  'DB_FIELD_LENGTH',
                  'PROPERTIES_ENTITY',
                  'CARDINALITY',
                  'MAPPED_BY'
                )}
              />
            }
          >
            Entity
          </AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <FieldEntityDatabaseField />
              <FieldEntityAssociation />
            </Flex>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
