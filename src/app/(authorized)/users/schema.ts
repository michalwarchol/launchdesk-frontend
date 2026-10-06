import { z } from "zod";

export const USER_ROLES = ["user", "admin"] as const;

export const inviteUserSchema = z.object({
  firstName: z.string().trim().min(1, "firstNameRequired"),
  lastName: z.string().trim().min(1, "lastNameRequired"),
  email: z.string().trim().min(1, "emailRequired").email("emailInvalid"),
  role: z.enum(USER_ROLES),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
