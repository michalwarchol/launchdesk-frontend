import { SITE_NAME, SITE_URL } from "@/lib/site";

const body = `# ${SITE_NAME}

> Onboard new employees in one place. Task templates, documents, assignments with due dates and a live dashboard, so every new hire has a great first week.

## Public pages

- [${SITE_NAME}](${SITE_URL}/): Product overview, how onboarding works, and frequently asked questions.
- [Create an account](${SITE_URL}/register): Sign up for LaunchDesk.
- [Sign in](${SITE_URL}/login): Sign in to an existing account.
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
