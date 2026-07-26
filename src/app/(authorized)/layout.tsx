import Sidebar from "@/components/Sidebar";

import styles from "./layout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
