import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import Alert from "@/components/Alert";

import styles from "../page.module.scss";

interface DocxReaderProps {
  blob: Blob;
}

type Phase = "loading" | "ready" | "error";

export default function DocxReader({ blob }: DocxReaderProps) {
  const t = useTranslations("DocumentReaderPage");
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [sourceBlob, setSourceBlob] = useState(blob);

  if (sourceBlob !== blob) {
    setSourceBlob(blob);
    setPhase("loading");
  }

  useEffect(() => {
    const host = containerRef.current;

    if (!host) return;

    const target = document.createElement("div");
    host.replaceChildren(target);
    let cancelled = false;

    const render = async () => {
      try {
        const { renderAsync } = await import("docx-preview");
        await renderAsync(blob, target, undefined, {
          ignoreLastRenderedPageBreak: false,
          breakPages: true,
        });

        if (!cancelled) setPhase("ready");
      } catch {
        if (!cancelled) setPhase("error");
      }
    };

    void render();

    return () => {
      cancelled = true;
      target.remove();
    };
  }, [blob]);

  return (
    <div className={styles.preview}>
      {phase === "loading" ? (
        <p className={styles.status} role="status">
          {t("loading")}
        </p>
      ) : null}
      {phase === "error" ? <Alert variant="error">{t("previewError")}</Alert> : null}
      <div ref={containerRef} className={styles.docx} hidden={phase === "error"} />
    </div>
  );
}
