import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../context/test-utils/test-utils';
import { useValidateField } from './AddFieldDialog';

const dataClass = {
  fields: [{ name: 'takenName' }]
} as DataClass;

describe('useValidateField', () => {
  test('nameMessage', () => {
    expect(renderValidateFieldHook('valid', 'valid', dataClass).result.current.nameMessage).toBeUndefined();
    expect(renderValidateFieldHook('   ', 'valid', dataClass).result.current.nameMessage).toEqual({
      message: 'Name cannot be empty.',
      variant: 'error'
    });
    expect(renderValidateFieldHook('takenName', 'valid', dataClass).result.current.nameMessage).toEqual({
      message: 'Name is already taken.',
      variant: 'error'
    });
  });

  test('typeMessage', () => {
    expect(renderValidateFieldHook('valid', 'valid', dataClass).result.current.typeMessage).toBeUndefined();
    expect(renderValidateFieldHook('valid', '   ', dataClass).result.current.typeMessage).toEqual({
      message: 'Type cannot be empty.',
      variant: 'error'
    });
  });
});

const renderValidateFieldHook = (name: string, type: string, dataClass: DataClass) =>
  customRenderHook(() => useValidateField(name, type), { wrapperProps: { appContext: { dataClass } } });
