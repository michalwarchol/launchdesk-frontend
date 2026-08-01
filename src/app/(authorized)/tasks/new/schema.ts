import { z } from "zod";

import { Attachment } from "@/components/AttachmentsField";

const attachmentSchema = z.custom<Attachment>();

const stepSchema = z.object({
  key: z.string(),
  name: z.string().trim().min(1, "stepNameRequired"),
  description: z.string(),
  attachments: z.array(attachmentSchema),
});

export const newTaskSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(120, "nameTooLong"),
  description: z.string().trim().min(1, "descriptionRequired"),
  steps: z.array(stepSchema).min(1, "stepsRequired"),
});

export type NewTaskFormValues = z.infer<typeof newTaskSchema>;
export type StepFormValues = z.infer<typeof stepSchema>;

export function createEmptyStep(): StepFormValues {
  return {
    key:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
    name: "",
    description: "",
    attachments: [],
  };
}
