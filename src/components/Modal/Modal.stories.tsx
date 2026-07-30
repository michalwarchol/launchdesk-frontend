import { useState } from "react";

import Button from "@/components/Button";

import Modal from "./Modal";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function DefaultStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal title"
          onSubmit={() => setIsOpen(false)}
        >
          <p>This is the modal content rendered through a React portal.</p>
        </Modal>
      </div>
    );
  },
};

export const CustomLabels: Story = {
  render: function CustomLabelsStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete item"
          cancelLabel="Keep"
          submitLabel="Delete"
          onSubmit={() => setIsOpen(false)}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  render: function WithLongContentStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Terms and conditions"
          onSubmit={() => setIsOpen(false)}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <p key={index}>
              Paragraph {index + 1}: the modal body scrolls when the content exceeds the available
              height.
            </p>
          ))}
        </Modal>
      </div>
    );
  },
};

export const SubmitDisabled: Story = {
  render: function SubmitDisabledStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Nothing to submit"
          onSubmit={() => setIsOpen(false)}
          isSubmitDisabled
        >
          <p>The submit button is disabled until the form is valid.</p>
        </Modal>
      </div>
    );
  },
};
