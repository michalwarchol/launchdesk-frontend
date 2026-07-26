import { useTranslations } from "next-intl";

import styles from "./Table.module.scss";

import type { PaginationState } from "./types";

interface PaginationProps {
  pagination: PaginationState;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const t = useTranslations("Table");
  const { page, pageSize, total } = pagination;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className={styles.pagination}>
      <span className={styles.pageInfo}>{t("pageInfo", { page, pageCount })}</span>
      <button
        type="button"
        className={styles.pageButton}
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        {t("prev")}
      </button>
      {pageNumbers.map((pageNumber) => {
        const pageButtonClassName = [
          styles.pageButton,
          pageNumber === page ? styles.pageButtonActive : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={pageNumber}
            type="button"
            className={pageButtonClassName}
            onClick={() => onPageChange?.(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        type="button"
        className={styles.pageButton}
        disabled={page >= pageCount}
        onClick={() => onPageChange?.(page + 1)}
      >
        {t("next")}
      </button>
    </div>
  );
}
