"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { logout } from "@/app/actions/auth";
import Avatar from "@/components/Avatar";
import { isManagerRole } from "@/lib/auth/roles";
import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

import styles from "./Sidebar.module.scss";

import type { UserRole } from "@/lib/api/types";

const NAV_ITEMS = [
  {
    label: "dashboard",
    href: "/dashboard",
    managerOnly: true,
  },
  {
    label: "myTasks",
    href: "/my-tasks",
    managerOnly: false,
  },
  {
    label: "users",
    href: "/users",
    managerOnly: true,
  },
  {
    label: "documents",
    href: "/documents",
    managerOnly: true,
  },
  {
    label: "tasks",
    href: "/tasks",
    managerOnly: true,
  },
  {
    label: "assignments",
    href: "/assignments",
    managerOnly: true,
  },
  {
    label: "settings",
    href: "/settings",
    managerOnly: false,
  },
];

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  user: SidebarUser;
  role: UserRole;
}

export default function Sidebar({ user, role }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const [isSigningOut, startSignOut] = useTransition();

  const items = NAV_ITEMS.filter((item) => !item.managerOnly || isManagerRole(role)).map(
    (item) => ({
      label: t(item.label),
      href: item.href,
    }),
  );
  const homeHref = isManagerRole(role) ? "/dashboard" : "/my-tasks";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href={homeHref} className={styles.brandLink}>
          <Image
            src="/favicon-32x32.png"
            width={32}
            height={32}
            alt=""
            priority
            className={styles.mark}
          />
          <span className={styles.wordmark}>Launchdesk</span>
        </Link>
      </div>
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
          {...preventFirefoxDisabledRestore}
          onClick={() => startSignOut(() => logout())}
        >
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
