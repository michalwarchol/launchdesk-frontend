import { AssignmentStatus } from "../types";

// Hex mirrors of the CSS custom properties in `src/app/globals.css`. Recharts
// accepts color strings but not CSS variables, so the palette is duplicated here
// following the same precedent as `Select.tsx` mirroring its SCSS constants.
export const CHART_COLORS = {
  surface: "#1c1f26",
  border: "rgba(255, 255, 255, 0.08)",
  textMuted: "#9a9ea6",
  textSecondary: "#d6d8dc",
  textStrong: "#ffffff",
  primary: "#f5c26b",
  primaryHover: "#f7cd83",
  success: "#4cc38a",
  danger: "#e5484d",
  info: "#6ba8f5",
  neutral: "#6b7280",
} as const;

export const STATUS_COLORS: Record<AssignmentStatus, string> = {
  completed: CHART_COLORS.success,
  overdue: CHART_COLORS.danger,
  inProgress: CHART_COLORS.primary,
  notStarted: CHART_COLORS.neutral,
};

export const AXIS_TICK = {
  fill: CHART_COLORS.textMuted,
  fontSize: 12,
} as const;
