"use client";

import { useTranslations } from "next-intl";

import Avatar, { AvatarSize } from "@/components/Avatar";

import styles from "./AvatarGroup.module.scss";

export interface AvatarGroupItem {
  id: string;
  name: string;
  src?: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
  ariaLabel?: string;
  /** Hides the group when the same names are written out next to it. */
  decorative?: boolean;
  className?: string;
}

export default function AvatarGroup({
  items,
  max = 3,
  size = "sm",
  ariaLabel,
  decorative = false,
  className,
}: AvatarGroupProps) {
  const t = useTranslations("AvatarGroup");

  const visibleItems = items.slice(0, max);
  const overflowCount = items.length - visibleItems.length;
  const overflowLabel = t("moreLabel", { count: overflowCount });

  return (
    <ul
      role={decorative ? undefined : "list"}
      aria-label={decorative ? undefined : (ariaLabel ?? t("groupLabel"))}
      aria-hidden={decorative || undefined}
      className={[styles.group, className].filter(Boolean).join(" ")}
    >
      {visibleItems.map((item) => (
        <li key={item.id} className={styles.item}>
          <Avatar src={item.src} title={item.name} size={size} hideText decorative={decorative} />
        </li>
      ))}
      {overflowCount > 0 ? (
        <li className={styles.item}>
          <div
            className={[styles.overflow, styles[size]].filter(Boolean).join(" ")}
            role={decorative ? undefined : "img"}
            aria-label={decorative ? undefined : overflowLabel}
            title={decorative ? undefined : overflowLabel}
          >
            +{overflowCount}
          </div>
        </li>
      ) : null}
    </ul>
  );
}
