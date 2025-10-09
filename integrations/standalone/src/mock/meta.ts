import type { DataClassEditorFieldContext, DataclassType, JavaType, MappedByFieldsContext } from '@axonivy/dataclass-editor-protocol';

export const cardinalities = (context: DataClassEditorFieldContext) => {
  if (context.field.startsWith('entity') || context.field.startsWith('invalidField')) {
    return ['ONE_TO_ONE', 'MANY_TO_ONE'];
  }
  if (context.field.startsWith('entities')) {
    return ['ONE_TO_MANY'];
  }
  return [];
};

export const mappedByFields = (context: MappedByFieldsContext) => {
  if (context.cardinality === 'ONE_TO_ONE') {
    return ['MappedByFieldName'];
  }
  return [];
};

export const DATACLASS: DataclassType[] = [
  {
    name: 'Person',
    fullQualifiedName: 'ch.ivyteam.test.Person',
    packageName: 'ch.ivyteam.test',
    path: 'dataclasses/ch/ivyteam/test/Person.ivyClass'
  },
  {
    name: 'List',
    packageName: 'java.util',
    fullQualifiedName: 'java.util.List',
    path: 'thisisaTest'
  }
];

export const DATATYPE: JavaType[] = [
  {
    simpleName: 'AddContactData',
    fullQualifiedName: 'ch.ivyteam.documentation.project.AddContactData',
    packageName: 'ch.ivyteam.documentation.project'
  },
  {
    simpleName: 'Person',
    fullQualifiedName: 'ch.ivyteam.test.Person',
    packageName: 'ch.ivyteam.test'
  },
  {
    simpleName: 'List',
    packageName: 'java.util',
    fullQualifiedName: 'java.util.List'
  }
];
