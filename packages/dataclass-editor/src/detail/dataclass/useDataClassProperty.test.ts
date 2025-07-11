import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../context/test-utils/test-utils';
import { useDataClassProperty } from './useDataClassProperty';

test('useDataClassProperty', () => {
  const dataClass = { simpleName: 'simpleName' } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassProperty(), {
    wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
  });
  expect(view.result.current.dataClass).toEqual(dataClass);

  const originalDataClass = structuredClone(dataClass);
  view.result.current.setProperty('simpleName', 'NewSimpleName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.simpleName).toEqual('NewSimpleName');
});
