"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import Alert from "@/components/Alert";
import Button from "@/components/Button";

import styles from "./error.module.scss";

interface AuthorizedErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthorizedError({ error, reset }: AuthorizedErrorProps) {
  const t = useTranslations("AuthorizedError");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error}>
      <h1 className={styles.title}>{t("title")}</h1>
      <Alert>{t("description")}</Alert>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
