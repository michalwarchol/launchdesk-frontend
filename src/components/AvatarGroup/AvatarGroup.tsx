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
  className?: string;
}

export default function AvatarGroup({
  items,
  max = 3,
  size = "sm",
  ariaLabel,
  className,
}: AvatarGroupProps) {
  const t = useTranslations("AvatarGroup");

  const visibleItems = items.slice(0, max);
  const overflowCount = items.length - visibleItems.length;
  const overflowLabel = t("moreLabel", { count: overflowCount });

  return (
    <ul
      role="list"
      aria-label={ariaLabel ?? t("groupLabel")}
      className={[styles.group, className].filter(Boolean).join(" ")}
    >
      {visibleItems.map((item) => (
        <li key={item.id} className={styles.item}>
          <Avatar src={item.src} title={item.name} size={size} hideText />
        </li>
      ))}
      {overflowCount > 0 ? (
        <li className={styles.item}>
          <div
            className={[styles.overflow, styles[size]].filter(Boolean).join(" ")}
            role="img"
            aria-label={overflowLabel}
            title={overflowLabel}
          >
            +{overflowCount}
          </div>
        </li>
      ) : null}
    </ul>
  );
}
