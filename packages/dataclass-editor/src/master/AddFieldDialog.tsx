import type { DataClass, Field } from '@axonivy/dataclass-editor-protocol';
import {
  addRow,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  hotkeyText,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeyLocalScopes,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { isEntity } from '../data/dataclass-utils';
import { BROWSER_LABEL, InputFieldWithTypeBrowser } from '../detail/field/InputFieldWithTypeBrowser';
import { useKnownHotkeys } from '../utils/hotkeys';

export const validateFieldName = (name: string, dataClass: DataClass) => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (dataClass.fields.some(field => field.name === name)) {
    return toErrorMessage('Name is already taken.');
  }
  return;
};

export const validateFieldType = (type: string) => {
  if (type.trim() === '') {
    return toErrorMessage('Type cannot be empty.');
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};

type AddFieldDialogProps = {
  table: Table<Field>;
};

export const AddFieldDialog = ({ table }: AddFieldDialogProps) => {
  const { isPersistable, dataClass, setDataClass, setSelectedField } = useAppContext();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['addFieldDialog']);

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const nameValidationMessage = useMemo(() => validateFieldName(name, dataClass), [name, dataClass]);
  const typeValidationMessage = useMemo(() => validateFieldType(type), [type]);

  const initializeAddFieldDialog = () => {
    setName('newAttribute');
    setType('String');
  };

  const addField = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent) => {
    const newField: Field = {
      name: name,
      type: type,
      comment: '',
      modifiers: isPersistable ? ['PERSISTENT'] : [],
      annotations: [],
      entity: isEntity(dataClass)
        ? {
            databaseName: '',
            databaseFieldLength: '',
            cascadeTypes: ['PERSIST', 'MERGE'],
            mappedByFieldName: '',
            orphanRemoval: false
          }
        : undefined
    };
    const newFields = addRow(table, dataClass.fields, newField);

    setDataClass(old => {
      const newDataClass = structuredClone(old);
      newDataClass.fields = newFields;
      setSelectedField(newDataClass.fields.findIndex(field => field.name === newField.name));
      return newDataClass;
    });
    if (!e.ctrlKey && !e.metaKey) {
      onOpenChange(false);
    }
  };

  const allInputsValid = () => !nameValidationMessage && !typeValidationMessage;
  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeAddFieldDialog();
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  const { addAttr: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (!allInputsValid() || document.activeElement?.ariaLabel === BROWSER_LABEL) {
        return;
      }
      addField(e);
    },
    {
      scopes: ['addFieldDialog'],
      enabled: open,
      enableOnFormTags: true
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.Plus} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Attribute</DialogTitle>
        </DialogHeader>
        <DialogDescription>Choose the name and type of the Attribute you want to add.</DialogDescription>
        <Flex ref={enter} tabIndex={-1} direction='column' gap={2}>
          <Flex direction='column' gap={2}>
            <BasicField label='Name' message={nameValidationMessage} aria-label='Name'>
              <Input value={name} onChange={event => setName(event.target.value)} />
            </BasicField>
            <InputFieldWithTypeBrowser value={type} message={typeValidationMessage} onChange={setType} />
          </Flex>
          <DialogFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='primary' size='large' aria-label='Create Attribute' disabled={!allInputsValid()} onClick={addField}>
                    Create Attribute
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Hold {hotkeyText('mod')} to add an additional Attribute</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
