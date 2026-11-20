import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { combineMessagesOfProperties, messagesByProperty, toMessageData, variant } from './validation-utils';

test('messagesByProperty', () => {
  expect(messagesByProperty([], () => {})).toEqual({});
  expect(
    messagesByProperty([
      {
        message: 'propertyOneInfo',
        path: 'field.propertyOne',
        severity: 'INFO',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
      {
        message: 'propertyTwoWarning',
        path: 'field.propertyTwo',
        severity: 'WARNING',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
      {
        message: 'propertyTwoInfo',
        path: 'field.propertyTwo',
        severity: 'INFO',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
      {
        message: 'propertyOneError',
        path: 'field.propertyOne',
        severity: 'ERROR',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
      {
        message: 'propertyThreeInfo',
        path: 'field.propertyThree',
        severity: 'INFO',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
      {
        message: 'propertyOneInfo',
        path: 'field.propertyOne',
        severity: 'INFO',
        code: 'VALIDATION_CODE',
        url: 'https://example.com/validation'
      },
    ], () => {})
  ).toEqual({
    propertyOne: {
      message: 'propertyOneError',
      variant: 'error',
      reference: { tooltip: 'VALIDATION_CODE', openUrl: expect.any(Function) }
    },
    propertyTwo: {
      message: 'propertyTwoWarning',
      variant: 'warning',
      reference: { tooltip: 'VALIDATION_CODE', openUrl: expect.any(Function) }
    },
    propertyThree: {
      message: 'propertyThreeInfo',
      variant: 'info',
      reference: { tooltip: 'VALIDATION_CODE', openUrl: expect.any(Function) }
    }
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
  expect(
    toMessageData(
      { message: 'messageInfo', path: 'field.INFO', severity: 'INFO', code: 'INFO_CODE', url: 'https://example.com/info' },
      () => {}
    )
  ).toEqual({
    message: 'messageInfo',
    variant: 'info',
    reference: { tooltip: 'INFO_CODE', openUrl: expect.any(Function) }
  });
  expect(
    toMessageData(
      {
        message: 'messageWarning',
        path: 'field.WARNING',
        severity: 'WARNING',
        code: 'WARNING_CODE',
        url: 'https://example.com/warning'
      },
      () => {}
    )
  ).toEqual({
    message: 'messageWarning',
    variant: 'warning',
    reference: { tooltip: 'WARNING_CODE', openUrl: expect.any(Function) }
  });
  expect(
    toMessageData(
      { message: 'messageError', path: 'field.ERROR', severity: 'ERROR', code: 'ERROR_CODE', url: 'https://example.com/error' },
      () => {}
    )
  ).toEqual({
    message: 'messageError',
    variant: 'error',
    reference: { tooltip: 'ERROR_CODE', openUrl: expect.any(Function) }
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
