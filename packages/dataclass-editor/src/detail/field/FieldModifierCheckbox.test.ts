import type { EntityClassField, Field, Modifier } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../context/test-utils/test-utils';
import { useModifier } from './FieldModifierCheckbox';

describe('useModifier', () => {
  test('add', () => {
    const field = { modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] } as Field;
    let newField = {} as Field;
    const view = customRenderHook(() => useModifier('UNIQUE'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.checked).toBeFalsy();

    const originalField = structuredClone(field);
    view.result.current.setModifier(true);
    expect(field).toEqual(originalField);

    expect(newField.modifiers).toEqual(['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'UNIQUE']);
  });

  test('remove', () => {
    const field = { modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] } as Field;
    let newField = {} as Field;
    const view = customRenderHook(() => useModifier('NOT_INSERTABLE'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.checked).toBeTruthy();

    const originalField = structuredClone(field);
    view.result.current.setModifier(false);
    expect(field).toEqual(originalField);

    expect(newField.modifiers).toEqual(['PERSISTENT', 'NOT_NULLABLE']);
  });

  describe('id', () => {
    test('add', () => {
      const field = { modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] } as Field;
      let newField = {} as Field;
      const view = customRenderHook(() => useModifier('ID'), {
        wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.checked).toBeFalsy();

      const originalField = structuredClone(field);
      view.result.current.setModifier(true);
      expect(field).toEqual(originalField);

      expect(newField.modifiers).toEqual(['PERSISTENT', 'ID']);
    });

    test('remove', () => {
      const field = { modifiers: ['PERSISTENT', 'ID', 'GENERATED'] } as Field;
      let newField = {} as Field;
      const view = customRenderHook(() => useModifier('ID'), {
        wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.checked).toBeTruthy();

      const originalField = structuredClone(field);
      view.result.current.setModifier(false);
      expect(field).toEqual(originalField);

      expect(newField.modifiers).toEqual(['PERSISTENT']);
    });
  });

  test('version', () => {
    const field = { modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] } as Field;
    let newField = {} as Field;
    const view = customRenderHook(() => useModifier('VERSION'), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.checked).toBeFalsy();

    const originalDataClass = structuredClone(field);
    view.result.current.setModifier(true);
    expect(field).toEqual(originalDataClass);

    expect(newField.modifiers).toEqual(['PERSISTENT', 'VERSION']);
  });

  describe('disabled', () => {
    describe('id', () => {
      describe('true', () => {
        test('mappedByFieldName is set', () => {
          const field = {
            type: 'String',
            modifiers: [] as Array<Modifier>,
            entity: { mappedByFieldName: 'mappedByFieldName' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('ID'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });

        test('has version modifier', () => {
          const field = {
            type: 'String',
            modifiers: ['VERSION'],
            entity: { mappedByFieldName: '' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('ID'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });

        test('has no id type', () => {
          const field = {
            type: 'Date',
            modifiers: [] as Array<Modifier>,
            entity: { mappedByFieldName: '' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('ID'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });
      });

      test('false', () => {
        const field = {
          type: 'String',
          modifiers: [] as Array<Modifier>,
          entity: { mappedByFieldName: '' }
        } as EntityClassField;
        const view = customRenderHook(() => useModifier('ID'), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });
    });

    describe('generated', () => {
      describe('true', () => {
        test('mappedByFieldName is set', () => {
          const field = {
            modifiers: ['ID'],
            entity: { mappedByFieldName: 'mappedByFieldName' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('GENERATED'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });

        test('has not id modifier', () => {
          const field = {
            modifiers: [] as Array<Modifier>,
            entity: { mappedByFieldName: '' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('GENERATED'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });
      });

      test('false', () => {
        const field = {
          modifiers: ['ID'],
          entity: { mappedByFieldName: '' }
        } as EntityClassField;
        const view = customRenderHook(() => useModifier('GENERATED'), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });
    });

    describe('version', () => {
      describe('true', () => {
        test('mappedByFieldName is set', () => {
          const field = {
            type: 'Short',
            modifiers: [] as Array<Modifier>,
            entity: { mappedByFieldName: 'mappedByFieldName' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('VERSION'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });

        test('has id modifier', () => {
          const field = {
            type: 'Short',
            modifiers: ['ID'],
            entity: { mappedByFieldName: '' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('VERSION'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });

        test('has no id type', () => {
          const field = {
            type: 'Date',
            modifiers: [] as Array<Modifier>,
            entity: { mappedByFieldName: '' }
          } as EntityClassField;
          const view = customRenderHook(() => useModifier('VERSION'), {
            wrapperProps: { detailContext: { field } }
          });
          expect(view.result.current.isDisabled).toBeTruthy();
        });
      });

      test('false', () => {
        const field = {
          type: 'Short',
          modifiers: [] as Array<Modifier>,
          entity: { mappedByFieldName: '' }
        } as EntityClassField;
        const view = customRenderHook(() => useModifier('VERSION'), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });
    });
  });
});
