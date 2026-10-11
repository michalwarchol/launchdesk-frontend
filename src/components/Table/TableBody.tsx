import { useTranslations } from "next-intl";

import styles from "./Table.module.scss";
import TableRow from "./TableRow";

import type { Column, TableSelectionState } from "./types";

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => number | string;
  onRowClick?: (row: T) => void;
  selection?: TableSelectionState;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function TableBody<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  selection,
  isLoading,
  error,
  emptyMessage,
}: TableBodyProps<T>) {
  const t = useTranslations("Table");
  const columnCount = columns.length + (selection ? 1 : 0);

  if (error) {
    return (
      <tbody>
        <tr>
          <td
            className={[styles.statusCell, styles.statusCellError].join(" ")}
            colSpan={columnCount}
            role="alert"
          >
            {error}
          </td>
        </tr>
      </tbody>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <tbody>
        <tr>
          <td className={styles.statusCell} colSpan={columnCount}>
            {emptyMessage ?? t("empty")}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row) => {
        const rowId = getRowId(row);

        return (
          <TableRow
            key={rowId}
            row={row}
            rowId={rowId}
            columns={columns}
            onRowClick={onRowClick}
            selection={selection}
          />
        );
      })}
    </tbody>
  );
}
