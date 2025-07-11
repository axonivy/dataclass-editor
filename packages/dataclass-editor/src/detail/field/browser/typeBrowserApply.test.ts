import type { DataclassType, JavaType } from '@axonivy/dataclass-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { expect } from 'vitest';
import { typeBrowserApply } from './typeBrowserApply';

const javaType: JavaType = {
  fullQualifiedName: 'com.example.TypeA',
  packageName: 'com.example',
  simpleName: 'TypeA'
};

const type: BrowserNode<DataclassType> = {
  value: 'TypeA',
  info: 'com.example',
  icon: IvyIcons.DataClass,
  children: []
};

test('return empty string when type undefined', () => {
  const result = typeBrowserApply(undefined, [javaType], false);
  expect(result).toBe('');
});

test('return type value when ivyTypes contains fullQualifiedName and typeAsList is false', () => {
  const result = typeBrowserApply(type, [javaType], false);
  expect(result).toBe('TypeA');
});

test('return List<type value> when ivyTypes contains fullQualifiedName and typeAsList is true', () => {
  const result = typeBrowserApply(type, [javaType], true);
  expect(result).toBe('List<TypeA>');
});

test('return full qualified name when ivyTypes does not contain fullQualifiedName and typeAsList is false', () => {
  const otherJavaTypes: Array<JavaType> = [
    {
      fullQualifiedName: 'com.other.TypeB',
      packageName: 'com.other',
      simpleName: 'TypeB'
    }
  ];
  const result = typeBrowserApply(type, otherJavaTypes, false);
  expect(result).toBe('com.example.TypeA');
});

test('return List<full qualified name> when ivyTypes does not contain fullQualifiedName and typeAsList is true', () => {
  const otherJavaTypes: Array<JavaType> = [
    {
      fullQualifiedName: 'com.other.TypeB',
      packageName: 'com.other',
      simpleName: 'TypeB'
    }
  ];
  const result = typeBrowserApply(type, otherJavaTypes, true);
  expect(result).toBe('List<com.example.TypeA>');
});
