import { BasicInscriptionTabs, Flex, type InscriptionTabProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useField } from '../../context/DetailContext';
import { isEntityField } from '../../data/dataclass-utils';
import { combineMessagesOfProperties, getTabState } from '../../data/validation-utils';
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
  const { t } = useTranslation();
  const [value, setValue] = useState('General');
  const tabs: InscriptionTabProps[] = [
    {
      content: (
        <Flex direction='column' gap={3} className='dataclass-editor-field-detail'>
          <FieldNameTypeComment />
          {isPersistable && <FieldProperties />}
          <AnnotationsTable
            annotations={field.annotations}
            setAnnotations={(annotations: Array<string>) => setProperty('annotations', annotations)}
            message={messages.ANNOTATION}
          />
        </Flex>
      ),
      icon: IvyIcons.InfoCircle,
      id: 'General',
      name: t('common.label.general'),
      state: getTabState(combineMessagesOfProperties(messages, 'NAME', 'TYPE', 'PROPERTIES_GENERAL', 'ANNOTATION'))
    },
    ...(isEntityField(field)
      ? [
          {
            content: (
              <Flex direction='column' gap={3}>
                <FieldEntityDatabaseField />
                <FieldEntityAssociation />
              </Flex>
            ),
            icon: IvyIcons.Database,
            id: 'Entity',
            name: t('label.entity'),
            state: getTabState(
              combineMessagesOfProperties(messages, 'DB_FIELD_NAME', 'DB_FIELD_LENGTH', 'PROPERTIES_ENTITY', 'CARDINALITY', 'MAPPED_BY')
            )
          }
        ]
      : [])
  ];
  return <BasicInscriptionTabs value={value} onChange={setValue} tabs={tabs} />;
};
