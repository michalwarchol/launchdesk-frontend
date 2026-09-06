import { z } from "zod";

const taskOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const assigneeOptionSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
});

export const newAssignmentSchema = z
  .object({
    task: taskOptionSchema.nullable(),
    assignees: z.array(assigneeOptionSchema).min(1, "assigneesRequired"),
  })
  .superRefine((data, ctx) => {
    if (!data.task) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "taskRequired", path: ["task"] });
    }
  });

export type NewAssignmentFormValues = z.infer<typeof newAssignmentSchema>;
export type TaskOption = z.infer<typeof taskOptionSchema>;
export type AssigneeOption = z.infer<typeof assigneeOptionSchema>;
