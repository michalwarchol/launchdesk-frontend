import { z } from "zod";

const assigneeOptionSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
});

export const editAssignmentSchema = z.object({
  assignees: z.array(assigneeOptionSchema).min(1, "assigneesRequired"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dueDateRequired")
    .nullable(),
});

export type EditAssignmentFormValues = z.infer<typeof editAssignmentSchema>;
export type AssigneeOption = z.infer<typeof assigneeOptionSchema>;
