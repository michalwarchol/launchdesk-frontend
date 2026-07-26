import { useTranslations } from "next-intl";

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
            <label className={styles.filterLabel} htmlFor={`table-filter-${filter.key}`}>
              {filter.label}
            </label>
            {filter.type === "select" ? (
              <select
                id={`table-filter-${filter.key}`}
                className={styles.filterInput}
                value={value}
                onChange={(event) => onFilterChange?.(filter.key, event.target.value)}
              >
                <option value="">{t("filterAll")}</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`table-filter-${filter.key}`}
                type="text"
                className={styles.filterInput}
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
