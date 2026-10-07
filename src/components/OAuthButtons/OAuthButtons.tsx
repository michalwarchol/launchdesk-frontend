"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/Button";

import styles from "./OAuthButtons.module.scss";
import { GithubIcon, GoogleIcon } from "./ProviderIcon";

export type OAuthProvider = "github" | "google";

interface OAuthButtonsProps {
  apiBase: string;
  next?: string;
  disabled?: boolean;
  className?: string;
}

export default function OAuthButtons({ apiBase, next, disabled, className }: OAuthButtonsProps) {
  const t = useTranslations("OAuthButtons");

  const start = (provider: OAuthProvider) => {
    const url = new URL(`${apiBase.replace(/\/$/, "")}/auth/${provider}`, window.location.origin);

    if (next) url.searchParams.set("next", next);

    window.location.assign(url.toString());
  };

  return (
    <div className={[styles.providers, className].filter(Boolean).join(" ")}>
      <Button
        variant="outline"
        className={styles.provider}
        disabled={disabled}
        onClick={() => start("google")}
      >
        <GoogleIcon />
        {t("google")}
      </Button>

      <Button
        variant="outline"
        className={styles.provider}
        disabled={disabled}
        onClick={() => start("github")}
      >
        <GithubIcon />
        {t("github")}
      </Button>
    </div>
  );
}
