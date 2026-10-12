import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import Alert from "@/components/Alert";

import styles from "../page.module.scss";

interface DocxReaderProps {
  blob: Blob;
}

type Phase = "loading" | "ready" | "error";

function pageContentHeight(section: HTMLElement): number {
  const style = getComputedStyle(section);
  const pageHeight = Number.parseFloat(style.minHeight);

  if (!Number.isFinite(pageHeight) || pageHeight <= 0) return 0;

  const padding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
  let occupied = 0;

  for (const child of section.children) {
    if (child instanceof HTMLElement && child.tagName !== "ARTICLE") {
      occupied += child.offsetHeight;
    }
  }

  return pageHeight - padding - occupied;
}

function paginateSection(section: HTMLElement) {
  const article = section.querySelector(":scope > article");

  if (!(article instanceof HTMLElement)) return;

  const available = pageContentHeight(section);

  if (available <= 0) return;

  const nodes = [...article.children];
  let current = section;
  let used = 0;

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;

    const height = node.offsetHeight;

    if (used > 0 && used + height > available) {
      const next = current.cloneNode(true);

      if (!(next instanceof HTMLElement)) return;

      next.querySelectorAll("article").forEach((copy) => copy.replaceChildren());
      current.after(next);
      current = next;
      used = 0;
    }

    const targetArticle = current.querySelector(":scope > article");

    if (!(targetArticle instanceof HTMLElement)) return;

    targetArticle.appendChild(node);
    used += node.offsetHeight;
  }
}

function paginateDocx(root: ParentNode) {
  for (const section of root.querySelectorAll("section.docx")) {
    if (section instanceof HTMLElement) paginateSection(section);
  }
}

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
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
        });
        if (!cancelled) paginateDocx(target);

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
