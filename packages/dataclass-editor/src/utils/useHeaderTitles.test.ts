import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../context/test-utils/test-utils';
import { useHeaderTitles } from './useHeaderTitles';

test('empty', () => {
  const { result } = customRenderHook(() => useHeaderTitles());
  expect(result.current.masterTitle).toEqual('Data Class - ');
  expect(result.current.detailTitle).toEqual('Data Class - ');
});

test('data class', () => {
  const dataClass = { simpleName: 'DataClassName' } as DataClass;
  const { result } = customRenderHook(() => useHeaderTitles(), { wrapperProps: { appContext: { dataClass } } });
  expect(result.current.masterTitle).toEqual('Data Class - DataClassName');
  expect(result.current.detailTitle).toEqual('Data Class - DataClassName');
});

test('businessData', () => {
  const dataClass = { simpleName: 'BusinessDataClassName', isBusinessCaseData: true } as DataClass;
  const { result } = customRenderHook(() => useHeaderTitles(), { wrapperProps: { appContext: { dataClass } } });
  expect(result.current.masterTitle).toEqual('Business Data Class - BusinessDataClassName');
  expect(result.current.detailTitle).toEqual('Business Data Class - BusinessDataClassName');
});

test('entity', () => {
  const dataClass = { simpleName: 'EntityClassName', entity: {} } as DataClass;
  const { result } = customRenderHook(() => useHeaderTitles(), { wrapperProps: { appContext: { dataClass } } });
  expect(result.current.masterTitle).toEqual('Entity Class - EntityClassName');
  expect(result.current.detailTitle).toEqual('Entity Class - EntityClassName');
});

test('attribute', () => {
  const dataClass = { fields: [{ name: 'FieldName0' }, { name: 'FieldName1' }] } as DataClass;
  const { result } = customRenderHook(() => useHeaderTitles(), { wrapperProps: { appContext: { dataClass, selectedField: 1 } } });
  expect(result.current.masterTitle).toEqual('Data Class - ');
  expect(result.current.detailTitle).toEqual('Attribute - FieldName1');
});
