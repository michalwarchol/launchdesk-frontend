"use client";

import Avatar from "@/components/Avatar";

import styles from "./Sidebar.module.scss";

// TODO: replace with the real navigation items.
const NAV_ITEMS = ["Dashboard", "Projects", "Tasks", "Settings"];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button type="button" className={styles.navItem}>
                {item}
              </button>
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
