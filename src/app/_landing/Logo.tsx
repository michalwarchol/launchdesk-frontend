import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

import styles from "./Logo.module.scss";

interface LogoProps {
  priority?: boolean;
}

export default function Logo({ priority = false }: LogoProps) {
  return (
    <Link href="/" className={styles.logo} aria-label={`${SITE_NAME} home`}>
      <Image
        src="/logo.png"
        width={32}
        height={32}
        alt=""
        priority={priority}
        className={styles.mark}
      />
      <span className={styles.wordmark} data-wordmark="">
        {SITE_NAME}
      </span>
    </Link>
  );
}
