import { z } from "zod";

export const REPORT_PURPOSES = ["bug", "feature", "other"] as const;

export const MAX_DESCRIPTION_LENGTH = 5000;

export const reportSchema = z.object({
  purpose: z.enum(REPORT_PURPOSES),
  description: z
    .string()
    .trim()
    .min(1, "descriptionRequired")
    .max(MAX_DESCRIPTION_LENGTH, "descriptionTooLong"),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
