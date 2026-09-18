import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "firstNameRequired"),
    lastName: z.string().trim().min(1, "lastNameRequired"),
    email: z.string().trim().min(1, "emailRequired").pipe(z.email("emailInvalid")),
    password: z.string().min(MIN_PASSWORD_LENGTH, "passwordTooShort"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
    organizationName: z.string().trim().min(1, "organizationNameRequired"),
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

export type RegisterFormValues = z.infer<typeof registerSchema>;
