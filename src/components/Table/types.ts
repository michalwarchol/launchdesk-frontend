export type SortDirection = "asc" | "desc";

export type SortState = {
  key: string;
  direction: SortDirection;
} | null;

export type ColumnAlign = "center" | "left" | "right";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  align?: ColumnAlign;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  type: "select" | "text";
  options?: FilterOption[];
};

export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};
