import type { InputHTMLAttributes } from "react";

/** Firefox session restore can strip `disabled` before hydration; `autoComplete="off"` opts the control out. */
export const preventFirefoxDisabledRestore = {
  autoComplete: "off",
} satisfies InputHTMLAttributes<HTMLButtonElement>;
