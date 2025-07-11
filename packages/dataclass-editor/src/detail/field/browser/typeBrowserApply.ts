import type { DataclassType, JavaType } from '@axonivy/dataclass-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';

export const typeBrowserApply = (type: BrowserNode<DataclassType> | undefined, ivyTypes: Array<JavaType>, typeAsList: boolean) => {
  if (type) {
    const fullQualifiedName = type.info + '.' + type.value;
    if (ivyTypes.some(ivyType => ivyType.fullQualifiedName === fullQualifiedName)) {
      return typeAsList ? 'List<' + type.value + '>' : type.value;
    }
    if (!ivyTypes.some(ivyType => ivyType.fullQualifiedName === fullQualifiedName)) {
      return typeAsList ? 'List<' + fullQualifiedName + '>' : fullQualifiedName;
    }
  }
  return '';
};
