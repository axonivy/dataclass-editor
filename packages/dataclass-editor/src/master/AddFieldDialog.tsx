import type { Field } from '@axonivy/dataclass-editor-protocol';
import {
  addRow,
  BasicDialogContent,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  hotkeyText,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { isEntity } from '../data/dataclass-utils';
import { BROWSER_BTN_ID, InputFieldWithTypeBrowser } from '../detail/field/InputFieldWithTypeBrowser';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';

const DIALOG_HOTKEY_IDS = ['addFieldDialog'];

type AddFieldDialogProps = { table: Table<Field>; children: React.ReactNode };

export const AddFieldDialog = ({ table, children }: AddFieldDialogProps) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addAttr: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <AddFieldDialogContent table={table} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export const AddFieldDialogContent = ({ table, closeDialog }: { table: Table<Field>; closeDialog: () => void }) => {
  const { isPersistable } = useAppContext();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const { dataClass, setDataClass, setSelectedField } = useAppContext();

  const [name, setName] = useState('newAttribute');
  const [type, setType] = useState('String');

  const { nameMessage, typeMessage } = useValidateField(name, type);

  const addField = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent) => {
    const newField: Field = {
      name: name,
      type: type,
      comment: '',
      modifiers: isPersistable ? ['PERSISTENT'] : [],
      annotations: [],
      entity: isEntity(dataClass)
        ? { databaseName: '', databaseFieldLength: '', cascadeTypes: ['PERSIST', 'MERGE'], mappedByFieldName: '', orphanRemoval: false }
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
      closeDialog();
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
  };

  const allInputsValid = () => !nameMessage && !typeMessage;
  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (!allInputsValid() || document.activeElement?.id === BROWSER_BTN_ID) {
        return;
      }
      addField(e);
    },
    { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true }
  );
  const { t } = useTranslation();

  return (
    <BasicDialogContent
      title={t('dialog.addAttr.title')}
      description={t('dialog.addAttr.desc')}
      submit={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='primary'
                size='large'
                aria-label={t('dialog.addAttr.create')}
                disabled={!allInputsValid()}
                onClick={addField}
                icon={IvyIcons.Plus}
              >
                {t('dialog.addAttr.create')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('dialog.addAttr.createTooltip', { modifier: hotkeyText('mod') })}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} message={nameMessage} aria-label={t('common.label.name')}>
        <Input ref={nameInputRef} value={name} onChange={event => setName(event.target.value)} />
      </BasicField>
      <InputFieldWithTypeBrowser value={type} message={typeMessage} onChange={setType} />
    </BasicDialogContent>
  );
};

export const useValidateField = (name: string, type: string) => {
  const { t } = useTranslation();
  const { dataClass } = useAppContext();

  const nameMessage = useMemo(() => {
    if (name.trim() === '') {
      return toErrorMessage(t('message.emptyName'));
    }
    if (dataClass.fields.some(field => field.name === name)) {
      return toErrorMessage(t('message.nameIsTaken'));
    }
  }, [dataClass.fields, name, t]);

  const typeMessage = useMemo(() => {
    if (type.trim() === '') {
      return toErrorMessage(t('message.emptyType'));
    }
  }, [type, t]);

  return { nameMessage, typeMessage };
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
