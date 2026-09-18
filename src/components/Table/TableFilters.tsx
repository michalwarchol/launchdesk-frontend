import { useTranslations } from "next-intl";

import Select from "@/components/Select";
import TextField from "@/components/TextField";

import styles from "./Table.module.scss";

import type { FilterConfig } from "./types";

interface TableFiltersProps {
  filters: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
}

export default function TableFilters({ filters, filterValues, onFilterChange }: TableFiltersProps) {
  const t = useTranslations("Table");

  return (
    <div className={styles.filters}>
      {filters.map((filter) => {
        const value = filterValues?.[filter.key] ?? "";

        return (
          <div key={filter.key} className={styles.filterField}>
            {filter.type === "select" ? (
              <Select
                id={`table-filter-${filter.key}`}
                size="sm"
                label={filter.label}
                // Clearing a filter has to stay reachable, so "all" is a real option rather than
                // just a placeholder.
                options={[{ value: "", label: t("filterAll") }, ...(filter.options ?? [])]}
                value={value}
                onChange={(next) => onFilterChange?.(filter.key, next)}
              />
            ) : (
              <TextField
                id={`table-filter-${filter.key}`}
                size="sm"
                label={filter.label}
                value={value}
                onChange={(event) => onFilterChange?.(filter.key, event.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
