import { BrowsersView, type BrowsersViewProps } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypeBrowser } from './useTypeBrowser';

type BrowserProps = {
  onChange: (value: string) => void;
  value: string;
  close: () => void;
};

export const Browser = ({ onChange, close, value }: BrowserProps) => {
  const typeBrowser = useTypeBrowser(value);
  const { t } = useTranslation();
  const options = useMemo<BrowsersViewProps['options']>(
    () => ({
      applyBtn: { label: t('common.label.apply') },
      cancelBtn: { label: t('common.label.cancel') },
      info: { label: t('common.label.info') },
      search: { placeholder: t('common.label.search') }
    }),
    [t]
  );
  return (
    <BrowsersView
      browsers={[typeBrowser]}
      apply={(browserName, result) => {
        if (result) {
          onChange(result.value);
        }
        close();
      }}
      options={options}
    />
  );
};
