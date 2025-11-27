import type { DataClassData, ValidationResult } from '@axonivy/dataclass-editor-protocol';

export const dataClass: DataClassData = {
  context: { app: '', pmv: '', file: '' },
  data: {
    $schema: 'https://json-schema.axonivy.com/data-class/11.4.0/data-class.json',
    simpleName: 'Interview',
    namespace: 'workflow.businesscasedata',
    comment: 'Information about an interview.',
    annotations: ['@full.qualified.name.one(argument = "value")', '@full.qualified.name.two'],
    isBusinessCaseData: false,
    fields: [
      {
        name: 'firstName',
        type: 'String',
        modifiers: ['PERSISTENT'],
        comment: 'The first name of the interviewee.',
        annotations: []
      },
      {
        name: 'lastName',
        type: 'String',
        modifiers: ['PERSISTENT'],
        comment: 'The last name of the interviewee.',
        annotations: [
          '@javax.persistence.ManyToMany',
          '@javax.persistence.JoinTable(name = "tableName", joinColumns = { @JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
        ]
      },
      {
        name: 'date',
        type: 'Date',
        modifiers: ['PERSISTENT'],
        comment: '',
        annotations: []
      },
      {
        name: 'conversation',
        type: 'mock.Conversation',
        modifiers: [],
        comment: 'Transcript of the conversation.',
        annotations: []
      },
      {
        name: 'entity',
        type: 'mock.Entity',
        modifiers: ['PERSISTENT'],
        comment: 'An entity.',
        annotations: []
      },
      {
        name: 'entities',
        type: 'List<mock.Entity>',
        modifiers: ['PERSISTENT'],
        comment: 'A list of entities.',
        annotations: []
      }
    ]
  },
  helpUrl: 'https://dev.axonivy.com',
  isPersistable: true
};

export const validations = (dataClassData: DataClassData): Array<ValidationResult> => {
  const validations = [
    {
      message: 'invalidField0 name info',
      path: 'invalidField0.NAME',
      severity: 'INFO'
    },
    {
      message: 'invalidField0 name warning',
      path: 'invalidField0.NAME',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 name error',
      path: 'invalidField0.NAME',
      severity: 'ERROR'
    },
    {
      message: 'invalidField0 type warning',
      path: 'invalidField0.TYPE',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 type info',
      path: 'invalidField0.TYPE',
      severity: 'INFO'
    },
    {
      message: 'invalidField0 properties general',
      path: 'invalidField0.PROPERTIES_GENERAL',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 annotation',
      path: 'invalidField0.ANNOTATION',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 db field name',
      path: 'invalidField0.DB_FIELD_NAME',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 db field length',
      path: 'invalidField0.DB_FIELD_LENGTH',
      severity: 'INFO'
    },
    {
      message: 'invalidField0 properties entity',
      path: 'invalidField0.PROPERTIES_ENTITY',
      severity: 'INFO'
    },
    {
      message: 'invalidField0 cardinality',
      path: 'invalidField0.CARDINALITY',
      severity: 'WARNING'
    },
    {
      message: 'invalidField0 mapped by',
      path: 'invalidField0.MAPPED_BY',
      severity: 'ERROR'
    },
    {
      message: 'invalidField1 info',
      path: 'invalidField1.NAME',
      severity: 'INFO'
    },
    {
      message: 'invalidField1 warning',
      path: 'invalidField1.NAME',
      severity: 'WARNING'
    },
    {
      message: 'invalidField2 info',
      path: 'invalidField2.NAME',
      severity: 'INFO'
    }
  ];
  if (dataClassData.data.annotations.includes('invalidAnnotation')) {
    validations.push({
      message: 'class annotation',
      path: '#class.ANNOTATION',
      severity: 'ERROR'
    });
  }
  return validations as Array<ValidationResult>;
};
