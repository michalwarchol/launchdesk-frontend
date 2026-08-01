"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

import styles from "./Accordion.module.scss";

export interface AccordionItemData {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
  hasError?: boolean;
  onRemove?: () => void;
}

export interface AccordionProps {
  items: AccordionItemData[];
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
  allowMultiple?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export default function Accordion({
  items,
  expandedIds,
  onExpandedChange,
  allowMultiple = true,
  footer,
  className,
}: AccordionProps) {
  const t = useTranslations("Accordion");
  const baseId = useId();

  const toggle = (id: string) => {
    const isExpanded = expandedIds.includes(id);

    if (isExpanded) {
      onExpandedChange(expandedIds.filter((expandedId) => expandedId !== id));
      return;
    }

    onExpandedChange(allowMultiple ? [...expandedIds, id] : [id]);
  };

  return (
    <div className={[styles.accordion, className].filter(Boolean).join(" ")}>
      {items.map((item, index) => {
        const isExpanded = expandedIds.includes(item.id);
        const headerId = `${baseId}-${index}-header`;
        const panelId = `${baseId}-${index}-panel`;

        const itemClassName = [styles.item, item.hasError ? styles.itemError : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={item.id} className={itemClassName}>
            <div className={styles.headerRow}>
              <button
                type="button"
                id={headerId}
                className={styles.trigger}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span
                  className={[styles.chevron, isExpanded ? styles.chevronOpen : ""]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
                <span className={styles.header}>{item.header}</span>
              </button>

              {item.onRemove ? (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    item.onRemove?.();
                  }}
                  aria-label={t("remove")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              ) : null}
            </div>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={styles.panel}
              hidden={!isExpanded}
            >
              {isExpanded ? <div className={styles.panelInner}>{item.content}</div> : null}
            </div>
          </div>
        );
      })}

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
