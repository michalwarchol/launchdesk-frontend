import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import styles from "../page.module.scss";

interface TextReaderProps {
  blob: Blob;
  documentName: string;
}

export default function TextReader({ blob, documentName }: TextReaderProps) {
  const t = useTranslations("DocumentReaderPage");
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    blob.text().then((value) => {
      if (!cancelled) setText(value);
    });

    return () => {
      cancelled = true;
    };
  }, [blob]);

  if (text === null) {
    return (
      <p className={styles.status} role="status">
        {t("loading")}
      </p>
    );
  }

  return (
    <pre
      className={styles.text}
      tabIndex={0}
      role="region"
      aria-label={t("previewRegion", { name: documentName })}
    >
      {text}
    </pre>
  );
}
