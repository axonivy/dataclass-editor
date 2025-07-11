import { isIDType, isVersionType, type Modifier } from '@axonivy/dataclass-editor-protocol';
import { BasicCheckbox } from '@axonivy/ui-components';
import { useField } from '../../context/DetailContext';
import { updateModifiers } from '../../data/dataclass-utils';

type FieldModifierCheckboxProps = {
  label: string;
  modifier: Modifier;
};

export const useModifier = (modifier: Modifier) => {
  const { field, setField } = useField();
  const setModifier = (add: boolean) => {
    const newField = structuredClone(field);
    newField.modifiers = updateModifiers(add, newField.modifiers, modifier);
    setField(newField);
  };

  const isID = field.modifiers.includes('ID');
  const isVersion = field.modifiers.includes('VERSION');

  let isDisabled = false;
  if (modifier !== 'PERSISTENT') {
    isDisabled = field.entity?.mappedByFieldName !== '';
    if (!isDisabled) {
      switch (modifier) {
        case 'ID':
          isDisabled = isVersion || !isIDType(field.type);
          break;
        case 'GENERATED':
          isDisabled = !isID;
          break;
        case 'VERSION':
          isDisabled = isID || !isVersionType(field.type);
          break;
        default:
          isDisabled = isID || isVersion;
          break;
      }
    }
  }

  return { checked: field.modifiers.includes(modifier), setModifier, isDisabled };
};

export const FieldModifierCheckbox = ({ label, modifier }: FieldModifierCheckboxProps) => {
  const { checked, setModifier, isDisabled } = useModifier(modifier);

  return (
    <BasicCheckbox
      label={label}
      checked={checked}
      onCheckedChange={event => setModifier(event.valueOf() as boolean)}
      disabled={isDisabled}
    />
  );
};
