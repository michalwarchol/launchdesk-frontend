const HEADING_TAG = /<(\/?)h([1-6])(\s[^>]*)?>/gi;

/**
 * Raises every heading in stored rich text so it sits under a page heading.
 * An offset of `minimumLevel - 1` turns H1 into that minimum (H1 becomes H3 when the minimum is 3).
 */
export function shiftHeadingLevels(html: string, minimumLevel: number): string {
  if (!html) return html;

  const offset = Math.max(0, minimumLevel - 1);

  return html.replace(HEADING_TAG, (_match, slash: string, level: string, attributes = "") => {
    const next = Math.min(6, Number(level) + offset);

    return `<${slash}h${next}${attributes}>`;
  });
}
