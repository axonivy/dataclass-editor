import { BasicInscriptionTabs, Flex, type InscriptionTabProps, type UpdateConsumer } from '@axonivy/ui-components';
import { EntityClassProvider, useAppContext } from '../../context/AppContext';
import { isEntity } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { DataClassNameDescription } from './DataClassNameDescription';
import { DataClassType } from './DataClassType';
import { EntityClassDatabaseTable } from './entity/EntityClassDatabaseTable';
import { EntityClassRepository } from './entity/EntityClassRepository';
import { useDataClassProperty } from './useDataClassProperty';
import type { EntityDataClass } from '@axonivy/dataclass-editor-protocol';
import { combineMessagesOfProperties, getTabState } from '../../data/validation-utils';
import { useDetail } from '../../context/DetailContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass, isHdData } = useAppContext();
  const { messages } = useDetail();
  const { setProperty } = useDataClassProperty();
  const { t } = useTranslation();
  const [value, setValue] = useState('General');
  const tabs: InscriptionTabProps[] = [
    {
      content: (
        <Flex direction='column' gap={3} className='dataclass-editor-dataclass-detail'>
          <DataClassNameDescription />
          <AnnotationsTable
            annotations={dataClass.annotations}
            setAnnotations={(newAnnotations: Array<string>) => setProperty('annotations', newAnnotations)}
            message={messages.ANNOTATION}
          />
          {!isHdData && <DataClassType />}
        </Flex>
      ),
      icon: IvyIcons.InfoCircle,
      id: 'General',
      name: t('common.label.general'),
      state: getTabState(combineMessagesOfProperties(messages, 'NAMESPACE', 'ANNOTATION'))
    },
    ...(isEntity(dataClass)
      ? [
          {
            content: (
              <EntityClassProvider value={{ entityClass: dataClass, setEntityClass: setDataClass as UpdateConsumer<EntityDataClass> }}>
                <EntityClassDatabaseTable />
                <EntityClassRepository />
              </EntityClassProvider>
            ),
            icon: IvyIcons.Database,
            id: 'Entity',
            name: t('label.entity')
          }
        ]
      : [])
  ];
  return <BasicInscriptionTabs value={value} onChange={setValue} tabs={tabs} />;
};
