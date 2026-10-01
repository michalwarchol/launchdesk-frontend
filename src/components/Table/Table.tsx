"use client";

import { useTranslations } from "next-intl";

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
  error?: string;
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
  error,
  emptyMessage,
}: TableProps<T>) {
  const t = useTranslations("Table");
  const wrapperClassName = [styles.wrapper, className].filter(Boolean).join(" ");
  const showLoadingOverlay = Boolean(isLoading && !error);
  const isInteractionDisabled = showLoadingOverlay;

  const tableContainerClassName = [
    styles.tableContainer,
    showLoadingOverlay && data.length === 0 ? styles.tableContainerLoadingEmpty : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {filters?.length ? (
        <TableFilters
          filters={filters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          disabled={isInteractionDisabled}
        />
      ) : null}
      <div className={tableContainerClassName} aria-busy={showLoadingOverlay || undefined}>
        {showLoadingOverlay ? (
          <div className={styles.loadingOverlay} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.visuallyHidden}>{t("loading")}</span>
          </div>
        ) : null}
        <table className={styles.table}>
          <TableHead
            columns={columns}
            sort={sort}
            onSortChange={onSortChange}
            disabled={isInteractionDisabled}
          />
          <TableBody
            data={data}
            columns={columns}
            getRowId={getRowId}
            onRowClick={isInteractionDisabled ? undefined : onRowClick}
            isLoading={isLoading}
            error={error}
            emptyMessage={emptyMessage}
          />
        </table>
      </div>
      {pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          disabled={isInteractionDisabled}
        />
      ) : null}
    </div>
  );
}
