import {
  addRow,
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  dataTableFeatures,
  dataTableHelper,
  deleteFirstSelectedRow,
  InputCell,
  SelectRow,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  useReadonly,
  type CollapsibleControlProps,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type AnnotationsTableProps = {
  annotations: Array<string>;
  setAnnotations: (annotations: Array<string>) => void;
  message?: MessageData;
};

type AnnotationRow = { annotation: string };

export const AnnotationsTable = ({ annotations, setAnnotations, message }: AnnotationsTableProps) => {
  const annotationRows = useMemo(() => annotations.map(annotation => ({ annotation })), [annotations]);
  const { columnHelper } = dataTableHelper<AnnotationRow>();
  const columns = columnHelper.columns([
    columnHelper.accessor('annotation', {
      header: 'Annotation',
      cell: cell => <InputCell cell={cell} />
    })
  ]);
  const table = useTable({
    features: dataTableFeatures,
    data: annotationRows,
    columns,
    meta: {
      updateData: (rowId: string, _columnId: string, value: unknown) => {
        const newAnnotations = annotationRows.map((row, index) => (index === Number(rowId) ? { annotation: String(value) } : row));
        setAnnotations(newAnnotations.map(row => row.annotation));
      }
    }
  });

  const readonly = useReadonly();

  const deleteAnnotation = () => {
    const { newData: newAnnotations } = deleteFirstSelectedRow(table, annotationRows);
    setAnnotations(newAnnotations.map(row => row.annotation));
  };

  const addAnnotation = () => {
    const newAnnotations = addRow(table, annotationRows, { annotation: '' });
    setAnnotations(newAnnotations.map(row => row.annotation));
  };

  const { t } = useTranslation();

  return (
    <Collapsible defaultOpen={annotations.length !== 0}>
      <CollapsibleTrigger
        state={message && <CollapsibleState messages={[message]} />}
        control={(props: CollapsibleControlProps) =>
          !readonly && (
            <Button
              {...props}
              title={t('label.deleteAnnotation')}
              icon={IvyIcons.Trash}
              disabled={table.getSelectedRowModel().rows.length === 0}
              onClick={deleteAnnotation}
              aria-label={t('label.deleteAnnotation')}
            />
          )
        }
      >
        {t('label.annotations')}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField message={message}>
          <Table>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <SelectRow key={row.id} row={row}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} onClick={cell.getSelectionStartHandler()}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </SelectRow>
              ))}
            </TableBody>
          </Table>
          {!readonly && <TableAddRow addRow={addAnnotation} />}
        </BasicField>
      </CollapsibleContent>
    </Collapsible>
  );
};
