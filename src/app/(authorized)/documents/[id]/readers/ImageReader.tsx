import { useTranslations } from "next-intl";

import styles from "../page.module.scss";

import { useObjectUrl } from "./useObjectUrl";

const IMAGE_TYPES: Record<string, string> = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

interface ImageReaderProps {
  alt: string;
  blob: Blob;
  extension: string;
}

export default function ImageReader({ alt, blob, extension }: ImageReaderProps) {
  const t = useTranslations("DocumentReaderPage");
  const url = useObjectUrl(blob, IMAGE_TYPES[extension]);

  if (!url) {
    return (
      <p className={styles.status} role="status">
        {t("loading")}
      </p>
    );
  }

  return (
    <div className={styles.imageStage}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} className={styles.image} src={url} />
    </div>
  );
}
