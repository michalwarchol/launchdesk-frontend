import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;

// The avatar is not part of the schema because it is picked through a dropzone rather than typed,
// so `ProfileForm` keeps the pending data URL in local state.
export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "firstNameRequired"),
  lastName: z.string().trim().min(1, "lastNameRequired"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const organizationSchema = z.object({
  name: z.string().trim().min(1, "organizationNameRequired").max(255, "organizationNameTooLong"),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

export const notificationsSchema = z.object({
  assignmentNotificationEmails: z.boolean(),
});

export type NotificationsFormValues = z.infer<typeof notificationsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPasswordRequired"),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, "passwordTooShort"),
    confirmNewPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "passwordsMismatch",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
