import {
  Button,
  Field,
  Flex,
  hotkeyRedoFix,
  hotkeyUndoFix,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  Switch,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../context/useAction';
import { useHeaderTitles } from '../utils/useHeaderTitles';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';

export const DataClassMasterToolbar = () => {
  const { detail, setDetail, isHdData } = useAppContext();
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.ui-inscription-tabs-trigger')?.focus();
    },
    {
      scopes: ['global']
    }
  );
  const { masterTitle: title } = useHeaderTitles();
  const { t } = useTranslation();

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='dataclass-editor-main-toolbar'>
      <ToolbarTitle className='dataclass-editor-main-toolbar-title'>{title}</ToolbarTitle>
      <Flex gap={1}>
        {!readonly && <EditButtons />}
        {isHdData && <HdNavigation />}
        <ThemeSwitcher />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                icon={IvyIcons.LayoutSidebarRightCollapse}
                size='large'
                onClick={() => setDetail(!detail)}
                aria-label={t('common.label.details')}
              />
            </TooltipTrigger>
            <TooltipContent>{t('common.label.details')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Flex>
    </Toolbar>
  );
};

const EditButtons = () => {
  const { history, setUnhistorisedDataClass } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const undo = () => history.undo(setUnhistorisedDataClass);
  const redo = () => history.redo(setUnhistorisedDataClass);
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });
  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Flex gap={1}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.undo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.redo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Flex>
        <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
      </Flex>
    </ToolbarContainer>
  );
};

const HdNavigation = () => {
  const openForm = useAction('openForm');
  const openProcess = useAction('openProcess');
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.openForm.hotkey, () => openForm(), { scopes: ['global'] });
  useHotkeys(hotkeys.openProcess.hotkey, () => openProcess(), { scopes: ['global'] });
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button icon={IvyIcons.File} size='large' aria-label={hotkeys.openForm.label} onClick={() => openForm()} />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.openForm.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button icon={IvyIcons.Process} size='large' aria-label={hotkeys.openProcess.label} onClick={() => openProcess()} />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.openProcess.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, setTheme, disabled } = useTheme();
  if (disabled) {
    return null;
  }
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button icon={IvyIcons.Settings} size='large' aria-label={t('common.label.settings')} />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('common.label.settings')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent sideOffset={12}>
        <ReadonlyProvider readonly={false}>
          <Flex direction='column' gap={2}>
            <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
              <Label>
                <Flex alignItems='center' gap={1}>
                  <IvyIcon icon={IvyIcons.DarkMode} />
                  {t('common.label.theme')}
                </Flex>
              </Label>
              <Switch
                defaultChecked={theme === 'dark'}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                size='small'
                aria-label={t('common.label.theme')}
              />
            </Field>
          </Flex>
          <PopoverArrow />
        </ReadonlyProvider>
      </PopoverContent>
    </Popover>
  );
};
