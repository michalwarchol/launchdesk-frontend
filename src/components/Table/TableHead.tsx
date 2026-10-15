import { useTranslations } from "next-intl";

import Checkbox from "@/components/Checkbox";
import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

import styles from "./Table.module.scss";

import type { Column, SortDirection, SortState, TableSelectionState } from "./types";

interface TableHeadProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => number | string;
  sort?: SortState;
  onSortChange?: (key: string, direction: SortDirection) => void;
  selection?: TableSelectionState;
  disabled?: boolean;
}

const alignClassName = (align?: "center" | "left" | "right") => {
  if (align === "center") return styles.alignCenter;
  if (align === "right") return styles.alignRight;
  return "";
};

export default function TableHead<T>({
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  selection,
  disabled,
}: TableHeadProps<T>) {
  const t = useTranslations("Table");

  const visibleIds = data.map(getRowId);
  const selectedSet = new Set(selection?.selectedIds ?? []);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedSet.has(id)) && !allVisibleSelected;

  const handleSelectAllChange = () => {
    if (!selection) return;

    const { selectedIds, onSelectedIdsChange } = selection;

    if (allVisibleSelected) {
      const visibleSet = new Set(visibleIds);
      onSelectedIdsChange(selectedIds.filter((id) => !visibleSet.has(id)));
      return;
    }

    const merged = new Set([...selectedIds, ...visibleIds]);
    onSelectedIdsChange([...merged]);
  };

  const handleSortClick = (column: Column<T>) => {
    if (!onSortChange) return;

    const isActive = sort?.key === column.key;
    const nextDirection: SortDirection = isActive && sort?.direction === "asc" ? "desc" : "asc";

    onSortChange(column.key, nextDirection);
  };

  return (
    <thead>
      <tr>
        {selection ? (
          <th className={[styles.headerCell, styles.selectionHeaderCell].join(" ")}>
            <Checkbox
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected}
              disabled={disabled || visibleIds.length === 0}
              ariaLabel={t("selectAll")}
              onChange={handleSelectAllChange}
            />
          </th>
        ) : null}
        {columns.map((column) => {
          const isActive = sort?.key === column.key;
          const ariaSort = isActive
            ? sort?.direction === "asc"
              ? "ascending"
              : "descending"
            : "none";
          const headerClassName = [styles.headerCell, alignClassName(column.align)]
            .filter(Boolean)
            .join(" ");

          return (
            <th
              key={column.key}
              className={headerClassName}
              style={column.width ? { width: column.width } : undefined}
              aria-sort={column.sortable ? ariaSort : undefined}
            >
              {column.sortable ? (
                <button
                  type="button"
                  className={styles.sortableHeader}
                  disabled={disabled}
                  {...preventFirefoxDisabledRestore}
                  onClick={() => handleSortClick(column)}
                >
                  {column.header}
                  {isActive ? (
                    <span className={styles.sortIndicator} aria-hidden="true">
                      {sort?.direction === "asc" ? "▲" : "▼"}
                    </span>
                  ) : null}
                </button>
              ) : (
                column.header
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
