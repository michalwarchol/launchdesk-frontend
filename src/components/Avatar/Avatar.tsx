"use client";

import styles from "./Avatar.module.scss";

export type AvatarSize = "lg" | "md" | "sm";

export type AvatarProps = {
  src?: string;
  alt?: string;
  title: string;
  subtitle?: string;
  size?: AvatarSize;
  onClick?: () => void;
};

export default function Avatar({ src, alt, title, subtitle, size = "md", onClick }: AvatarProps) {
  const rootClassName = [styles.avatar, styles[size], onClick ? styles.clickable : ""]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {src ? (
        <img className={styles.photo} src={src} alt={alt ?? title} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {title.charAt(0).toUpperCase()}
        </span>
      )}
      <span className={styles.info}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={rootClassName} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={rootClassName}>{content}</div>;
}
