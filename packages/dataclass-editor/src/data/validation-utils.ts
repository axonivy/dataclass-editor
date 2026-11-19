import type { Severity, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { groupBy, type MessageData, type StateDotProps } from '@axonivy/ui-components';

export const messagesByProperty = (validations: Array<ValidationResult>, openUrl: (url: string) => void): Record<string, MessageData> => {
  const validationsByProperty = groupBy(validations, validation => validationProperty(validation));
  const messageDataByProperty: Record<string, MessageData> = {};
  Object.entries(validationsByProperty).forEach(([property, validations]) => {
    messageDataByProperty[property] = messageData(validations, openUrl);
  });
  return messageDataByProperty;
};

const validationProperty = (validation: ValidationResult) => {
  return validation.path.substring(validation.path.lastIndexOf('.') + 1);
};

const messageData = (validations: Array<ValidationResult>, openUrl: (url: string) => void): MessageData => {
  const validationError = validations.find(val => val.severity === 'ERROR');
  if (validationError) {
    return toMessageData(validationError, openUrl);
  }
  const validationWarning = validations.find(val => val.severity === 'WARNING');
  if (validationWarning) {
    return toMessageData(validationWarning, openUrl);
  }
  const validationOther = validations[0];
  return toMessageData(validationOther, openUrl);
};

export const toMessageData = (validation: ValidationResult | undefined, openUrl: (url: string) => void): MessageData => {
  const url = validation?.url;
  const tooltip = validation?.code;
  return {
    message: validation?.message,
    variant: validation ? variant(validation) : undefined,
    ...(url && tooltip ? { reference: { tooltip, openUrl: () => openUrl(url) } } : {})
  };
};

export const variant = (validation: ValidationResult): Lowercase<Severity> => {
  return validation.severity.toLocaleLowerCase() as Lowercase<Severity>;
};

export const combineMessagesOfProperties = (
  messagesByProperty: Record<string, MessageData>,
  ...properties: Array<string>
): Array<MessageData> => {
  return properties.reduce<Array<MessageData>>((messages, property): Array<MessageData> => {
    if (messagesByProperty[property]) {
      return messages.concat([messagesByProperty[property]]);
    }
    return messages;
  }, []);
};

export const getTabState = (validations: Array<MessageData>): StateDotProps => {
  if (validations.find(message => message?.variant === 'error')) {
    return { state: 'error', messages: validations };
  }
  if (validations.find(message => message?.variant === 'warning')) {
    return { state: 'warning', messages: validations };
  }
  return { state: undefined, messages: validations };
};
