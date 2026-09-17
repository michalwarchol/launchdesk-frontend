"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/Button";

import styles from "./OAuthButtons.module.scss";
import { GithubIcon, GoogleIcon } from "./ProviderIcon";

export type OAuthProvider = "github" | "google";

interface OAuthButtonsProps {
  /** Path to return to once the provider has authenticated the user. */
  next?: string;
  disabled?: boolean;
  className?: string;
}

export default function OAuthButtons({ next, disabled, className }: OAuthButtonsProps) {
  const t = useTranslations("OAuthButtons");

  const start = (provider: OAuthProvider) => {
    // TODO: redirect to `GET {API}/auth/{provider}?next={next}` once the backend owns the OAuth
    // flow. The backend performs the provider handshake, matches the provider email to an existing
    // organization member and sets the session cookie. An unknown email must fail (no self-signup)
    // and redirect back to `/login?error=noAccount`.
    console.info("OAuth sign-in requested:", { provider, next });
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
