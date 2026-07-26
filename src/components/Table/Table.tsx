"use client";

import Pagination from "./Pagination";
import styles from "./Table.module.scss";
import TableBody from "./TableBody";
import TableFilters from "./TableFilters";
import TableHead from "./TableHead";

import type { Column, FilterConfig, PaginationState, SortDirection, SortState } from "./types";

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => number | string;
  className?: string;
  sort?: SortState;
  onSortChange?: (key: string, direction: SortDirection) => void;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onRowClick?: (row: T) => void;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  getRowId,
  className,
  sort,
  onSortChange,
  filters,
  filterValues,
  onFilterChange,
  onRowClick,
  pagination,
  onPageChange,
  isLoading,
  emptyMessage,
}: TableProps<T>) {
  const wrapperClassName = [styles.wrapper, className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      {filters?.length ? (
        <TableFilters
          filters={filters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
        />
      ) : null}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <TableHead columns={columns} sort={sort} onSortChange={onSortChange} />
          <TableBody
            data={data}
            columns={columns}
            getRowId={getRowId}
            onRowClick={onRowClick}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
          />
        </table>
      </div>
      {pagination ? <Pagination pagination={pagination} onPageChange={onPageChange} /> : null}
    </div>
  );
}
