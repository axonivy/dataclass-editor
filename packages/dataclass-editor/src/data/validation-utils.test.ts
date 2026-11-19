import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { combineMessagesOfProperties, messagesByProperty, toMessageData, variant } from './validation-utils';

test('messagesByProperty', () => {
  expect(messagesByProperty([], () => {})).toEqual({});
  expect(
    messagesByProperty([
      { message: 'propertyOneInfo', path: 'field.propertyOne', severity: 'INFO', code: '', url: '' },
      { message: 'propertyTwoWarning', path: 'field.propertyTwo', severity: 'WARNING', code: '', url: '' },
      { message: 'propertyTwoInfo', path: 'field.propertyTwo', severity: 'INFO', code: '', url: '' },
      {
        message: 'propertyOneError',
        path: 'field.propertyOne',
        severity: 'ERROR',
        code: '',
        url: ''
      },
      { message: 'propertyThreeInfo', path: 'field.propertyThree', severity: 'INFO', code: '', url: '' },
      { message: 'propertyOneInfo', path: 'field.propertyOne', severity: 'INFO', code: '', url: '' }
    ], () => {})
  ).toEqual({
    propertyOne: { message: 'propertyOneError', variant: 'error' },
    propertyTwo: { message: 'propertyTwoWarning', variant: 'warning' },
    propertyThree: { message: 'propertyThreeInfo', variant: 'info' }
  });
});

test('messagesByProperty passes a code reference to Message', () => {
  const url = 'https://example.com/validation';
  let openedUrl = '';
  const message = messagesByProperty(
    [{ message: 'messageError', path: 'field.property', severity: 'ERROR', code: 'ERROR_CODE', url }],
    link => {
      openedUrl = link;
    }
  ).property;

  expect(message?.reference?.tooltip).toEqual('ERROR_CODE');
  message?.reference?.openUrl();
  expect(openedUrl).toEqual(url);
});

test('toMessageData', () => {
  expect(toMessageData({ message: 'messageInfo', severity: 'INFO' } as ValidationResult, () => {})).toEqual({
    message: 'messageInfo',
    variant: 'info'
  });
  expect(toMessageData({ message: 'messageWarning', severity: 'WARNING' } as ValidationResult, () => {})).toEqual({
    message: 'messageWarning',
    variant: 'warning'
  });
  expect(toMessageData({ message: 'messageError', severity: 'ERROR' } as ValidationResult, () => {})).toEqual({
    message: 'messageError',
    variant: 'error'
  });
});

test('variant', () => {
  expect(variant({ severity: 'INFO' } as ValidationResult)).toEqual('info');
  expect(variant({ severity: 'WARNING' } as ValidationResult)).toEqual('warning');
  expect(variant({ severity: 'ERROR' } as ValidationResult)).toEqual('error');
});

test('combineMessagesOfProperties', () => {
  const messages = { one: { message: 'one' }, two: { message: 'two' }, three: { message: 'three' } };
  expect(combineMessagesOfProperties(messages, 'zero')).toEqual([]);
  expect(combineMessagesOfProperties(messages, 'two')).toEqual([messages.two]);
  expect(combineMessagesOfProperties(messages, 'one', 'three')).toEqual([messages.one, messages.three]);
  expect(combineMessagesOfProperties(messages, 'three', 'four')).toEqual([messages.three]);
});
