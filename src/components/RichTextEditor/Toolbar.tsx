"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

import LinkModal, { type LinkModalValues } from "./LinkModal";
import styles from "./RichTextEditor.module.scss";

import type { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  tabIndex: number;
  onFocus: () => void;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  isActive,
  disabled,
  tabIndex,
  onFocus,
  onClick,
  children,
}: ToolbarButtonProps) {
  const className = [styles.toolbarButton, isActive ? styles.toolbarButtonActive : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      onFocus={onFocus}
      disabled={disabled}
      {...preventFirefoxDisabledRestore}
      tabIndex={tabIndex}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default function Toolbar({ editor, disabled }: ToolbarProps) {
  const t = useTranslations("RichTextEditor");

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkValues, setLinkValues] = useState<LinkModalValues>({ url: "", text: "" });
  const hasExistingLink = editor.isActive("link");

  const openLinkModal = () => {
    const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    setLinkValues({ url: previousUrl, text: selectedText });
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => setIsLinkModalOpen(false);

  const submitLink = () => {
    const url = linkValues.url.trim();
    const text = linkValues.text.trim();

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      closeLinkModal();
      return;
    }

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) {
      const selectedText = editor.state.doc.textBetween(from, to, " ");

      if (text !== "" && text !== selectedText) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text,
            marks: [{ type: "link", attrs: { href: url } }],
          })
          .run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: text || url,
          marks: [{ type: "link", attrs: { href: url } }],
        })
        .run();
    }

    closeLinkModal();
  };

  const focusButton = (index: number) => {
    const buttons = toolbarRef.current?.querySelectorAll("button");
    if (!buttons || buttons.length === 0) return;

    const next = (index + buttons.length) % buttons.length;
    setFocusedIndex(next);
    buttons[next]?.focus();
  };

  const handleToolbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = toolbarRef.current?.querySelectorAll("button").length ?? 0;
    if (count === 0) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusButton(focusedIndex + 1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusButton(focusedIndex - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusButton(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusButton(count - 1);
    }
  };

  const buttonProps = (index: number) => ({
    tabIndex: index === focusedIndex ? 0 : -1,
    onFocus: () => setFocusedIndex(index),
  });

  return (
    <>
      <div
        ref={toolbarRef}
        className={styles.toolbar}
        role="toolbar"
        aria-label={t("toolbar")}
        onKeyDown={handleToolbarKeyDown}
      >
        <ToolbarButton
          label={t("bold")}
          isActive={editor.isActive("bold")}
          disabled={disabled}
          {...buttonProps(0)}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          isActive={editor.isActive("italic")}
          disabled={disabled}
          {...buttonProps(1)}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label={t("strike")}
          isActive={editor.isActive("strike")}
          disabled={disabled}
          {...buttonProps(2)}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className={styles.strikeIcon}>S</span>
        </ToolbarButton>
        <ToolbarButton
          label={t("code")}
          isActive={editor.isActive("code")}
          disabled={disabled}
          {...buttonProps(3)}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </ToolbarButton>

        <span className={styles.toolbarDivider} aria-hidden="true" />

        <ToolbarButton
          label={t("heading1")}
          isActive={editor.isActive("heading", { level: 1 })}
          disabled={disabled}
          {...buttonProps(4)}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          label={t("heading2")}
          isActive={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          {...buttonProps(5)}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label={t("heading3")}
          isActive={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          {...buttonProps(6)}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <span className={styles.toolbarDivider} aria-hidden="true" />

        <ToolbarButton
          label={t("bulletList")}
          isActive={editor.isActive("bulletList")}
          disabled={disabled}
          {...buttonProps(7)}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          &bull; &mdash;
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          isActive={editor.isActive("orderedList")}
          disabled={disabled}
          {...buttonProps(8)}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          isActive={editor.isActive("blockquote")}
          disabled={disabled}
          {...buttonProps(9)}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          label={t("codeBlock")}
          isActive={editor.isActive("codeBlock")}
          disabled={disabled}
          {...buttonProps(10)}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"{ }"}
        </ToolbarButton>
        <ToolbarButton
          label={t("link")}
          isActive={hasExistingLink}
          disabled={disabled}
          {...buttonProps(11)}
          onClick={openLinkModal}
        >
          &#128279;
        </ToolbarButton>
      </div>
      <LinkModal
        isOpen={isLinkModalOpen}
        values={linkValues}
        hasExistingLink={hasExistingLink}
        onChange={setLinkValues}
        onClose={closeLinkModal}
        onSubmit={submitLink}
      />
    </>
  );
}
