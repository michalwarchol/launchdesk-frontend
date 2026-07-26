import { NextIntlClientProvider } from "next-intl";

import enMessages from "../messages/en.json";
import "../src/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    backgrounds: {
      options: {
        default: { name: "Default", value: "#121419" },
        light: { name: "Light", value: "#fff" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "default" },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
