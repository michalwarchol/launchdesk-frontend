import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import styles from "./layout.module.scss";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Middleware already redirects unauthenticated requests; this is the boundary that actually
  // guarantees no authorized page renders without a session.
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const { user } = session;

  return (
    <div className={styles.page}>
      <Sidebar
        user={{
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: user.avatar,
        }}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
