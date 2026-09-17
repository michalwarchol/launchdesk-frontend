import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;

export const acceptInviteSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH, "passwordTooShort"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "passwordsMismatch",
        path: ["confirmPassword"],
      });
    }
  });

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;
