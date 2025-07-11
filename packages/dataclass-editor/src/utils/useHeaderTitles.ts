import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { classTypeOf } from '../data/dataclass-utils';

export const useHeaderTitles = () => {
  const { dataClass, selectedField } = useAppContext();
  const { t } = useTranslation();
  let masterTitle = '';
  switch (classTypeOf(dataClass)) {
    case 'DATA':
      masterTitle = t('title.data', { name: dataClass.simpleName });
      break;
    case 'BUSINESS_DATA':
      masterTitle = t('title.businessData', { name: dataClass.simpleName });
      break;
    case 'ENTITY':
      masterTitle = t('title.entity', { name: dataClass.simpleName });
  }

  const fields = dataClass.fields;

  let detailTitle = masterTitle;
  if (selectedField !== undefined && selectedField < fields.length) {
    const selectedDataClassField = fields[selectedField];
    detailTitle = t('title.attribute', { name: selectedDataClassField.name });
  }
  return { masterTitle, detailTitle };
};
