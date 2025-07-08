import { customRenderHook } from '../../../context/test-utils/test-utils';
import type { EntityDataClass } from '@axonivy/dataclass-editor-protocol';
import { useEntityProperty } from './useEntityProperty';

test('useEntityProperty', () => {
  const entityClass = { entity: { tableName: 'tableName' } } as EntityDataClass;
  let newEntityClass = {} as EntityDataClass;
  const view = customRenderHook(() => useEntityProperty(), {
    wrapperProps: { entityClassContext: { entityClass, setEntityClass: entityClass => (newEntityClass = entityClass) } }
  });

  const originalEntityClass = structuredClone(entityClass);
  view.result.current('tableName', 'NewTableName');
  expect(entityClass).toEqual(originalEntityClass);

  expect(newEntityClass.entity.tableName).toEqual('NewTableName');
});
