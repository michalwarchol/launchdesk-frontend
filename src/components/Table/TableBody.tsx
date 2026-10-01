import { useTranslations } from "next-intl";

import styles from "./Table.module.scss";
import TableRow from "./TableRow";

import type { Column } from "./types";

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => number | string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function TableBody<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  isLoading,
  error,
  emptyMessage,
}: TableBodyProps<T>) {
  const t = useTranslations("Table");

  if (error) {
    return (
      <tbody>
        <tr>
          <td className={[styles.statusCell, styles.statusCellError].join(" ")} colSpan={columns.length} role="alert">
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
          <td className={styles.statusCell} colSpan={columns.length}>
            {emptyMessage ?? t("empty")}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row) => (
        <TableRow key={getRowId(row)} row={row} columns={columns} onRowClick={onRowClick} />
      ))}
    </tbody>
  );
}
