import type { Field } from '@axonivy/dataclass-editor-protocol';
import { Button, Flex, SidebarHeader, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { DetailContextProvider } from '../context/DetailContext';
import { useAction } from '../context/useAction';
import { useValidation } from '../context/useValidation';
import { messagesByProperty } from '../data/validation-utils';
import { useHeaderTitles } from '../utils/useHeaderTitles';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import { DataClassDetailContent } from './dataclass/DataClassDetailContent';
import './Detail.css';
import { FieldDetailContent } from './field/FieldDetailContent';

export const Detail = ({ helpUrl }: { helpUrl: string }) => {
  const { selectedField, dataClass, setDataClass } = useAppContext();

  let field: Field | undefined;
  let setField: (field: Field) => void = () => {};
  if (selectedField !== undefined) {
    field = dataClass.fields[selectedField];
    setField = (field: Field) => {
      setDataClass(old => {
        const newDataClass = structuredClone(old);
        newDataClass.fields[selectedField] = field;
        return newDataClass;
      });
    };
  }
  const validations = useValidation(field ? field.name : '#class');

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();

  const { detailTitle: title } = useHeaderTitles();

  return (
    <Flex direction='column' className='dataclass-editor-panel-content dataclass-editor-detail-panel'>
      <SidebarHeader icon={IvyIcons.PenEdit} title={title} className='dataclass-editor-detail-header'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
            </TooltipTrigger>
            <TooltipContent>{helpText.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <Flex direction='column' className='dataclass-editor-detail-content'>
        <DetailContextProvider value={{ field, setField, messages: messagesByProperty(validations) }}>
          {!field ? <DataClassDetailContent /> : <FieldDetailContent key={selectedField} />}
        </DetailContextProvider>
      </Flex>
    </Flex>
  );
};
