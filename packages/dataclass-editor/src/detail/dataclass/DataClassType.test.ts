import type { DataClass, Field, Modifier } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../context/test-utils/test-utils';
import { useClassType } from './DataClassType';

describe('useClassType', () => {
  const expectClassType = (dataClass: DataClass, isBusinessCaseData: boolean, hasEntity: boolean, modifiers: Array<Array<Modifier>>) => {
    expect(dataClass.isBusinessCaseData).toEqual(isBusinessCaseData);
    expect(!!dataClass.entity).toEqual(hasEntity);
    expect(dataClass.fields.every((field: Field) => !!field.entity === hasEntity)).toBeTruthy();
    expect(dataClass.fields).toHaveLength(modifiers.length);
    for (let i = 0; i < modifiers.length; i++) {
      expect(dataClass.fields[i].modifiers).toEqual(modifiers[i]);
    }
  };

  test('data to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
  });

  test('data to entity', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].name).toEqual('id');
    expect(newDataClass.fields[0].type).toEqual('Integer');
    expect(newDataClass.fields[0].comment).toEqual('Identifier');
    newDataClass.fields.forEach(field => expect(field.entity?.cascadeTypes).toEqual(['PERSIST', 'MERGE']));
    expectClassType(newDataClass, false, true, [['PERSISTENT', 'ID', 'GENERATED'], ['PERSISTENT'], []]);
  });

  test('business to data', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('BUSINESS_DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
  });

  test('business to entity', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('BUSINESS_DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].name).toEqual('id');
    expect(newDataClass.fields[0].type).toEqual('Integer');
    expect(newDataClass.fields[0].comment).toEqual('Identifier');
    newDataClass.fields.forEach(field => expect(field.entity?.cascadeTypes).toEqual(['PERSIST', 'MERGE']));
    expectClassType(newDataClass, false, true, [['PERSISTENT', 'ID', 'GENERATED'], ['PERSISTENT'], []]);
  });

  test('entity to data', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('ENTITY');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
  });

  test('entity to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('ENTITY');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
  });

  test('to entity but id is already present', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { name: 'id', modifiers: [] as Array<Modifier>, entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].name).not.toEqual('id');
    expect(newDataClass.fields[0].type).not.toEqual('Integer');
    expect(newDataClass.fields[0].comment).not.toEqual('Identifier');
    newDataClass.fields.forEach(field => expect(field.entity?.cascadeTypes).toEqual(['PERSIST', 'MERGE']));
    expectClassType(newDataClass, false, true, [['PERSISTENT'], [], []]);
  });
});
