import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "emailRequired").pipe(z.email("emailInvalid")),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
