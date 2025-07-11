import type { CascadeType, EntityClassField } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../../context/test-utils/test-utils';
import { useCascadeType } from './FieldEntityCascadeTypeCheckbox';

describe('useCascadeType', () => {
  test('add', () => {
    const field = { entity: { cascadeTypes: ['MERGE', 'PERSIST'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('REFRESH'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeFalsy();

    const originalField = structuredClone(field);
    view.result.current.setCascadeType(true);
    expect(field).toEqual(originalField);

    expect(newField.entity.cascadeTypes).toEqual(['MERGE', 'PERSIST', 'REFRESH']);
  });

  test('remove', () => {
    const field = { entity: { cascadeTypes: ['MERGE', 'PERSIST'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('MERGE'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeTruthy();

    const originalField = structuredClone(field);
    view.result.current.setCascadeType(false);
    expect(field).toEqual(originalField);

    expect(newField.entity.cascadeTypes).toEqual(['PERSIST']);
  });

  test('add ALL', () => {
    const field = { entity: { cascadeTypes: ['MERGE', 'PERSIST'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('ALL'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeFalsy();

    const originalField = structuredClone(field);
    view.result.current.setCascadeType(true);
    expect(field).toEqual(originalField);

    expect(newField.entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove ALL', () => {
    const field = { entity: { cascadeTypes: ['ALL'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('ALL'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeTruthy();

    const originalField = structuredClone(field);
    view.result.current.setCascadeType(false);
    expect(field).toEqual(originalField);

    expect(newField.entity.cascadeTypes).toEqual([]);
  });

  test('add last', () => {
    const field = { entity: { cascadeTypes: ['MERGE', 'PERSIST', 'REMOVE'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('REFRESH'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeFalsy();

    const originalDataClass = structuredClone(field);
    view.result.current.setCascadeType(true);
    expect(field).toEqual(originalDataClass);

    expect(newField.entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove first', () => {
    const field = { entity: { cascadeTypes: ['ALL'] } } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCascadeType('MERGE'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.checked).toBeTruthy();

    const originalDataClass = structuredClone(field);
    view.result.current.setCascadeType(false);
    expect(field).toEqual(originalDataClass);

    expect(newField.entity.cascadeTypes).toEqual(['PERSIST', 'REMOVE', 'REFRESH']);
  });

  describe('disabled', () => {
    test('true', () => {
      const field = { entity: { cascadeTypes: [] as Array<CascadeType> } } as EntityClassField;
      const view = customRenderHook(() => useCascadeType('ALL'), {
        wrapperProps: { detailContext: { field } }
      });
      expect(view.result.current.isDisabled).toBeTruthy();
    });

    test('false', () => {
      const field = {
        entity: { association: 'ONE_TO_ONE', cascadeTypes: [] as Array<CascadeType> }
      } as EntityClassField;
      const view = customRenderHook(() => useCascadeType('ALL'), {
        wrapperProps: { detailContext: { field } }
      });
      expect(view.result.current.isDisabled).toBeFalsy();
    });
  });
});
