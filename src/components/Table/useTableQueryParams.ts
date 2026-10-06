"use client";

import { useTableParams } from "./useTableParams";

import type { PaginationState, SortDirection, SortState } from "./types";
import type { PaginationParams } from "@/lib/api/types";

export interface TableQueryProps {
  sort: SortState;
  onSortChange: (key: string, direction: SortDirection) => void;
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export function useTableQueryParams<TFilter extends string = never>(
  filterKeys: readonly TFilter[] = [],
) {
  const { sort, filterValues, page, pageSize, setSort, setFilter, setPage } = useTableParams();

  const params: PaginationParams = { page, pageSize };

  if (sort) {
    params.sort = `${sort.key}:${sort.direction}`;
  }

  for (const key of filterKeys) {
    const value = filterValues[key];

    if (value) params[key] = value;
  }

  const getTableProps = (total: number | undefined): TableQueryProps => ({
    sort,
    onSortChange: setSort,
    filterValues,
    onFilterChange: setFilter,
    pagination: { page, pageSize, total: total ?? 0 },
    onPageChange: setPage,
  });

  return { params, getTableProps };
}
