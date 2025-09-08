import type { DataclassType } from '@axonivy/dataclass-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { type RowSelectionState } from '@tanstack/react-table';

type InitialTypeBrowserValue = {
  value: string;
  asList: boolean;
};

export const getInitialValue = (value: string): InitialTypeBrowserValue => {
  if (value.startsWith('List<') && value.endsWith('>')) {
    const content = value.slice(5, -1);
    return { value: content, asList: true };
  } else {
    return { value, asList: false };
  }
};
export const getInitialTypeAsListState = (types: Array<BrowserNode<DataclassType>>, value: InitialTypeBrowserValue) => {
  if (value.asList) {
    return (
      types[1]?.children.some(ivyType => ivyType.value === value.value) ||
      types[0]?.children.some(dataclass => dataclass.info + '.' + dataclass.value === value.value) ||
      false
    );
  }
  return false;
};

export const getInitialSelectState = (
  allTypesSearchActive: boolean,
  types: Array<BrowserNode<DataclassType>>,
  value: InitialTypeBrowserValue
): RowSelectionState => {
  if (!allTypesSearchActive) {
    const ivyTypeIndex = types[1]?.children.findIndex(ivyType => ivyType.value === value.value);
    if (ivyTypeIndex !== -1) {
      return { [`1.${ivyTypeIndex}`]: true };
    }
    const dataClassIndex = types[0]?.children.findIndex(dataclass => dataclass.info + '.' + dataclass.value === value.value);
    if (dataClassIndex !== -1) {
      return { [`0.${dataClassIndex}`]: true };
    }
    if (types.length === 3) {
      const ownTypesIndex = types[2]?.children.findIndex(ownTypes => ownTypes.info + '.' + ownTypes.value === value.value);
      if (ownTypesIndex !== -1) {
        return { [`2.${ownTypesIndex}`]: true };
      }
    }
  }
  return {};
};

export const getInitialExpandState = (types: Array<BrowserNode<DataclassType>>, value: string) => {
  if (types.length >= 2) {
    return {
      '0': types[0]?.children.some(dataclass => dataclass.info + '.' + dataclass.value === value),
      '1': types[1]?.children.some(ivyType => ivyType.value === value),
      ...(types.length === 3 && {
        '2': types[2]?.children.some(ownType => ownType.info + '.' + ownType.value === value)
      })
    };
  }
  return {};
};
