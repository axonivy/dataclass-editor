import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { rowClass } from './ValidationRow';

test('rowClass', () => {
  expect(rowClass([])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }] as Array<ValidationResult>)).toEqual('');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }] as Array<ValidationResult>)).toEqual('dataclass-editor-row-warning');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as Array<ValidationResult>)).toEqual(
    'dataclass-editor-row-error'
  );
});
