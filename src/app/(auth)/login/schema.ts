import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "emailRequired").pipe(z.email("emailInvalid")),
  // Login only checks that something was typed. Strength rules belong to invite acceptance.
  password: z.string().min(1, "passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Failures the OAuth callback hands back through `?error=`. */
const oauthErrors = ["noAccount", "providerFailed"] as const;

export type OAuthCallbackError = (typeof oauthErrors)[number];

export function toOAuthCallbackError(value: string | undefined): OAuthCallbackError | undefined {
  return oauthErrors.find((error) => error === value);
}
