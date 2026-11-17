# Accessibility Audit — Design

**Date:** 2026-11-17
**Deliverable:** `docs/accessibility-audit.md`
**Reference standard:** [WCAG 2.1](https://www.w3.org/TR/WCAG21/), conformance levels A and AA

## Goal

Produce an accessibility audit of the current LaunchDesk frontend that will serve as the backlog for later accessibility work. The audit documents issues only; no application code is changed as part of it.

## Scope

The whole application:

- **Shared components** — all 23 components in `src/components` (Accordion, Alert, AssignmentCard, AttachmentsField, Autocomplete, Avatar, AvatarGroup, Button, Card, Checkbox, DatePicker, Dropzone, Modal, OAuthButtons, PageHeader, ProgressBar, RichTextEditor, Select, Sidebar, StatCard, Table, TextField, Topbar).
- **Public pages** — landing (`src/app/page.tsx`, `src/app/_landing`), login, register, forgot password, reset password, invite accept, plus the `(auth)` layout.
- **Authorized pages** — dashboard, my tasks (list, detail), tasks (list, detail, new, edit), assignments (list, detail, new, edit), documents (list, detail), users (list, detail, edit), report, settings, plus the `(authorized)` layout (sidebar, topbar).
- **App-wide concerns** — root layout (`lang` attribute, page titles), i18n messages (`messages/en.json`, `messages/pl.json`) as a source of accessible names and alt text.

Only WCAG 2.1 success criteria at levels A and AA are checked. AAA criteria are out of scope.

## Method

Hybrid approach: component-first, then pages, then a criterion checklist pass.

1. **Component pass (static + Storybook).** For each shared component, review markup semantics, ARIA usage, accessible names, keyboard interaction, focus management and colour values in SCSS. Run the Storybook a11y addon (axe) against each component's stories.
2. **Page pass (runtime).** Run the app locally against a local backend, log in with a test account, and for every page:
   - run axe in the browser,
   - walk the main flows using only the keyboard (tab order, visible focus, no traps, modals/menus/pickers operable),
   - check page title, `lang`, heading hierarchy and landmarks,
   - check colour contrast of text, UI components and focus indicators,
   - check reflow at 320 CSS px width and text resize to 200%,
   - check how form errors and async status messages are announced (inspect the accessibility tree; no full screen-reader session).
3. **Criterion checklist pass.** Go through every WCAG 2.1 A/AA success criterion and mark it fail / pass / not applicable, ensuring app-wide criteria (e.g. 2.4.2 Page Titled, 3.1.1 Language of Page, 4.1.3 Status Messages, 1.4.10 Reflow) are not missed.

**Verification:** every reported issue is confirmed manually in code or in the browser. Automated tool findings that turn out to be false positives are dropped.

**Deduplication:** an issue rooted in a shared component is reported once, listing the pages it affects, rather than once per page.

**Prerequisites from the user:** a running local backend and its URL, test credentials, and information on available roles if the test account is not an admin.

**Limitations to state in the audit:** no testing with real assistive technology (NVDA, JAWS, VoiceOver); pages or states that could not be reached (role restrictions, missing data) are listed explicitly.

## Document structure (`docs/accessibility-audit.md`)

1. **Summary** — date, audited git commit, scope, WCAG 2.1 A/AA target, method and tools used, issue counts per priority.
2. **Priority levels** — table with columns `Priority | Meaning | Typical examples` (definitions below).
3. **Issues** — a single table with exactly four columns:
   - **Issue description** — what is wrong, followed by its location: affected file(s)/component (e.g. `src/components/Modal/Modal.tsx`) and affected pages.
   - **WCAG criterion violated** — number, name and level, linked to the WCAG 2.1 spec anchor, e.g. [1.4.3 Contrast (Minimum) (AA)](https://www.w3.org/TR/WCAG21/#contrast-minimum). An issue violating several criteria lists all of them in one row.
   - **Recommended fix** — a concrete change (e.g. "add `aria-labelledby` pointing to the modal title and move focus into the dialog on open").
   - **Priority** — Critical, High, Medium or Low.

   Rows are sorted by priority (Critical → Low), then by WCAG criterion number.

4. **Not checked** — pages, states or criteria that could not be verified, and why.

## Priority levels

Priority reflects user impact and where the issue occurs, not only the WCAG level.

| Priority     | Meaning                                                                                                                                                                        | Typical examples                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Some users cannot complete a core task at all and there is no workaround. Core tasks: logging in, registering, creating or editing tasks and assignments, uploading documents. | Keyboard trap; a submit control unreachable by keyboard; form errors never exposed to screen readers.                |
| **High**     | A serious barrier, or a Level A failure in a frequently used part of the app. A workaround exists but is hard.                                                                 | Form field without a label; icon-only button without an accessible name; focus not moved into a modal when it opens. |
| **Medium**   | Noticeably harder to use, but a reasonable workaround exists. Usually a Level AA failure, or a Level A failure in a rarely used area.                                          | Insufficient text contrast; layout breaks at 320 px; weak focus indicator; missing or generic page titles.           |
| **Low**      | Minor, isolated, or best-practice issues that don't strictly fail a criterion.                                                                                                 | Skipped heading levels; redundant ARIA; alt text present but unhelpful.                                              |

When an issue falls between two levels, choose the higher one if it affects a core flow, the lower one otherwise.

## Out of scope

- Fixing any issue (that's follow-up work using this audit).
- WCAG AAA criteria and WCAG 2.2 additions.
- Backend, emails, and generated documents (e.g. exported XLSX/DOCX files).
