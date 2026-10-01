import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import { AFTER_LOGIN_PATH, LOGIN_PATH, PATHNAME_HEADER } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { getRefreshToken } from "@/lib/auth/tokens";

import styles from "./layout.module.scss";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The proxy only checks that a refresh cookie exists. When the access token has expired, renew
  // it before giving up, otherwise the proxy sends `/login` straight back here.
  const session = await getSession();

  if (!session) {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) redirect(LOGIN_PATH);

    const headerStore = await headers();
    const next = headerStore.get(PATHNAME_HEADER) ?? AFTER_LOGIN_PATH;

    redirect(`/api/auth/refresh-session?next=${encodeURIComponent(next)}`);
  }

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
