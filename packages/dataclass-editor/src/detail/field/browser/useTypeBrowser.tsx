import type { DataclassType } from '@axonivy/dataclass-editor-protocol';
import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { useTypeData } from '../../../data/type-data';
import {
  getInitialExpandState,
  getInitialSelectState,
  getInitialTypeAsListState,
  getInitialValue
} from '../../../utils/browser/typeBrowserUtils';
import { typeBrowserApply } from './typeBrowserApply';

export const useTypeBrowser = (value: string): Browser => {
  const { context } = useAppContext();
  const [allTypesSearchActive, setAllTypesSearchActive] = useState(false);
  const [initialState, setInitialState] = useState(true);

  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;

  const [metaFilter, setMetaFilter] = useState('');
  const ownTypes = useMeta('meta/scripting/ownTypes', { context, limit: 50, type: metaFilter }, [], {
    disable: allTypesSearchActive
  }).data;
  const allDatatypes = useMeta('meta/scripting/allTypes', { context, limit: 150, type: metaFilter }, [], {
    disable: !allTypesSearchActive
  }).data;

  const types = useTypeData(dataClasses, ivyTypes, ownTypes, allDatatypes, allTypesSearchActive);

  const [typeAsList, setTypeAsList] = useState<boolean>(() => getInitialTypeAsListState(types, getInitialValue(value)));

  const typesList = useBrowser(types);

  if (initialState) {
    typesList.table.setExpanded(getInitialExpandState(types, getInitialValue(value).value));
    typesList.table.setRowSelection(getInitialSelectState(allTypesSearchActive, types, getInitialValue(value)));
    setInitialState(false);
  }

  useEffect(() => {
    const subscription = typesList.table.atoms.globalFilter.subscribe(old => {
      setMetaFilter(old);
      if (typesList.table.state.globalFilter.length > 0 && !allTypesSearchActive) {
        typesList.table.setExpanded(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [allTypesSearchActive, typesList.table, typesList.table.state.globalFilter]);
  const { t } = useTranslation();

  return {
    name: t('label.type'),
    icon: IvyIcons.DataClass,
    browser: typesList,
    header: (
      <BasicCheckbox
        label={t('browser.searchAllTypes')}
        checked={allTypesSearchActive}
        onCheckedChange={() => {
          setAllTypesSearchActive(!allTypesSearchActive);
          typesList.table.setRowSelection({});
        }}
      />
    ),
    footer: <BasicCheckbox label={t('browser.typeAsList')} checked={typeAsList} onCheckedChange={() => setTypeAsList(!typeAsList)} />,
    infoProvider: row => typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList),
    applyModifier: row => ({ value: typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList) })
  };
};
