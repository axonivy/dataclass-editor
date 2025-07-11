import {
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  InputGroup,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Browser } from './browser/Browser';
import './InputFieldWithTypeBrowser.css';

export const BROWSER_BTN_ID = 'browser-btn';

export type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const InputFieldWithTypeBrowser = ({ value, onChange, message }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={t('label.type')} message={message} aria-label={t('label.type')}>
        <InputGroup>
          <BasicInput value={value} onChange={event => onChange(event.target.value)} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button icon={IvyIcons.ListSearch} id={BROWSER_BTN_ID} aria-label={t('common.label.browser')} />
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t('common.label.browser')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroup>
      </BasicField>
      <DialogContent className='dataclass-editor-type-browser-content'>
        <Browser onChange={onChange} close={() => setOpen(false)} value={value} />
      </DialogContent>
    </Dialog>
  );
};
