import styles from "./layout.module.scss";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.page}>
      <main className={styles.panel}>{children}</main>
    </div>
  );
}
