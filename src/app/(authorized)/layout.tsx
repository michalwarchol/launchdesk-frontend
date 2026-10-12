import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Providers from "@/app/providers";
import Sidebar from "@/components/Sidebar";
import {
  AFTER_LOGIN_PATH,
  isUserAllowedPath,
  LOGIN_PATH,
  PATHNAME_HEADER,
  USER_HOME_PATH,
} from "@/lib/auth/routes";
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
  const headerStore = await headers();
  const pathname = headerStore.get(PATHNAME_HEADER);

  if (user.role === "user" && pathname && !isUserAllowedPath(pathname)) {
    redirect(USER_HOME_PATH);
  }

  return (
    <Providers>
      <div className={styles.page}>
        <Sidebar
          role={user.role}
          user={{
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: user.avatar,
          }}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </Providers>
  );
}
