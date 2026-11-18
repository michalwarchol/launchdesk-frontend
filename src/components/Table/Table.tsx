"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import Pagination from "./Pagination";
import styles from "./Table.module.scss";
import TableBody from "./TableBody";
import TableFilters from "./TableFilters";
import TableHead from "./TableHead";

import type {
  Column,
  FilterConfig,
  PaginationState,
  SortDirection,
  SortState,
  TableSelectionState,
} from "./types";

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => number | string;
  getRowLabel?: (row: T) => string;
  caption?: string;
  hideCaption?: boolean;
  className?: string;
  sort?: SortState;
  onSortChange?: (key: string, direction: SortDirection) => void;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onRowClick?: (row: T) => void;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  selection?: TableSelectionState;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  getRowId,
  getRowLabel,
  caption,
  hideCaption = false,
  className,
  sort,
  onSortChange,
  filters,
  filterValues,
  onFilterChange,
  onRowClick,
  pagination,
  onPageChange,
  selection,
  isLoading,
  error,
  emptyMessage,
}: TableProps<T>) {
  const t = useTranslations("Table");
  const wrapperClassName = [styles.wrapper, className].filter(Boolean).join(" ");
  const showLoadingOverlay = Boolean(isLoading && !error);
  const [statusMessage, setStatusMessage] = useState("");
  const isFirstStatus = useRef(true);
  const total = pagination?.total ?? data.length;
  const sortColumn = sort ? columns.find((column) => column.key === sort.key)?.header : undefined;
  const statusKey = `${data.length}|${total}|${pagination?.page ?? ""}|${sort?.key ?? ""}|${sort?.direction ?? ""}`;

  useEffect(() => {
    if (isFirstStatus.current) {
      isFirstStatus.current = false;
      return;
    }

    setStatusMessage(
      sortColumn
        ? t("resultsStatusSorted", {
            shown: data.length,
            total,
            column: sortColumn,
            direction: t(sort?.direction === "asc" ? "sortAscending" : "sortDescending"),
          })
        : t("resultsStatus", { shown: data.length, total }),
    );
    // The message is derived from this signature so it is announced only when results change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusKey]);
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
          {caption ? (
            <caption className={hideCaption ? styles.visuallyHidden : styles.caption}>
              {caption}
            </caption>
          ) : null}
          <TableHead
            columns={columns}
            data={data}
            getRowId={getRowId}
            sort={sort}
            onSortChange={onSortChange}
            selection={selection}
            disabled={isInteractionDisabled}
          />
          <TableBody
            data={data}
            columns={columns}
            getRowId={getRowId}
            getRowLabel={getRowLabel}
            onRowClick={isInteractionDisabled ? undefined : onRowClick}
            selection={selection}
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
      <div className={styles.visuallyHidden} role="status">
        {statusMessage}
      </div>
    </div>
  );
}
