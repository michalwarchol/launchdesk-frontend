"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { logout } from "@/app/actions/auth";
import Avatar from "@/components/Avatar";
import { isManagerRole } from "@/lib/auth/roles";
import { REPORT_PATH } from "@/lib/auth/routes";
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

const NARROW_QUERY = "(max-width: 1023px)";

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
  const pathname = usePathname() ?? "";
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const [isSigningOut, startSignOut] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  const items = NAV_ITEMS.filter((item) => !item.managerOnly || isManagerRole(role)).map(
    (item) => ({
      label: t(item.label),
      href: item.href,
    }),
  );
  const homeHref = isManagerRole(role) ? "/dashboard" : "/my-tasks";

  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    const update = () => setIsNarrow(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!wasOpenRef.current) return;

    wasOpenRef.current = false;
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      wasOpenRef.current = false;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => {
    wasOpenRef.current = false;
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.menuBar}>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() =>
            setIsOpen((open) => {
              wasOpenRef.current = !open;
              return !open;
            })
          }
        >
          {t("menu")}
        </button>
      </div>
      {isNarrow && isOpen ? <div className={styles.backdrop} onClick={closeMenu} /> : null}
      <aside
        id={panelId}
        className={[styles.sidebar, isOpen ? styles.sidebarOpen : ""].filter(Boolean).join(" ")}
        inert={isNarrow && !isOpen ? true : undefined}
      >
        <div className={styles.brand}>
          <Link href={homeHref} className={styles.brandLink}>
            <Image src="/logo.png" width={32} height={32} alt="" priority className={styles.mark} />
            <span className={styles.wordmark}>Launchdesk</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={[styles.navItem, isActive ? styles.navItemActive : ""]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={styles.footer}>
          <Avatar size="sm" src={user.avatar} title={user.name} subtitle={user.email} />
          <Link href={REPORT_PATH} className={styles.report}>
            {t("report")}
          </Link>
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
    </>
  );
}
