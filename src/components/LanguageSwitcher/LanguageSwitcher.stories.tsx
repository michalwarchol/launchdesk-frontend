import { NextIntlClientProvider } from "next-intl";


import plMessages from "../../../messages/pl.json";

import LanguageSwitcher from "./LanguageSwitcher";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof LanguageSwitcher> = {
  title: "Components/LanguageSwitcher",
  component: LanguageSwitcher,
};

export default meta;

type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {};

export const PolishActive: Story = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="pl" messages={plMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
