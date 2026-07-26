import styles from "./Table.module.scss";

import type { Column } from "./types";

interface TableRowProps<T> {
  row: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

const alignClassName = (align?: "center" | "left" | "right") => {
  if (align === "center") return styles.alignCenter;
  if (align === "right") return styles.alignRight;
  return "";
};

export default function TableRow<T>({ row, columns, onRowClick }: TableRowProps<T>) {
  const rowClassName = [styles.row, onRowClick ? styles.clickableRow : ""]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <tr
      className={rowClassName}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      onKeyDown={onRowClick ? handleKeyDown : undefined}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={[styles.cell, alignClassName(column.align)].filter(Boolean).join(" ")}
        >
          {column.render
            ? column.render(row)
            : String((row as Record<string, unknown>)[column.key] ?? "")}
        </td>
      ))}
    </tr>
  );
}
