import { NextIntlClientProvider } from "next-intl";

import enMessages from "../messages/en.json";
import plMessages from "../messages/pl.json";
import "../src/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";

const messagesByLocale = {
  en: enMessages,
  pl: plMessages,
} as const;

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Locale",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "pl", title: "Polski" },
        ],
        dynamicTitle: true,
      },
    },
  },
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
    locale: "en",
  },
  decorators: [
    (Story, context) => {
      const locale = (context.globals.locale as keyof typeof messagesByLocale) ?? "en";

      return (
        <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
