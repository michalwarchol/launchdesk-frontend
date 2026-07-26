import styles from "./Table.module.scss";

import type { Column, SortDirection, SortState } from "./types";

interface TableHeadProps<T> {
  columns: Column<T>[];
  sort?: SortState;
  onSortChange?: (key: string, direction: SortDirection) => void;
}

const alignClassName = (align?: "center" | "left" | "right") => {
  if (align === "center") return styles.alignCenter;
  if (align === "right") return styles.alignRight;
  return "";
};

export default function TableHead<T>({ columns, sort, onSortChange }: TableHeadProps<T>) {
  const handleSortClick = (column: Column<T>) => {
    if (!onSortChange) return;

    const isActive = sort?.key === column.key;
    const nextDirection: SortDirection = isActive && sort?.direction === "asc" ? "desc" : "asc";

    onSortChange(column.key, nextDirection);
  };

  return (
    <thead>
      <tr>
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
