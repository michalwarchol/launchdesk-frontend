import { useTranslations } from "next-intl";

import styles from "../page.module.scss";

import { useObjectUrl } from "./useObjectUrl";

interface PdfReaderProps {
  blob: Blob;
  title: string;
}

export default function PdfReader({ blob, title }: PdfReaderProps) {
  const t = useTranslations("DocumentReaderPage");
  const url = useObjectUrl(blob, "application/pdf");

  if (!url) {
    return (
      <p className={styles.status} role="status">
        {t("loading")}
      </p>
    );
  }

  return <iframe className={styles.frame} src={url} title={title} />;
}
