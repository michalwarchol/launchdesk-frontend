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
  className?: string;
}

export default function AvatarGroup({ items, max = 3, size = "sm", className }: AvatarGroupProps) {
  const t = useTranslations("AvatarGroup");

  const visibleItems = items.slice(0, max);
  const overflowCount = items.length - visibleItems.length;

  return (
    <div className={[styles.group, className].filter(Boolean).join(" ")}>
      {visibleItems.map((item) => (
        <div key={item.id} className={styles.item}>
          <Avatar src={item.src} title={item.name} size={size} hideText />
        </div>
      ))}
      {overflowCount > 0 ? (
        <div
          className={[styles.item, styles.overflow, styles[size]].filter(Boolean).join(" ")}
          aria-label={t("moreLabel", { count: overflowCount })}
          title={t("moreLabel", { count: overflowCount })}
        >
          +{overflowCount}
        </div>
      ) : null}
    </div>
  );
}
