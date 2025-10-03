import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType } from '@axonivy/dataclass-editor-protocol';
import { typeBrowserApply } from './typeBrowserApply';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { typeData } from '../../../data/type-data';
import { useAppContext } from '../../../context/AppContext';
import {
  getInitialExpandState,
  getInitialSelectState,
  getInitialTypeAsListState,
  getInitialValue
} from '../../../utils/browser/typeBrowserUtils';

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

  const types = useMemo(
    () => typeData(dataClasses, ivyTypes, ownTypes, allDatatypes, allTypesSearchActive),
    [allDatatypes, allTypesSearchActive, dataClasses, ivyTypes, ownTypes]
  );

  const [typeAsList, setTypeAsList] = useState<boolean>(getInitialTypeAsListState(types, getInitialValue(value)));

  const typesList = useBrowser(types);

  useEffect(() => {
    if (!allTypesSearchActive && initialState) {
      const newExpandedState = getInitialExpandState(types, getInitialValue(value).value);
      typesList.table.setExpanded(newExpandedState);

      const newSelectedState = getInitialSelectState(allTypesSearchActive, types, getInitialValue(value));
      typesList.table.setRowSelection(newSelectedState);
    }
  }, [allTypesSearchActive, value, typesList.table, types, initialState]);

  useEffect(() => {
    setMetaFilter(typesList.globalFilter.filter);
    if (typesList.globalFilter.filter.length > 0 && !allTypesSearchActive) {
      typesList.table.setExpanded(true);
      setInitialState(false);
    }
  }, [allTypesSearchActive, typesList.globalFilter.filter, typesList.table]);

  return {
    name: 'Type',
    icon: IvyIcons.DataClass,
    browser: typesList,
    header: (
      <BasicCheckbox
        label='Search over all types'
        checked={allTypesSearchActive}
        onCheckedChange={() => {
          setAllTypesSearchActive(!allTypesSearchActive);
          setInitialState(false);
        }}
      />
    ),
    footer: <BasicCheckbox label='Type as List' checked={typeAsList} onCheckedChange={() => setTypeAsList(!typeAsList)} />,
    infoProvider: row => typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList),
    applyModifier: row => ({ value: typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList) })
  };
};
