import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import Alert from "@/components/Alert";

import styles from "../page.module.scss";

interface SpreadsheetReaderProps {
  blob: Blob;
  extension: string;
  documentName: string;
}

interface SheetData {
  name: string;
  rows: string[][];
}

type Phase = "loading" | "ready" | "error";

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function trimRows(rows: string[][]): string[][] {
  const trimmed = rows.map((row) => {
    let end = row.length;

    while (end > 0 && row[end - 1] === "") end -= 1;

    return row.slice(0, end);
  });

  let last = trimmed.length;

  while (last > 0 && trimmed[last - 1].length === 0) last -= 1;

  return trimmed.slice(0, last);
}

async function readSheets(blob: Blob, extension: string): Promise<SheetData[]> {
  const xlsx = await import("xlsx");
  const buffer = await blob.arrayBuffer();
  const workbook =
    extension === "csv"
      ? xlsx.read(new TextDecoder().decode(buffer), { type: "string" })
      : xlsx.read(buffer, { type: "array" });

  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const rows = xlsx.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: false,
      defval: "",
    });

    return {
      name,
      rows: trimRows(rows.map((row) => row.map(cellText))),
    };
  });
}

export default function SpreadsheetReader({
  blob,
  extension,
  documentName,
}: SpreadsheetReaderProps) {
  const t = useTranslations("DocumentReaderPage");
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [source, setSource] = useState({ blob, extension });

  if (source.blob !== blob || source.extension !== extension) {
    setSource({ blob, extension });
    setPhase("loading");
    setSheets([]);
    setActiveIndex(0);
  }

  useEffect(() => {
    let cancelled = false;

    readSheets(blob, extension)
      .then((nextSheets) => {
        if (cancelled) return;

        setSheets(nextSheets);
        setActiveIndex(0);
        setPhase("ready");
      })
      .catch(() => {
        if (!cancelled) setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [blob, extension]);

  if (phase === "loading") {
    return (
      <p className={styles.status} role="status">
        {t("loading")}
      </p>
    );
  }

  if (phase === "error") {
    return <Alert variant="error">{t("previewError")}</Alert>;
  }

  const activeSheet = sheets[activeIndex];

  if (!activeSheet) {
    return <p className={styles.status}>{t("emptySheet")}</p>;
  }

  const panelId = `${baseId}-panel`;

  const focusTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleTabListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const nextIndex: Record<string, number> = {
      ArrowRight: (activeIndex + 1) % sheets.length,
      ArrowLeft: (activeIndex - 1 + sheets.length) % sheets.length,
      Home: 0,
      End: sheets.length - 1,
    };
    const index = nextIndex[event.key];

    if (index === undefined) return;

    event.preventDefault();
    focusTab(index);
  };

  return (
    <div className={styles.preview}>
      {sheets.length > 1 ? (
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={t("tabsLabel")}
          onKeyDown={handleTabListKeyDown}
        >
          {sheets.map((sheet, index) => (
            <button
              key={`${sheet.name}-${index}`}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              className={[styles.tab, index === activeIndex ? styles.tabActive : ""]
                .filter(Boolean)
                .join(" ")}
              aria-selected={index === activeIndex}
              aria-controls={panelId}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => setActiveIndex(index)}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      ) : null}
      <div
        id={sheets.length > 1 ? panelId : undefined}
        role={sheets.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={sheets.length > 1 ? `${baseId}-tab-${activeIndex}` : undefined}
      >
        {activeSheet.rows.length === 0 ? (
          <p className={styles.status}>{t("emptySheet")}</p>
        ) : (
          <div
            className={styles.grid}
            tabIndex={0}
            role="region"
            aria-label={t("previewRegion", { name: documentName })}
          >
            <table className={styles.table}>
              <tbody>
                {activeSheet.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, columnIndex) => (
                      <td key={columnIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
