# Accessibility Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `docs/accessibility-audit.md`, a verified WCAG 2.1 A/AA audit of the LaunchDesk frontend with a four-column issues table and a priority-levels table.

**Architecture:** Each audit task writes verified findings to its own notes file in `docs/superpowers/audit-notes/`. Shared components are audited first (code review + axe on Storybook stories + keyboard checks), then pages (axe, keyboard, layout checks against the running app), then an app-wide WCAG criterion checklist. The last task merges and deduplicates all notes into the final document. Helper scripts live in `/tmp/launchdesk-a11y/` and are never committed.

**Tech Stack:** Next.js 16 (App Router), React 19, SCSS modules, next-intl (`en`, `pl`), Storybook 10 with `@storybook/addon-a11y`, Playwright 1.64 + `axe-core` (both already in `node_modules`), Cursor IDE browser tools for keyboard walkthroughs.

**Spec:** `docs/superpowers/specs/2026-11-17-accessibility-audit-design.md`

## Global Constraints

- Standard: [WCAG 2.1](https://www.w3.org/TR/WCAG21/), levels A and AA only. AAA and WCAG 2.2-only criteria are out of scope.
- Do not modify any application code, config or dependency. Only files under `docs/` are added to the repo.
- Every finding must be confirmed manually in code or in the browser. Drop automated results that turn out to be false positives.
- An issue rooted in a shared component is recorded once (in the component notes) and lists the pages it affects. Page tasks reference it instead of re-recording it.
- One finding may cite several WCAG criteria. Always cite as `number name (level)`, e.g. `1.4.3 Contrast (Minimum) (AA)`.
- Priorities: Critical, High, Medium, Low, as defined in the "Priority levels" section below. When between two levels: higher if on a core flow, lower otherwise.
- Core flows: logging in, registering, creating or editing tasks and assignments, uploading documents.
- No real screen-reader testing. Accessible names, roles and states are verified by inspecting the accessibility tree (`browser_snapshot`) and the markup.
- Audited application commit: `b28e8d9` (current `master`; `feat/accessibility` adds docs only).
- Branch: `feat/accessibility`. Commit messages use the repo style, e.g. `docs: Add accessibility audit notes for form controls`.

## Environment

- Frontend: `http://localhost:3000` (`npm run dev`), talks to backend via `API_URL=http://localhost:4000` from `.env.local`.
- Backend: already running at `http://localhost:4000`.
- Storybook: `http://localhost:6006` (`npm run storybook`). Story iframe URL: `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story`.
- Test account: email `john.doe@michalwarchol.com`, password `password123`.
- Roles: `user`, `admin`, `owner`. The `user` role can only open My Tasks (and its detail), Settings and Report (`src/lib/auth/routes.ts`).
- Locale is chosen by the `locale` cookie (`en` default, `pl`), see `src/i18n/request.ts`.

## Priority levels

| Priority     | Meaning                                                                                                                               | Typical examples                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Some users cannot complete a core task at all and there is no workaround.                                                             | Keyboard trap; a submit control unreachable by keyboard; form errors never exposed to screen readers.                |
| **High**     | A serious barrier, or a Level A failure in a frequently used part of the app. A workaround exists but is hard.                        | Form field without a label; icon-only button without an accessible name; focus not moved into a modal when it opens. |
| **Medium**   | Noticeably harder to use, but a reasonable workaround exists. Usually a Level AA failure, or a Level A failure in a rarely used area. | Insufficient text contrast; layout breaks at 320 px; weak focus indicator; missing or generic page titles.           |
| **Low**      | Minor, isolated, or best-practice issues that don't strictly fail a criterion.                                                        | Skipped heading levels; redundant ARIA; alt text present but unhelpful.                                              |

## Notes file format

Every audit task writes one file `docs/superpowers/audit-notes/NN-<area>.md` with exactly this structure:

```markdown
# <Area> — accessibility findings

## Findings

| ID      | Issue description                                                                                                                                                                                                                          | WCAG criterion                                                   | Recommended fix                                                                                                             | Priority | Evidence                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| FORM-01 | `TextField` renders the error text in a `<span>` not linked to the input, so screen readers don't announce it. Location: `src/components/TextField/TextField.tsx`. Affects: every form (login, register, task/assignment forms, settings). | 3.3.1 Error Identification (A); 1.3.1 Info and Relationships (A) | Give the error element an `id` and add `aria-describedby={errorId}` and `aria-invalid` to the input when there is an error. | High     | `TextField.tsx:42-55`; snapshot of Login with empty submit shows no description on the textbox. |

## Checked, no issue

- `<component or page>`: <what was checked and passed, one line>

## Not checked

- `<component, page or criterion>`: <why>
```

The example row shows the expected level of detail; it is not a known finding. The `Evidence` column (file:line, axe rule id, or the steps used) is for verification only and is dropped in the final document. Use `|` escaped as `\|` inside cells. ID prefixes per task: `FORM`, `OVL`, `NAV`, `DISP`, `PUB`, `APP1`, `APP2`, `GLOB`.

## Component checklist

Used by Tasks 2–5 for every component and its sub-files. For each item, read the `.tsx` and `.module.scss`, then confirm in Storybook where behaviour is involved.

1. **Semantics (1.3.1, 4.1.2):** native elements used where they exist (`button`, `a`, `input`, `table`, `ul`, `dialog`). Custom widgets have the correct `role` and states (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-controls`, `aria-activedescendant`), following the matching [ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/).
2. **Accessible name (1.1.1, 2.4.6, 2.5.3, 4.1.2):** every interactive element and meaningful icon/image has a name; decorative SVGs have `aria-hidden="true"`; the visible label text is contained in the accessible name.
3. **Labels and errors (1.3.1, 3.3.1, 3.3.2, 3.3.3):** inputs have an associated `<label>` (or `aria-labelledby`); hints and errors are linked with `aria-describedby`; `aria-invalid` is set; required state is exposed.
4. **Keyboard (2.1.1, 2.1.2, 2.4.3):** every action works with Tab/Shift+Tab, Enter/Space, arrows and Escape as the APG pattern expects; no traps; focus order matches visual order.
5. **Focus (2.4.7, 2.4.3, 3.2.1):** a visible focus indicator on every focusable element (search the SCSS for `outline: none` / `outline: 0` without a `:focus-visible` replacement); focus moves into and back out of popups/dialogs correctly; focusing something doesn't change context.
6. **Colour (1.4.1, 1.4.3, 1.4.11):** text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px or ≥ 18.66px bold), UI component boundaries and focus indicators ≥ 3:1, state not conveyed by colour alone. Resolve CSS variables from `src/app/globals.css` and compute ratios with the formula in [WCAG 2.1 relative luminance](https://www.w3.org/TR/WCAG21/#dfn-relative-luminance) (or the axe result).
7. **Dynamic content (4.1.3, 1.4.13):** status/loading/success/error messages that appear without focus change are in a live region (`role="status"`, `role="alert"` or `aria-live`); tooltips/popovers shown on hover or focus are dismissible with Escape, hoverable and persistent.
8. **Pointer (2.5.1, 2.5.2):** drag-only or multi-point interactions have a single-pointer alternative; actions fire on up-event (native `click`).
9. **Motion/timing (2.2.2, 2.3.1):** animations that run > 5s can be paused; nothing flashes.

---

### Task 1: Set up the audit environment

**Files:**

- Create: `/tmp/launchdesk-a11y/axe-scan.mjs`, `/tmp/launchdesk-a11y/login.mjs`, `/tmp/launchdesk-a11y/layout-check.mjs`, `/tmp/launchdesk-a11y/story-urls.mjs` (not committed)
- Create: `/tmp/launchdesk-a11y/urls-public.txt`, `/tmp/launchdesk-a11y/urls-app.txt`, `/tmp/launchdesk-a11y/urls-stories.txt` (not committed)
- Create: `docs/superpowers/audit-notes/00-environment.md`, `docs/superpowers/audit-notes/wcag-checklist.md`

**Interfaces:**

- Produces: the scripts below with these CLIs, used by Tasks 2–9:
  - `node /tmp/launchdesk-a11y/axe-scan.mjs <urls-file> <out-json> [storage-state-json]` writes an array of `{ url, title, violations: [{ id, impact, tags, help, nodes: [{ target, summary }] }], incomplete: [{ id, help, count }] }` and prints one summary line per URL.
  - `node /tmp/launchdesk-a11y/layout-check.mjs <urls-file> <out-dir> [storage-state-json]` writes `<out-dir>/report.json` (array of `{ url, reflowOverflowPx, spacingOverflowPx, clippedAfterSpacing }`) and screenshots `<out-dir>/<n>-320.png`, `<out-dir>/<n>-spacing.png`.
  - `/tmp/launchdesk-a11y/auth.json`: Playwright storage state of a logged-in session.
  - `docs/superpowers/audit-notes/00-environment.md`: the test account's role, the reachable and unreachable routes, and the concrete IDs used for dynamic routes.

- [ ] **Step 1: Start the servers**

Run each in its own background shell from the repo root:

```bash
npm run dev
```

```bash
npm run storybook -- --ci
```

Expected: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login` prints `200`, and `curl -s -o /dev/null -w "%{http_code}" http://localhost:6006/index.json` prints `200`.

- [ ] **Step 2: Install the Playwright Chromium browser**

Run: `npx playwright install chromium`
Expected: finishes with Chromium downloaded to `~/.cache/ms-playwright`. This changes nothing in the repo.

- [ ] **Step 3: Write the axe scan script**

`/tmp/launchdesk-a11y/axe-scan.mjs`:

```js
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";

const REPO = "/home/michal-warchol/projects/launchdesk-frontend";
const require = createRequire(`${REPO}/package.json`);
const { chromium } = require("playwright");
const AXE_PATH = require.resolve("axe-core/axe.min.js");

const [, , urlsFile, outFile, storageState] = process.argv;
const urls = (await readFile(urlsFile, "utf8"))
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  ...(storageState ? { storageState } : {}),
});
const page = await context.newPage();
const results = [];

for (const url of urls) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.addScriptTag({ path: AXE_PATH });
  const result = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }),
  );
  results.push({
    url,
    finalUrl: page.url(),
    title: await page.title(),
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      tags: v.tags.filter((t) => t.startsWith("wcag")),
      help: v.help,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
    incomplete: result.incomplete.map((v) => ({ id: v.id, help: v.help, count: v.nodes.length })),
  });
  console.log(
    `${url} -> ${page.url()}: ${result.violations.length} violations, ${result.incomplete.length} need review`,
  );
}

await writeFile(outFile, JSON.stringify(results, null, 2));
await browser.close();
```

- [ ] **Step 4: Write the login script and log in**

`/tmp/launchdesk-a11y/login.mjs`:

```js
import { createRequire } from "node:module";

const REPO = "/home/michal-warchol/projects/launchdesk-frontend";
const require = createRequire(`${REPO}/package.json`);
const { chromium } = require("playwright");

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
await page.fill('input[name="email"]', "john.doe@michalwarchol.com");
await page.fill('input[name="password"]', "password123");
await page.click('button[type="submit"]');
await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15000 });

console.log(`Logged in, landed on ${page.url()}`);
await context.storageState({ path: "/tmp/launchdesk-a11y/auth.json" });
await browser.close();
```

Run: `node /tmp/launchdesk-a11y/login.mjs`
Expected: `Logged in, landed on http://localhost:3000/...` and `/tmp/launchdesk-a11y/auth.json` exists. Landing on `/my-tasks` means the account has the `user` role; landing on `/dashboard` means `admin` or `owner`.

- [ ] **Step 5: Write the layout check script**

`/tmp/launchdesk-a11y/layout-check.mjs` checks 1.4.10 Reflow (320 CSS px wide) and 1.4.12 Text Spacing:

```js
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const REPO = "/home/michal-warchol/projects/launchdesk-frontend";
const require = createRequire(`${REPO}/package.json`);
const { chromium } = require("playwright");

const TEXT_SPACING_CSS = `* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p { margin-bottom: 2em !important; }`;

const [, , urlsFile, outDir, storageState] = process.argv;
const urls = (await readFile(urlsFile, "utf8"))
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 320, height: 800 },
  ...(storageState ? { storageState } : {}),
});
const page = await context.newPage();
const overflow = () =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const report = [];

for (const [index, url] of urls.entries()) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const reflowOverflowPx = await overflow();
  await page.screenshot({ path: `${outDir}/${index}-320.png`, fullPage: true });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addStyleTag({ content: TEXT_SPACING_CSS });
  await page.waitForTimeout(300);
  const spacingOverflowPx = await overflow();
  const clippedAfterSpacing = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => {
        const style = getComputedStyle(el);
        const clips =
          ["hidden", "clip"].includes(style.overflow) ||
          ["hidden", "clip"].includes(style.overflowY);
        return clips && el.textContent.trim() && el.scrollHeight > el.clientHeight + 1;
      })
      .slice(0, 20)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`),
  );
  await page.screenshot({ path: `${outDir}/${index}-spacing.png`, fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });

  report.push({ url, reflowOverflowPx, spacingOverflowPx, clippedAfterSpacing });
  console.log(
    `${index} ${url}: reflow overflow ${reflowOverflowPx}px, spacing overflow ${spacingOverflowPx}px, clipped ${clippedAfterSpacing.length}`,
  );
}

await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
```

Overflow > 0 at 320px is only a failure if it forces two-dimensional scrolling of content that isn't exempt (data tables, the rich text editor's toolbar, maps). Every candidate must be confirmed on the screenshot.

- [ ] **Step 6: Build the URL lists**

`/tmp/launchdesk-a11y/story-urls.mjs`:

```js
const index = await (await fetch("http://localhost:6006/index.json")).json();
const urls = Object.values(index.entries)
  .filter((entry) => entry.type === "story")
  .map(
    (entry) =>
      `# ${entry.title} / ${entry.name}\nhttp://localhost:6006/iframe.html?id=${entry.id}&viewMode=story`,
  );
console.log(urls.join("\n"));
```

Run: `node /tmp/launchdesk-a11y/story-urls.mjs > /tmp/launchdesk-a11y/urls-stories.txt`
Expected: one `# Title / Story` comment line and one URL per story, for all 23 story files.

Create `/tmp/launchdesk-a11y/urls-public.txt`:

```text
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/forgot-password
http://localhost:3000/reset-password
http://localhost:3000/invite/accept
```

Open each list page in the Cursor IDE browser while logged in (log in through the UI once), click the first item and copy its URL to get one real ID per entity. Create `/tmp/launchdesk-a11y/urls-app.txt` with the reachable routes, replacing `<id>` with those IDs:

```text
http://localhost:3000/dashboard
http://localhost:3000/my-tasks
http://localhost:3000/my-tasks/<id>
http://localhost:3000/tasks
http://localhost:3000/tasks/new
http://localhost:3000/tasks/<id>
http://localhost:3000/tasks/<id>/edit
http://localhost:3000/assignments
http://localhost:3000/assignments/new
http://localhost:3000/assignments/<id>
http://localhost:3000/assignments/<id>/edit
http://localhost:3000/documents
http://localhost:3000/documents/<id>
http://localhost:3000/users
http://localhost:3000/users/<id>
http://localhost:3000/users/<id>/edit
http://localhost:3000/report
http://localhost:3000/settings
```

Drop routes the role can't open, and routes with no data to pick an ID from. `/reset-password` and `/invite/accept` may need a token in the URL; check the page source (`src/app/(auth)/reset-password/page.tsx`, `src/app/(auth)/invite/accept/page.tsx`) and record what renders without one.

- [ ] **Step 7: Smoke-test the scripts**

Run: `node /tmp/launchdesk-a11y/axe-scan.mjs /tmp/launchdesk-a11y/urls-public.txt /tmp/launchdesk-a11y/axe-public.json`
Expected: six summary lines, the JSON file written.

Run: `node /tmp/launchdesk-a11y/axe-scan.mjs /tmp/launchdesk-a11y/urls-app.txt /tmp/launchdesk-a11y/axe-app.json /tmp/launchdesk-a11y/auth.json`
Expected: one summary line per URL, and `finalUrl` equals `url` for each (no redirect to `/login`). If a URL redirects, the session or role is wrong: fix it before continuing.

Run: `node /tmp/launchdesk-a11y/axe-scan.mjs /tmp/launchdesk-a11y/urls-stories.txt /tmp/launchdesk-a11y/axe-stories.json`
Expected: one summary line per story.

- [ ] **Step 8: Write the environment notes and the WCAG checklist**

`docs/superpowers/audit-notes/00-environment.md`:

```markdown
# Audit environment

- Audited application commit: `b28e8d9`
- Test account: `john.doe@michalwarchol.com`, role: `<role found in Step 4>`
- Browsers/tools: Chromium (Playwright 1.64), axe-core `<version from node_modules/axe-core/package.json>`, Storybook a11y addon, Cursor IDE browser
- Reachable routes: <list from urls-app.txt>
- Unreachable routes and why: <role restriction / no data / token required>
- IDs used for dynamic routes: <entity: id>
```

`docs/superpowers/audit-notes/wcag-checklist.md` lists every WCAG 2.1 A/AA criterion. Task 9 fills the `Result` column; tasks 2–8 may add finding IDs in `Findings` as they go.

```markdown
# WCAG 2.1 A/AA checklist

Result: Fail / Pass / N/A. Findings: IDs from the notes files.

| Criterion                                                                                                                                      | Level | Result | Findings | Note |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------ | -------- | ---- |
| [1.1.1 Non-text Content](https://www.w3.org/TR/WCAG21/#non-text-content)                                                                       | A     |        |          |      |
| [1.2.1 Audio-only and Video-only (Prerecorded)](https://www.w3.org/TR/WCAG21/#audio-only-and-video-only-prerecorded)                           | A     |        |          |      |
| [1.2.2 Captions (Prerecorded)](https://www.w3.org/TR/WCAG21/#captions-prerecorded)                                                             | A     |        |          |      |
| [1.2.3 Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/TR/WCAG21/#audio-description-or-media-alternative-prerecorded) | A     |        |          |      |
| [1.2.4 Captions (Live)](https://www.w3.org/TR/WCAG21/#captions-live)                                                                           | AA    |        |          |      |
| [1.2.5 Audio Description (Prerecorded)](https://www.w3.org/TR/WCAG21/#audio-description-prerecorded)                                           | AA    |        |          |      |
| [1.3.1 Info and Relationships](https://www.w3.org/TR/WCAG21/#info-and-relationships)                                                           | A     |        |          |      |
| [1.3.2 Meaningful Sequence](https://www.w3.org/TR/WCAG21/#meaningful-sequence)                                                                 | A     |        |          |      |
| [1.3.3 Sensory Characteristics](https://www.w3.org/TR/WCAG21/#sensory-characteristics)                                                         | A     |        |          |      |
| [1.3.4 Orientation](https://www.w3.org/TR/WCAG21/#orientation)                                                                                 | AA    |        |          |      |
| [1.3.5 Identify Input Purpose](https://www.w3.org/TR/WCAG21/#identify-input-purpose)                                                           | AA    |        |          |      |
| [1.4.1 Use of Color](https://www.w3.org/TR/WCAG21/#use-of-color)                                                                               | A     |        |          |      |
| [1.4.2 Audio Control](https://www.w3.org/TR/WCAG21/#audio-control)                                                                             | A     |        |          |      |
| [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum)                                                                     | AA    |        |          |      |
| [1.4.4 Resize Text](https://www.w3.org/TR/WCAG21/#resize-text)                                                                                 | AA    |        |          |      |
| [1.4.5 Images of Text](https://www.w3.org/TR/WCAG21/#images-of-text)                                                                           | AA    |        |          |      |
| [1.4.10 Reflow](https://www.w3.org/TR/WCAG21/#reflow)                                                                                          | AA    |        |          |      |
| [1.4.11 Non-text Contrast](https://www.w3.org/TR/WCAG21/#non-text-contrast)                                                                    | AA    |        |          |      |
| [1.4.12 Text Spacing](https://www.w3.org/TR/WCAG21/#text-spacing)                                                                              | AA    |        |          |      |
| [1.4.13 Content on Hover or Focus](https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus)                                                    | AA    |        |          |      |
| [2.1.1 Keyboard](https://www.w3.org/TR/WCAG21/#keyboard)                                                                                       | A     |        |          |      |
| [2.1.2 No Keyboard Trap](https://www.w3.org/TR/WCAG21/#no-keyboard-trap)                                                                       | A     |        |          |      |
| [2.1.4 Character Key Shortcuts](https://www.w3.org/TR/WCAG21/#character-key-shortcuts)                                                         | A     |        |          |      |
| [2.2.1 Timing Adjustable](https://www.w3.org/TR/WCAG21/#timing-adjustable)                                                                     | A     |        |          |      |
| [2.2.2 Pause, Stop, Hide](https://www.w3.org/TR/WCAG21/#pause-stop-hide)                                                                       | A     |        |          |      |
| [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold)                                       | A     |        |          |      |
| [2.4.1 Bypass Blocks](https://www.w3.org/TR/WCAG21/#bypass-blocks)                                                                             | A     |        |          |      |
| [2.4.2 Page Titled](https://www.w3.org/TR/WCAG21/#page-titled)                                                                                 | A     |        |          |      |
| [2.4.3 Focus Order](https://www.w3.org/TR/WCAG21/#focus-order)                                                                                 | A     |        |          |      |
| [2.4.4 Link Purpose (In Context)](https://www.w3.org/TR/WCAG21/#link-purpose-in-context)                                                       | A     |        |          |      |
| [2.4.5 Multiple Ways](https://www.w3.org/TR/WCAG21/#multiple-ways)                                                                             | AA    |        |          |      |
| [2.4.6 Headings and Labels](https://www.w3.org/TR/WCAG21/#headings-and-labels)                                                                 | AA    |        |          |      |
| [2.4.7 Focus Visible](https://www.w3.org/TR/WCAG21/#focus-visible)                                                                             | AA    |        |          |      |
| [2.5.1 Pointer Gestures](https://www.w3.org/TR/WCAG21/#pointer-gestures)                                                                       | A     |        |          |      |
| [2.5.2 Pointer Cancellation](https://www.w3.org/TR/WCAG21/#pointer-cancellation)                                                               | A     |        |          |      |
| [2.5.3 Label in Name](https://www.w3.org/TR/WCAG21/#label-in-name)                                                                             | A     |        |          |      |
| [2.5.4 Motion Actuation](https://www.w3.org/TR/WCAG21/#motion-actuation)                                                                       | A     |        |          |      |
| [3.1.1 Language of Page](https://www.w3.org/TR/WCAG21/#language-of-page)                                                                       | A     |        |          |      |
| [3.1.2 Language of Parts](https://www.w3.org/TR/WCAG21/#language-of-parts)                                                                     | AA    |        |          |      |
| [3.2.1 On Focus](https://www.w3.org/TR/WCAG21/#on-focus)                                                                                       | A     |        |          |      |
| [3.2.2 On Input](https://www.w3.org/TR/WCAG21/#on-input)                                                                                       | A     |        |          |      |
| [3.2.3 Consistent Navigation](https://www.w3.org/TR/WCAG21/#consistent-navigation)                                                             | AA    |        |          |      |
| [3.2.4 Consistent Identification](https://www.w3.org/TR/WCAG21/#consistent-identification)                                                     | AA    |        |          |      |
| [3.3.1 Error Identification](https://www.w3.org/TR/WCAG21/#error-identification)                                                               | A     |        |          |      |
| [3.3.2 Labels or Instructions](https://www.w3.org/TR/WCAG21/#labels-or-instructions)                                                           | A     |        |          |      |
| [3.3.3 Error Suggestion](https://www.w3.org/TR/WCAG21/#error-suggestion)                                                                       | AA    |        |          |      |
| [3.3.4 Error Prevention (Legal, Financial, Data)](https://www.w3.org/TR/WCAG21/#error-prevention-legal-financial-data)                         | AA    |        |          |      |
| [4.1.1 Parsing](https://www.w3.org/TR/WCAG21/#parsing)                                                                                         | A     |        |          |      |
| [4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG21/#name-role-value)                                                                       | A     |        |          |      |
| [4.1.3 Status Messages](https://www.w3.org/TR/WCAG21/#status-messages)                                                                         | AA    |        |          |      |
```

Fill the placeholders in `00-environment.md` with the real values found in Steps 4, 6 and 7 before committing.

- [ ] **Step 9: Commit**

```bash
git add docs/superpowers/audit-notes/00-environment.md docs/superpowers/audit-notes/wcag-checklist.md
git commit -m "docs: Add accessibility audit environment notes and WCAG checklist"
```

---

### Task 2: Audit form-control components

**Files:**

- Read: `src/components/TextField/*`, `src/components/Checkbox/*`, `src/components/Select/*`, `src/components/Autocomplete/*`, `src/components/DatePicker/*` (including `calendar.ts`), `src/app/globals.css`
- Create: `docs/superpowers/audit-notes/02-form-controls.md` (ID prefix `FORM`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-stories.json` and `urls-stories.txt` from Task 1.
- Produces: `FORM-NN` findings that Tasks 6–8 reference instead of re-recording.

- [ ] **Step 1: Review the code** of each component against items 1–9 of the Component checklist. Expected APG patterns: Select → [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) or [Select-only combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) (or native `<select>`); Autocomplete → [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/); DatePicker → [Date picker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/); Checkbox → native `<input type="checkbox">` or [Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/). Also check whether `TextField` passes `autoComplete` through (1.3.5) and how `required` is exposed.

- [ ] **Step 2: Check axe results** for these components' stories: `jq '.[] | select(.url | test("textfield|checkbox|select|autocomplete|datepicker"; "i")) | {url, violations: [.violations[] | {id, help, n: (.nodes | length)}]}' /tmp/launchdesk-a11y/axe-stories.json`. Confirm each violation in the code; drop false positives.

- [ ] **Step 3: Keyboard and accessibility-tree check.** For each component's main story (and the error/disabled stories if present), open the story iframe URL in the Cursor IDE browser. Use `browser_press_key` (Tab, Shift+Tab, Enter, Space, ArrowDown, ArrowUp, Escape) to operate it, `browser_take_screenshot` to confirm a visible focus indicator, and `browser_snapshot` to read the role, name and states. Open popups and confirm where focus goes and whether Escape closes them and returns focus to the trigger.

- [ ] **Step 4: Write the notes file** in the Notes file format. Every finding has evidence; priority follows the Priority levels table. These components are used on core flows (login, registration, task and assignment forms), so blocking issues here are Critical or High. Find the pages affected with `rg -l "<ComponentName>" src/app`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/audit-notes/02-form-controls.md
git commit -m "docs: Add accessibility audit notes for form controls"
```

---

### Task 3: Audit overlay and rich-content components

**Files:**

- Read: `src/components/Modal/*`, `src/components/RichTextEditor/*` (`RichTextEditor.tsx`, `Toolbar.tsx`, `LinkModal.tsx`), `src/components/AttachmentsField/*` (`AttachmentsField.tsx`, `AttachmentPickerModal.tsx`, `FileTypeIcon.tsx`), `src/components/Dropzone/*`, `src/app/globals.css`
- Create: `docs/superpowers/audit-notes/03-overlays-rich-content.md` (ID prefix `OVL`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-stories.json` and `urls-stories.txt` from Task 1.
- Produces: `OVL-NN` findings that Tasks 6–8 reference.

- [ ] **Step 1: Review the code** against items 1–9 of the Component checklist. Expected patterns: Modal → [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): `role="dialog"` or native `<dialog>`, `aria-modal`, `aria-labelledby`, focus moved in on open, focus contained, Escape closes, focus returned to the trigger, background inert. RichTextEditor toolbar → [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) with named buttons and `aria-pressed` for toggles; the editable area has a name (TipTap `editorProps.attributes` with `aria-label`/`aria-labelledby`) and `aria-multiline`. Dropzone → the file input is reachable and operable by keyboard, not drag-only (2.5.1, 2.1.1); upload progress and errors are announced (4.1.3).

- [ ] **Step 2: Check axe results:** `jq '.[] | select(.url | test("modal|richtext|attachment|dropzone"; "i")) | {url, violations: [.violations[] | {id, help, n: (.nodes | length)}]}' /tmp/launchdesk-a11y/axe-stories.json`. Confirm or drop each.

- [ ] **Step 3: Keyboard and accessibility-tree check** in the Cursor IDE browser on each story: open the modal with the keyboard, Tab through it to check focus stays inside, press Escape, check focus returns. In the editor, use the toolbar with the keyboard and check whether Tab leaves the editor (no trap, 2.1.2). Select a file in Dropzone and AttachmentsField with only the keyboard.

- [ ] **Step 4: Write the notes file** in the Notes file format. Find affected pages with `rg -l "Modal|RichTextEditor|AttachmentsField|Dropzone" src/app`. Uploading documents and editing tasks are core flows.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/audit-notes/03-overlays-rich-content.md
git commit -m "docs: Add accessibility audit notes for overlays and rich content"
```

---

### Task 4: Audit navigation, layout, table and button components

**Files:**

- Read: `src/components/Sidebar/*`, `src/components/Topbar/*`, `src/components/PageHeader/*`, `src/components/Accordion/*`, `src/components/Table/*` (`Table.tsx`, `TableHead.tsx`, `TableBody.tsx`, `TableRow.tsx`, `TableFilters.tsx`, `Pagination.tsx`), `src/components/Button/*`, `src/components/OAuthButtons/*` (incl. `ProviderIcon.tsx`), `src/app/globals.css`
- Create: `docs/superpowers/audit-notes/04-navigation-layout.md` (ID prefix `NAV`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-stories.json` and `urls-stories.txt` from Task 1.
- Produces: `NAV-NN` findings that Tasks 6–8 reference.

- [ ] **Step 1: Review the code** against items 1–9 of the Component checklist. Specifically: Sidebar/Topbar use `<nav>` with an accessible name and mark the current page with `aria-current="page"`; menus or a mobile toggle follow the [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) or [Menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) pattern; Accordion follows the [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) pattern; Table uses real `<table>`/`<th scope>`, sortable headers are buttons with `aria-sort`, clickable rows are reachable by keyboard and have a link or button inside, Pagination is a named `<nav>` with named prev/next buttons and `aria-current` on the current page; Button exposes `disabled`/loading state and its loading spinner has a text alternative; OAuth buttons have names that include the provider and icons are `aria-hidden`.

- [ ] **Step 2: Check axe results:** `jq '.[] | select(.url | test("sidebar|topbar|pageheader|accordion|table|button|oauth"; "i")) | {url, violations: [.violations[] | {id, help, n: (.nodes | length)}]}' /tmp/launchdesk-a11y/axe-stories.json`. Confirm or drop each.

- [ ] **Step 3: Keyboard and accessibility-tree check** in the Cursor IDE browser on each story: Tab order in Sidebar and Topbar, opening/closing any menus with Enter/Escape, sorting and paging the Table with the keyboard, operating Accordion headers with Enter/Space.

- [ ] **Step 4: Write the notes file** in the Notes file format. Sidebar, Topbar, Table and Button appear on almost every logged-in page; find affected pages with `rg -l "<ComponentName>" src/app`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/audit-notes/04-navigation-layout.md
git commit -m "docs: Add accessibility audit notes for navigation and layout components"
```

---

### Task 5: Audit display components

**Files:**

- Read: `src/components/Alert/*`, `src/components/AssignmentCard/*`, `src/components/Avatar/*`, `src/components/AvatarGroup/*`, `src/components/Card/*`, `src/components/ProgressBar/*`, `src/components/StatCard/*`, `src/app/globals.css`
- Create: `docs/superpowers/audit-notes/05-display.md` (ID prefix `DISP`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-stories.json` and `urls-stories.txt` from Task 1.
- Produces: `DISP-NN` findings that Tasks 6–8 reference.

- [ ] **Step 1: Review the code** against items 1–9 of the Component checklist. Specifically: Alert uses `role="alert"` (errors) or `role="status"` (info/success) when it appears dynamically, and its type isn't conveyed by colour/icon alone; Avatar images have `alt` with the person's name (or are decorative when the name is next to them), initials fallbacks are exposed sensibly; AvatarGroup's "+N" overflow has a meaningful name; ProgressBar uses `role="progressbar"` (or `<progress>`) with `aria-valuenow`/`min`/`max` and a name; StatCard values and trend indicators aren't colour-only; AssignmentCard and Card: if the whole card is clickable, there is one real link/button with a clear name, no nested interactive elements.

- [ ] **Step 2: Check axe results:** `jq '.[] | select(.url | test("alert|assignmentcard|avatar|card|progressbar|statcard"; "i")) | {url, violations: [.violations[] | {id, help, n: (.nodes | length)}]}' /tmp/launchdesk-a11y/axe-stories.json`. Confirm or drop each.

- [ ] **Step 3: Keyboard and accessibility-tree check** in the Cursor IDE browser on each story: Tab to any interactive card, confirm focus is visible and Enter activates it; read names and roles with `browser_snapshot`.

- [ ] **Step 4: Write the notes file** in the Notes file format. Find affected pages with `rg -l "<ComponentName>" src/app`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/audit-notes/05-display.md
git commit -m "docs: Add accessibility audit notes for display components"
```

---

### Task 6: Audit public pages

**Files:**

- Read: `src/app/page.tsx`, `src/app/page.module.scss`, `src/app/_landing/*`, `src/app/(auth)/layout.tsx`, `src/app/(auth)/layout.module.scss`, `src/app/(auth)/*/**` (login, register, forgot-password, reset-password, invite/accept)
- Create: `docs/superpowers/audit-notes/06-public-pages.md` (ID prefix `PUB`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-public.json`, `urls-public.txt`, `layout-check.mjs` from Task 1; notes from Tasks 2–5 (to reference, not duplicate, component findings).
- Produces: `PUB-NN` findings.

- [ ] **Step 1: Read the component notes** (`02`–`05`) so known component issues are referenced by ID, not re-recorded.

- [ ] **Step 2: Review axe results:** `jq '.[] | {url, finalUrl, title, violations: [.violations[] | {id, help, n: (.nodes | length), targets: [.nodes[].target]}]}' /tmp/launchdesk-a11y/axe-public.json`. Map each violation to a component finding or a page-level issue; confirm in code or browser.

- [ ] **Step 3: Run the layout check:** `node /tmp/launchdesk-a11y/layout-check.mjs /tmp/launchdesk-a11y/urls-public.txt /tmp/launchdesk-a11y/layout-public`. Open every screenshot whose report entry has non-zero overflow or clipped elements, and confirm whether content is lost or needs horizontal scrolling (1.4.10, 1.4.12). Also open each page in the Cursor IDE browser, use `browser_cdp` `Emulation.setDeviceMetricsOverride` with `{ "width": 640, "height": 400, "deviceScaleFactor": 2, "mobile": false }` to simulate 200% zoom at 1280×800 (1.4.4), take a screenshot, then send `Emulation.clearDeviceMetricsOverride`.

- [ ] **Step 4: Page-level checks** in the Cursor IDE browser for each page (logged out):
  - `document.title` is unique and descriptive (2.4.2); `<html lang>` matches the content language (3.1.1); switch the `locale` cookie to `pl` and confirm `lang="pl"` and translated titles.
  - one `h1`, logical heading levels, landmarks (`header`, `nav`, `main`, `footer`) present (1.3.1, 2.4.6, 2.4.1); a skip link or landmarks to bypass repeated navigation on the landing page (2.4.1).
  - landing page images and the logo have appropriate `alt` (1.1.1); link texts make sense in context (2.4.4); any carousel/animation can be paused (2.2.2); the cookie/analytics banner (if shown) is keyboard operable and doesn't trap focus.
  - forms: submit empty, submit invalid email, submit wrong password. Check errors are shown in text, linked to the fields, announced (`role="alert"` / live region or focus moved to the first error), and suggest a fix (3.3.1, 3.3.3, 4.1.3). Check `autocomplete` values (`email`, `current-password`, `new-password`, `name`) on login/register/reset (1.3.5). Check the password visibility toggle (if any) is a named button.
  - the whole login and registration flow is possible with the keyboard only, including OAuth buttons (2.1.1).

- [ ] **Step 5: Write the notes file** in the Notes file format. Login and registration are core flows.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/audit-notes/06-public-pages.md
git commit -m "docs: Add accessibility audit notes for public pages"
```

---

### Task 7: Audit logged-in pages — dashboard, my tasks, tasks, assignments

**Files:**

- Read: `src/app/(authorized)/layout.tsx` (and its styles), `src/app/(authorized)/dashboard/**`, `src/app/(authorized)/my-tasks/**`, `src/app/(authorized)/tasks/**`, `src/app/(authorized)/assignments/**`
- Create: `docs/superpowers/audit-notes/07-app-tasks.md` (ID prefix `APP1`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-app.json`, `urls-app.txt`, `auth.json`, `layout-check.mjs` from Task 1; notes from Tasks 2–5.
- Produces: `APP1-NN` findings.

- [ ] **Step 1: Read the component notes** (`02`–`05`).

- [ ] **Step 2: Review axe results** for these routes: `jq '.[] | select(.url | test("/(dashboard|my-tasks|tasks|assignments)")) | {url, finalUrl, title, violations: [.violations[] | {id, help, n: (.nodes | length), targets: [.nodes[].target]}]}' /tmp/launchdesk-a11y/axe-app.json`. Map to component findings or page issues; confirm each.

- [ ] **Step 3: Run the layout check** on these routes: `rg "/(dashboard|my-tasks|tasks|assignments)" /tmp/launchdesk-a11y/urls-app.txt > /tmp/launchdesk-a11y/urls-app1.txt && node /tmp/launchdesk-a11y/layout-check.mjs /tmp/launchdesk-a11y/urls-app1.txt /tmp/launchdesk-a11y/layout-app1 /tmp/launchdesk-a11y/auth.json`. Confirm candidates on screenshots; data tables may scroll horizontally inside their container without failing 1.4.10. Do the 200% zoom check from Task 6 Step 3 on the list and form pages.

- [ ] **Step 4: Page-level checks** in the Cursor IDE browser (logged in through the UI):
  - title, `lang`, headings, landmarks and a way to skip the sidebar (2.4.2, 3.1.1, 1.3.1, 2.4.1).
  - dashboard charts (Recharts): a text alternative or data table for each chart, colour not the only way to tell series apart (1.1.1, 1.4.1, 1.4.11).
  - my-tasks search (`src/app/(authorized)/my-tasks/page.tsx`): the field has a label; the number of results or "no results" is announced after the debounced search (4.1.3); typing doesn't move focus (3.2.2).
  - list pages: filters, sorting and pagination work with the keyboard, and the result change is announced (4.1.3).
  - create and edit flows for a task and an assignment, with the keyboard only: fill every field (Select, Autocomplete, DatePicker, RichTextEditor, attachments), submit with errors, then submit successfully. Check error handling (3.3.1, 3.3.3), success/toast messages (4.1.3), where focus goes after save and after delete confirmation (2.4.3), and that destructive actions ask for confirmation (3.3.4). Cancel rather than save if the data would be hard to clean up; if you do create test data, record it in the notes so it can be deleted.
  - detail pages: completing or changing task status by keyboard; state not conveyed by colour only (1.4.1).

- [ ] **Step 5: Write the notes file** in the Notes file format. Creating and editing tasks and assignments are core flows.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/audit-notes/07-app-tasks.md
git commit -m "docs: Add accessibility audit notes for task and assignment pages"
```

---

### Task 8: Audit logged-in pages — documents, users, report, settings

**Files:**

- Read: `src/app/(authorized)/documents/**`, `src/app/(authorized)/users/**`, `src/app/(authorized)/report/**`, `src/app/(authorized)/settings/**`
- Create: `docs/superpowers/audit-notes/08-app-admin.md` (ID prefix `APP2`)

**Interfaces:**

- Consumes: `/tmp/launchdesk-a11y/axe-app.json`, `urls-app.txt`, `auth.json`, `layout-check.mjs` from Task 1; notes from Tasks 2–5.
- Produces: `APP2-NN` findings.

- [ ] **Step 1: Read the component notes** (`02`–`05`).

- [ ] **Step 2: Review axe results:** `jq '.[] | select(.url | test("/(documents|users|report|settings)")) | {url, finalUrl, title, violations: [.violations[] | {id, help, n: (.nodes | length), targets: [.nodes[].target]}]}' /tmp/launchdesk-a11y/axe-app.json`. Confirm each.

- [ ] **Step 3: Run the layout check:** `rg "/(documents|users|report|settings)" /tmp/launchdesk-a11y/urls-app.txt > /tmp/launchdesk-a11y/urls-app2.txt && node /tmp/launchdesk-a11y/layout-check.mjs /tmp/launchdesk-a11y/urls-app2.txt /tmp/launchdesk-a11y/layout-app2 /tmp/launchdesk-a11y/auth.json`. Confirm candidates on screenshots. Do the 200% zoom check from Task 6 Step 3.

- [ ] **Step 4: Page-level checks** in the Cursor IDE browser:
  - title, `lang`, headings, landmarks (2.4.2, 3.1.1, 1.3.1).
  - documents: uploading a document with the keyboard only (core flow); the document preview (`docx-preview`, `xlsx` rendering in `src/app/(authorized)/documents/[id]`) exposes readable structure (tables with headers, headings) and the preview container is keyboard-scrollable (2.1.1); download links have clear names (2.4.4).
  - users: invite and edit-user forms (labels, errors, role select), confirmation before removing a user (3.3.4).
  - report: form labels, error and success messages (3.3.1, 4.1.3).
  - settings: language switch updates `<html lang>` (3.1.1) and is announced or reloads predictably (3.2.2); password/profile forms use correct `autocomplete` (1.3.5).

- [ ] **Step 5: Write the notes file** in the Notes file format. Uploading documents is a core flow.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/audit-notes/08-app-admin.md
git commit -m "docs: Add accessibility audit notes for documents, users, report and settings pages"
```

---

### Task 9: App-wide checks and WCAG checklist pass

**Files:**

- Read: `src/app/layout.tsx`, `src/app/globals.css`, `src/i18n/*`, `messages/en.json`, `messages/pl.json`, every `page.tsx` / `layout.tsx` exporting `metadata` or `generateMetadata`
- Create: `docs/superpowers/audit-notes/09-global.md` (ID prefix `GLOB`)
- Modify: `docs/superpowers/audit-notes/wcag-checklist.md`

**Interfaces:**

- Consumes: all notes from Tasks 2–8.
- Produces: a fully filled `wcag-checklist.md` (every row Fail/Pass/N/A) and `GLOB-NN` findings.

- [ ] **Step 1: Page titles (2.4.2):** `rg -n "export (const metadata|async function generateMetadata)" src/app`. List routes without their own title (they fall back to the bare site name), and check detail pages include the item name.

- [ ] **Step 2: Language (3.1.1, 3.1.2):** confirm `<html lang={locale}>` in `src/app/layout.tsx` updates on locale switch without a stale server-rendered value; check for content in the other language without a `lang` attribute (e.g. a language switcher showing "Polski" inside an English page).

- [ ] **Step 3: Translations as accessible names:** compare keys in both message files: `jq -r 'paths(scalars) | join(".")' messages/en.json | sort > /tmp/launchdesk-a11y/en-keys.txt && jq -r 'paths(scalars) | join(".")' messages/pl.json | sort > /tmp/launchdesk-a11y/pl-keys.txt && diff /tmp/launchdesk-a11y/en-keys.txt /tmp/launchdesk-a11y/pl-keys.txt`. Missing keys used for labels, `aria-label` or `alt` are findings. Also search for hard-coded English accessible names: `rg -n 'aria-label="[A-Za-z]|alt="[A-Za-z]|title="[A-Za-z]' src`.

- [ ] **Step 4: Global styles:** search for removed focus outlines and fixed sizes that break text resize: `rg -n "outline:\s*(none|0)" src`, `rg -n "user-scalable|maximum-scale" src`, `rg -n "font-size:\s*\d+px" src --count`, and check `prefers-reduced-motion` handling for animations: `rg -n "animation|transition|prefers-reduced-motion" src --count`. Only report items that fail an A/AA criterion; missing `prefers-reduced-motion` is Low (best practice, not an A/AA failure).

- [ ] **Step 5: Consistency (3.2.3, 3.2.4) and multiple ways (2.4.5):** compare navigation order and naming across logged-in pages; check whether pages can be reached in more than one way (sidebar plus search, links, or breadcrumbs).

- [ ] **Step 6: Session timeout (2.2.1):** check `src/lib/auth/*` and `src/app/api/auth/*` for session expiry; if a session can expire while a user is filling a form with data loss and no warning, that's a finding.

- [ ] **Step 7: Fill the checklist.** For each of the 50 rows in `wcag-checklist.md`, set `Result` to Fail (list every finding ID from notes `02`–`09` that cites it), Pass (with a one-line reason), or N/A (e.g. 1.2.x when there is no audio or video — confirm with `rg -n "<video|<audio|iframe" src`). For 4.1.1 Parsing, mark Pass and note that the WCAG 2.1 errata treats it as always satisfied for HTML. Any criterion that was not actually verified goes to `Not checked` in `09-global.md` instead of Pass.

- [ ] **Step 8: Write the notes file** in the Notes file format.

- [ ] **Step 9: Commit**

```bash
git add docs/superpowers/audit-notes/09-global.md docs/superpowers/audit-notes/wcag-checklist.md
git commit -m "docs: Add app-wide accessibility audit notes and complete WCAG checklist"
```

---

### Task 10: Assemble the audit document

**Files:**

- Create: `docs/accessibility-audit.md`
- Read: all files in `docs/superpowers/audit-notes/`

**Interfaces:**

- Consumes: notes `00`, `02`–`09` and `wcag-checklist.md`.
- Produces: the deliverable.

- [ ] **Step 1: Merge and deduplicate.** Collect every finding row. Merge rows that describe the same root cause (keep the component-level one, combine the affected-page lists and criteria). Re-check each priority against the Priority levels table.

- [ ] **Step 2: Write `docs/accessibility-audit.md`** with exactly this structure:

```markdown
# LaunchDesk Frontend — Accessibility Audit

## Summary

- **Date:** <YYYY-MM-DD of completion>
- **Audited commit:** `b28e8d9`
- **Standard:** [WCAG 2.1](https://www.w3.org/TR/WCAG21/), conformance levels A and AA
- **Scope:** the whole application — shared components (`src/components`), the landing page, the authentication pages and all logged-in pages reachable with a `<role>` account
- **Method:** code review of every component and page; automated checks with axe-core <version> on every Storybook story and every page; keyboard-only walkthroughs; reflow at 320 px, 200% zoom and text-spacing checks; accessibility-tree inspection in Chromium
- **Not included:** testing with real screen readers (NVDA, JAWS, VoiceOver), WCAG AAA and WCAG 2.2 criteria, backend, emails and exported files

| Priority  | Issues  |
| --------- | ------- |
| Critical  | <n>     |
| High      | <n>     |
| Medium    | <n>     |
| Low       | <n>     |
| **Total** | **<n>** |

<2–4 sentences on the most important themes, e.g. "Most critical issues come from the shared Modal and Select components, which are used on every form.">

## Priority levels

<the Priority levels table from this plan, columns Priority | Meaning | Typical examples>

## Issues

| Issue description                                              | WCAG criterion violated                                        | Recommended fix | Priority                      |
| -------------------------------------------------------------- | -------------------------------------------------------------- | --------------- | ----------------------------- |
| <what is wrong>. **Location:** `<file>`. **Affects:** <pages>. | [<n.n.n Name (Level)>](https://www.w3.org/TR/WCAG21/#<anchor>) | <concrete fix>  | <Critical\|High\|Medium\|Low> |

## Not checked

- <page, state or criterion>: <reason>
```

Rules: exactly four columns in the Issues table, no ID or Evidence columns. Rows sorted Critical → High → Medium → Low, then by the lowest WCAG criterion number in the row. Every criterion is a link using the anchor from `wcag-checklist.md`. Fill every `<...>` with real values; the Summary counts must equal the row counts.

- [ ] **Step 3: Verify the document.**
  - Row counts match the summary: `rg -c "\| (Critical|High|Medium|Low) \|$" docs/accessibility-audit.md` and per priority, e.g. `rg -c "\| Critical \|$" docs/accessibility-audit.md`.
  - Every WCAG link anchor is valid: `rg -o "WCAG21/#[a-z0-9-]+" docs/accessibility-audit.md | sort -u` — each anchor must appear in `docs/superpowers/audit-notes/wcag-checklist.md`.
  - No placeholders remain: `rg -n "<[a-z]|TBD|TODO" docs/accessibility-audit.md` returns nothing.
  - Every Fail row in `wcag-checklist.md` has at least one issue in the document, and every issue maps back to a notes finding.
  - Formatting: `npx prettier --check docs/accessibility-audit.md` (run `npx prettier --write` on it if needed).

- [ ] **Step 4: Commit and push**

```bash
git add docs/accessibility-audit.md
git commit -m "docs: Add accessibility audit"
git push
```

- [ ] **Step 5: Clean up.** Stop the dev server and Storybook. Delete any test data created in Task 7 or 8 (listed in those notes). `/tmp/launchdesk-a11y/` can be removed.
