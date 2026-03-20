import { type EntityField, type Field, type Modifier } from '@axonivy/dataclass-editor-protocol';
import { Badge, Flex, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import type { ComponentProps, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useCardinalities, useCascadeTypes, useModifiers } from '../../utils/useLabels';

type FieldBadgesProps = {
  field: Field;
};

export const FieldBadges = ({ field }: FieldBadgesProps) => {
  const entityProperties = field.modifiers.filter(modifier => modifier !== 'PERSISTENT');

  return (
    <Flex gap={1}>
      {field.entity?.association && <FieldBadge value='C' variant='orange' tooltip={<CardinalityTooltipContent entity={field.entity} />} />}
      {entityProperties.length !== 0 && (
        <FieldBadge value='E' variant='green' tooltip={<PropertyTooltipContent entityProperties={entityProperties} />} />
      )}
      {field.annotations.length !== 0 && (
        <FieldBadge value='A' variant='blue' tooltip={<AnnotationTooltipContent annotations={field.annotations} />} />
      )}
      {field.modifiers.includes('PERSISTENT') && <FieldBadge value='P' variant='purple' tooltip={<PersistentTooltipContent />} />}
    </Flex>
  );
};

type FieldBadgeProps = {
  value: string;
  variant: ComponentProps<typeof Badge>['variant'];
  tooltip: ReactNode;
};

const FieldBadge = ({ value, variant, tooltip }: FieldBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge size='s' variant={variant} className='size-5'>
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AnnotationTooltipContent = ({ annotations }: { annotations: string[] }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <b>{t('label.annotations')}</b>
      </div>
      {annotations.map((annotation, index) => (
        <div key={index}>{simpleAnnotationName(annotation)}</div>
      ))}
    </>
  );
};

const PersistentTooltipContent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <b>{t('common.label.properties')}</b>
      </div>
      <div>{t('modifier.persistent')}</div>
    </>
  );
};

const PropertyTooltipContent = ({ entityProperties }: { entityProperties: Modifier[] }) => {
  const { t } = useTranslation();
  const modifierLabels = useModifiers();
  return (
    <>
      <div>
        <b>{t('label.entityProperties')}</b>
      </div>
      {entityProperties.map(modifier => (
        <div key={modifier}>{modifierLabels[modifier]}</div>
      ))}
    </>
  );
};

const CardinalityTooltipContent = ({ entity }: { entity: EntityField }) => {
  const { t } = useTranslation();
  const cardinalityLabels = useCardinalities();
  const cascadeTypeLabels = useCascadeTypes();
  if (entity.association === undefined) {
    return null;
  }
  return (
    <>
      <div>
        <b>{t('label.cardinality')}</b>
      </div>
      <div>{cardinalityLabels[entity.association]}</div>
      {entity.cascadeTypes.length !== 0 && (
        <>
          <div>
            <b>{t('label.cascade')}</b>
          </div>
          {entity.cascadeTypes.map(cascadeType => (
            <div key={cascadeType}>{cascadeTypeLabels[cascadeType]}</div>
          ))}
        </>
      )}
      {entity.mappedByFieldName && (
        <>
          <div>
            <b>{t('label.mappedBy')}</b>
          </div>
          <div>{entity.mappedByFieldName}</div>
          {entity.orphanRemoval && <div>{t('label.removeOrphans')}</div>}
        </>
      )}
    </>
  );
};

const fullQualifiedAnnotationRegex = /@(?:[\w]+\.)*([\w]+)(\(.*|$)/g;
export const simpleAnnotationName = (fullQualifiedAnnotation: string) => {
  return fullQualifiedAnnotation.replace(fullQualifiedAnnotationRegex, (_fullQualifiedAnnotation, annotationName) => annotationName);
};
