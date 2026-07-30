"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import Avatar from "@/components/Avatar";

import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  {
    label: "dashboard",
    href: "/",
  },
  {
    label: "users",
    href: "/users",
  },
  {
    label: "documents",
    href: "/documents",
  },
  {
    label: "tasks",
    href: "/tasks",
  },
  {
    label: "settings",
    href: "/settings",
  },
];

export default function Sidebar() {
  const t = useTranslations("Sidebar");

  const items = NAV_ITEMS.map((item) => ({
    label: t(item.label),
    href: item.href,
  }));

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {items.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>
                <button type="button" className={styles.navItem}>
                  {item.label}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <Avatar
          size="sm"
          title="Jane Doe"
          subtitle="jane.doe@example.com"
          onClick={() => {
            /* TODO: add menu bar*/
          }}
        />
      </div>
    </aside>
  );
}
