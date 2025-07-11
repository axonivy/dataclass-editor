import type { Field } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../context/test-utils/test-utils';
import { useFieldProperty } from './useFieldProperty';

test('useFieldProperty', () => {
  const field = { name: 'name' } as Field;
  let newField = {} as Field;
  const view = customRenderHook(() => useFieldProperty(), {
    wrapperProps: { detailContext: { field, setField: field => (newField = field) } }
  });
  expect(view.result.current.field).toEqual(field);

  const originalField = structuredClone(field);
  view.result.current.setProperty('name', 'NewName');
  expect(field).toEqual(originalField);

  expect(newField.name).toEqual('NewName');
});
