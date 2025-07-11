import { type Field } from '@axonivy/dataclass-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useCardinalities, useCascadeTypes, useModifiers } from '../../utils/useLabels';
import { Badge } from './Badge';
import './FieldBadges.css';

type FieldBadgesProps = {
  field: Field;
};

export const FieldBadges = ({ field }: FieldBadgesProps) => {
  const entityProperties = field.modifiers.filter(modifier => modifier !== 'PERSISTENT');
  const { t } = useTranslation();
  const cardinalityLabels = useCardinalities();
  const cascadeTypeLabels = useCascadeTypes();
  const modifierLabels = useModifiers();
  return (
    <Flex gap={1} className='dataclass-editor-badges'>
      {field.entity?.association && (
        <Badge
          value='C'
          className='dataclass-editor-cardinality-badge'
          tooltip={
            <>
              <div>
                <b>{t('label.cardinality')}</b>
              </div>
              <div>{cardinalityLabels[field.entity.association]}</div>
              {field.entity.cascadeTypes.length !== 0 && (
                <>
                  <div>
                    <b>{t('label.cascade')}</b>
                  </div>
                  {field.entity.cascadeTypes.map(cascadeType => (
                    <div key={cascadeType}>{cascadeTypeLabels[cascadeType]}</div>
                  ))}
                </>
              )}
              {field.entity.mappedByFieldName && (
                <>
                  <div>
                    <b>{t('label.mappedBy')}</b>
                  </div>
                  <div>{field.entity.mappedByFieldName}</div>
                  {field.entity.orphanRemoval && <div>{t('label.removeOrphans')}</div>}
                </>
              )}
            </>
          }
        />
      )}
      {entityProperties.length !== 0 && (
        <Badge
          value='E'
          className='dataclass-editor-entity-properties-badge'
          tooltip={
            <>
              <div>
                <b>{t('label.entityProperties')}</b>
              </div>
              {entityProperties.map(modifier => (
                <div key={modifier}>{modifierLabels[modifier]}</div>
              ))}
            </>
          }
        />
      )}
      {field.annotations.length !== 0 && (
        <Badge
          value='A'
          className='dataclass-editor-annotations-badge'
          tooltip={
            <>
              <div>
                <b>{t('label.annotations')}</b>
              </div>
              {field.annotations.map((annotation, index) => (
                <div key={index}>{simpleAnnotationName(annotation)}</div>
              ))}
            </>
          }
        />
      )}
      {field.modifiers.includes('PERSISTENT') && (
        <Badge
          value='P'
          className='dataclass-editor-properties-badge'
          tooltip={
            <>
              <div>
                <b>{t('common.label.properties')}</b>
              </div>
              <div>{t('modifier.persistent')}</div>
            </>
          }
        />
      )}
    </Flex>
  );
};

const fullQualifiedAnnotationRegex = /@(?:[\w]+\.)*([\w]+)(\(.*|$)/g;
export const simpleAnnotationName = (fullQualifiedAnnotation: string) => {
  return fullQualifiedAnnotation.replace(fullQualifiedAnnotationRegex, (_fullQualifiedAnnotation, annotationName) => annotationName);
};
