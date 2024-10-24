import { describe, expect } from 'vitest';
import { getInitialSelectState, getInitialTypeAsListState, getInitialValue } from './typeBrowserUtils';
import type { BrowserNode } from '@axonivy/ui-components';
import type { DataclassType } from '../../protocol/types';
import { IvyIcons } from '@axonivy/ui-icons';

describe('getInitialValue', () => {
  test('return value as list when input is in List<> format', () => {
    const result = getInitialValue('List<ExampleType>');
    expect(result).toEqual({ value: 'ExampleType', asList: true });
  });

  test('return value and asList false when input is not in List<> format', () => {
    const result = getInitialValue('SingleType');
    expect(result).toEqual({ value: 'SingleType', asList: false });
  });

  test('return value and asList false for empty string', () => {
    const result = getInitialValue('');
    expect(result).toEqual({ value: '', asList: false });
  });
});

describe('getInitialTypeAsListState', () => {
  const types: Array<BrowserNode<DataclassType>> = [
    {
      value: 'DataClass',
      info: 'DataClassInfo',
      icon: IvyIcons.LetterD,
      children: [
        { value: 'ExampleDataClass', info: 'Info1', icon: IvyIcons.LetterD, children: [] },
        { value: 'AnotherDataClass', info: 'Info2', icon: IvyIcons.LetterD, children: [] }
      ]
    },
    {
      value: 'IvyType',
      info: 'IvyTypeInfo',
      icon: IvyIcons.Ivy,
      children: [
        { value: 'ExampleType', info: 'Info3', icon: IvyIcons.Ivy, children: [] },
        { value: 'DifferentType', info: 'Info4', icon: IvyIcons.Ivy, children: [] }
      ]
    }
  ];

  test('return true if the value is found in Ivy types', () => {
    const value = { value: 'ExampleType', asList: true };
    const result = getInitialTypeAsListState(types, value);
    expect(result).toBe(true);
  });

  test('return true if the value is found in DataClass types', () => {
    const value = { value: 'Info1.ExampleDataClass', asList: true };
    const result = getInitialTypeAsListState(types, value);
    expect(result).toBe(true);
  });

  test('return false if the value is not found in either type', () => {
    const value = { value: 'NonExistentType', asList: true };
    const result = getInitialTypeAsListState(types, value);
    expect(result).toBe(false);
  });

  test('return false if asList is false', () => {
    const value = { value: 'ExampleDataClass', asList: false };
    const result = getInitialTypeAsListState(types, value);
    expect(result).toBe(false);
  });
});

describe('getInitialSelectState', () => {
  const types: Array<BrowserNode<DataclassType>> = [
    {
      value: 'DataClass',
      info: 'DataClassInfo',
      icon: IvyIcons.LetterD,
      children: [{ value: 'ExampleDataClass', info: 'Info1', icon: IvyIcons.LetterD, children: [] }]
    },
    {
      value: 'IvyType',
      info: 'IvyTypeInfo',
      icon: IvyIcons.Ivy,
      children: [{ value: 'ExampleType', info: 'Info2', icon: IvyIcons.Ivy, children: [] }]
    }
  ];

  test('return selected row id for IvyType if found', () => {
    const value = { value: 'ExampleType', asList: false };
    const result = getInitialSelectState(false, types, value);
    expect(result).toEqual({ '1.0': true }); // index of ExampleType in IvyType children
  });

  test('return selected row id for DataClass if found', () => {
    const value = { value: 'Info1.ExampleDataClass', asList: false };
    const result = getInitialSelectState(false, types, value);
    expect(result).toEqual({ '0.0': true }); // index of ExampleDataClass in DataClass children
  });

  test('return empty object if value is not found in either type', () => {
    const value = { value: 'NonExistentType', asList: false };
    const result = getInitialSelectState(false, types, value);
    expect(result).toEqual({});
  });

  test('return empty object if allTypesSearchActive is true', () => {
    const value = { value: 'ExampleType', asList: false };
    const result = getInitialSelectState(true, types, value);
    expect(result).toEqual({});
  });
});
