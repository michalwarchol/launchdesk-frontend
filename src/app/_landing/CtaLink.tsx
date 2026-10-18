import Link from "next/link";

import buttonStyles from "@/components/Button/Button.module.scss";

import styles from "./CtaLink.module.scss";

interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  className?: string;
}

/**
 * The marketing CTAs must be real anchors so that crawlers and no-JS visitors can follow them.
 * `Button` renders a `<button>`, so this reuses its styles on top of `next/link`.
 */
export default function CtaLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  className,
}: CtaLinkProps) {
  const linkClassName = [
    buttonStyles.button,
    buttonStyles[size],
    buttonStyles[variant],
    styles.link,
    variant === "primary" ? styles.primary : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
}
