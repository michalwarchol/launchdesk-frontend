import { useTranslations } from "next-intl";

import styles from "./Table.module.scss";

import type { Column, TableSelectionState } from "./types";

interface TableRowProps<T> {
  row: T;
  rowId: number | string;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  selection?: TableSelectionState;
}

const alignClassName = (align?: "center" | "left" | "right") => {
  if (align === "center") return styles.alignCenter;
  if (align === "right") return styles.alignRight;
  return "";
};

export default function TableRow<T>({
  row,
  rowId,
  columns,
  onRowClick,
  selection,
}: TableRowProps<T>) {
  const t = useTranslations("Table");
  const rowClassName = [styles.row, onRowClick ? styles.clickableRow : ""]
    .filter(Boolean)
    .join(" ");

  const isSelected = selection?.selectedIds.includes(rowId) ?? false;

  const handleToggleSelect = () => {
    if (!selection) return;

    const { selectedIds, onSelectedIdsChange } = selection;

    if (isSelected) {
      onSelectedIdsChange(selectedIds.filter((id) => id !== rowId));
      return;
    }

    onSelectedIdsChange([...selectedIds, rowId]);
  };

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
      {selection ? (
        <td className={[styles.cell, styles.selectionCell].join(" ")}>
          <input
            type="checkbox"
            className={styles.selectionCheckbox}
            checked={isSelected}
            aria-label={t("selectRow")}
            onClick={(event) => event.stopPropagation()}
            onChange={handleToggleSelect}
          />
        </td>
      ) : null}
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
