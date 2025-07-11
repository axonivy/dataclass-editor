import type { EntityClassField } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../../context/test-utils/test-utils';
import { useFieldEntityProperty } from './useFieldEntityProperty';

test('useFieldEntityProperty', () => {
  const field = { entity: { databaseName: 'databaseName' } } as EntityClassField;
  let newField = {} as EntityClassField;
  const view = customRenderHook(() => useFieldEntityProperty(), {
    wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
  });
  expect(view.result.current.field).toEqual(field);

  const originalField = structuredClone(field);
  view.result.current.setProperty('databaseName', 'NewDatabaseName');
  expect(field).toEqual(originalField);

  expect(newField.entity.databaseName).toEqual('NewDatabaseName');
});
