"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { SortDirection, SortState } from "./types";

const SORT_PARAM = "sort";
const PAGE_PARAM = "page";
const PAGE_SIZE_PARAM = "pageSize";
const RESERVED_PARAMS = [SORT_PARAM, PAGE_PARAM, PAGE_SIZE_PARAM];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const parseSort = (value: string | null): SortState => {
  if (!value) return null;

  const [key, direction] = value.split(":");
  if (!key || (direction !== "asc" && direction !== "desc")) return null;

  return { key, direction };
};

export interface UseTableParamsResult {
  sort: SortState;
  filterValues: Record<string, string>;
  page: number;
  pageSize: number;
  setSort: (key: string, direction: SortDirection) => void;
  setFilter: (key: string, value: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

/**
 * Drives Table sorting/filtering/pagination state through the URL search params,
 * so the API can be queried directly from the resulting values.
 */
export function useTableParams(): UseTableParamsResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = useMemo(() => parseSort(searchParams.get(SORT_PARAM)), [searchParams]);
  const page = Number(searchParams.get(PAGE_PARAM)) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get(PAGE_SIZE_PARAM)) || DEFAULT_PAGE_SIZE;

  const filterValues = useMemo(() => {
    const values: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (!RESERVED_PARAMS.includes(key) && value) {
        values[key] = value;
      }
    });

    return values;
  }, [searchParams]);

  const navigate = (params: URLSearchParams) => {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setSort = (key: string, direction: SortDirection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(SORT_PARAM, `${key}:${direction}`);
    params.set(PAGE_PARAM, String(DEFAULT_PAGE));
    navigate(params);
  };

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set(PAGE_PARAM, String(DEFAULT_PAGE));
    navigate(params);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM, String(nextPage));
    navigate(params);
  };

  const setPageSize = (nextPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_SIZE_PARAM, String(nextPageSize));
    params.set(PAGE_PARAM, String(DEFAULT_PAGE));
    navigate(params);
  };

  return { sort, filterValues, page, pageSize, setSort, setFilter, setPage, setPageSize };
}
