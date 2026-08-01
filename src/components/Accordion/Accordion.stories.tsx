import { useState } from "react";

import Button from "@/components/Button";

import Accordion, { AccordionItemData } from "./Accordion";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const sampleItems: AccordionItemData[] = [
  {
    id: "1",
    header: "Step 1: Prepare documents",
    content: <p>Fields for the first step go here.</p>,
  },
  {
    id: "2",
    header: "Step 2: Review submission",
    content: <p>Fields for the second step go here.</p>,
  },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);

    return (
      <Accordion items={sampleItems} expandedIds={expandedIds} onExpandedChange={setExpandedIds} />
    );
  },
};

export const MultipleOpen: Story = {
  render: function MultipleOpenStory() {
    const [expandedIds, setExpandedIds] = useState<string[]>(["1", "2"]);

    return (
      <Accordion items={sampleItems} expandedIds={expandedIds} onExpandedChange={setExpandedIds} />
    );
  },
};

export const WithError: Story = {
  render: function WithErrorStory() {
    const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);

    const items: AccordionItemData[] = [
      {
        id: "1",
        header: "Step 1: Missing name",
        content: <p>This step contains a validation error.</p>,
        hasError: true,
      },
      sampleItems[1],
    ];

    return <Accordion items={items} expandedIds={expandedIds} onExpandedChange={setExpandedIds} />;
  },
};

export const Removable: Story = {
  render: function RemovableStory() {
    const [items, setItems] = useState<AccordionItemData[]>(sampleItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);

    const withHandlers = items.map((item) => ({
      ...item,
      onRemove: () => setItems((prev) => prev.filter((current) => current.id !== item.id)),
    }));

    const addItem = () => {
      const id = String(Date.now());
      setItems((prev) => [
        ...prev,
        { id, header: `Step ${prev.length + 1}`, content: <p>New step</p> },
      ]);
      setExpandedIds((prev) => [...prev, id]);
    };

    return (
      <Accordion
        items={withHandlers}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        footer={
          <Button variant="outline" onClick={addItem}>
            Add step
          </Button>
        }
      />
    );
  },
};
