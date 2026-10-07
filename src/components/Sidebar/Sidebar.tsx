"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { logout } from "@/app/actions/auth";
import Avatar from "@/components/Avatar";

import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  {
    label: "dashboard",
    href: "/dashboard",
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
    label: "assignments",
    href: "/assignments",
  },
  {
    label: "settings",
    href: "/settings",
  },
];

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  user: SidebarUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const [isSigningOut, startSignOut] = useTransition();

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
        <Avatar size="sm" src={user.avatar} title={user.name} subtitle={user.email} />
        <button
          type="button"
          className={styles.signOut}
          disabled={isSigningOut}
          onClick={() => startSignOut(() => logout())}
        >
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
