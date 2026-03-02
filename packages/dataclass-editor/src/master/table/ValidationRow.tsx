import type { Field, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { cn, MessageRow, ReorderRow, SelectRow, TableCell } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useValidation } from '../../context/useValidation';
import { toMessageData } from '../../data/validation-utils';

type ValidationRowProps = {
  row: Row<Field>;
  isReorderable: boolean;
  updateOrder: (moveId: string, targetId: string) => void;
  onClick: React.MouseEventHandler<HTMLTableRowElement>;
  onDrag: React.DragEventHandler<HTMLTableRowElement>;
};

export const ValidationRow = ({ row, isReorderable, updateOrder, onClick, onDrag }: ValidationRowProps) => {
  const validations = useValidation(row.original.name);

  const tableCell = row
    .getVisibleCells()
    .map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>);

  const commonProps = { id: row.index.toString(), row, className: rowClass(validations), onClick, onDrag };

  return (
    <>
      {isReorderable ? (
        <ReorderRow {...commonProps} updateOrder={updateOrder}>
          {tableCell}
        </ReorderRow>
      ) : (
        <SelectRow {...commonProps}>{tableCell}</SelectRow>
      )}
      {validations
        .filter(val => val.severity !== 'INFO')
        .map((val, index) => (
          <MessageRow key={index} columnCount={3} message={toMessageData(val)} />
        ))}
    </>
  );
};

export const rowClass = (validations?: Array<ValidationResult>) => {
  if (!validations) {
    return '';
  }
  if (validations.find(message => message.severity === 'ERROR')) {
    return cn('border-b-error!');
  }
  if (validations.find(message => message.severity === 'WARNING')) {
    return cn('border-b-warning!');
  }
  return '';
};
