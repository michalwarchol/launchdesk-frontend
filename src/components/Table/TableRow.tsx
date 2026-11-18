import { useTranslations } from "next-intl";

import Checkbox from "@/components/Checkbox";

import styles from "./Table.module.scss";

import type { Column, TableSelectionState } from "./types";

interface TableRowProps<T> {
  row: T;
  rowId: number | string;
  columns: Column<T>[];
  rowLabel?: string;
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
  rowLabel,
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

  return (
    <tr className={rowClassName}>
      {selection ? (
        <td className={[styles.cell, styles.selectionCell].join(" ")}>
          <Checkbox
            checked={isSelected}
            ariaLabel={rowLabel ? t("selectRowNamed", { name: rowLabel }) : t("selectRow")}
            onChange={handleToggleSelect}
          />
        </td>
      ) : null}
      {columns.map((column, index) => {
        const content = column.render
          ? column.render(row)
          : String((row as Record<string, unknown>)[column.key] ?? "");

        return (
          <td
            key={column.key}
            className={[styles.cell, alignClassName(column.align)].filter(Boolean).join(" ")}
          >
            {onRowClick && index === 0 ? (
              <button type="button" className={styles.rowAction} onClick={() => onRowClick(row)}>
                {content}
              </button>
            ) : (
              content
            )}
          </td>
        );
      })}
    </tr>
  );
}
