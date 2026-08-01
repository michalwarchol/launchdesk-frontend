import { useTranslations } from "next-intl";

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
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, isActive, disabled, onClick, children }: ToolbarButtonProps) {
  const className = [styles.toolbarButton, isActive ? styles.toolbarButtonActive : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
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

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("linkPrompt"), previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label={t("toolbar")}>
      <ToolbarButton
        label={t("bold")}
        isActive={editor.isActive("bold")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        label={t("italic")}
        isActive={editor.isActive("italic")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        label={t("strike")}
        isActive={editor.isActive("strike")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        label={t("code")}
        isActive={editor.isActive("code")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </ToolbarButton>

      <span className={styles.toolbarDivider} aria-hidden="true" />

      <ToolbarButton
        label={t("heading2")}
        isActive={editor.isActive("heading", { level: 2 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label={t("heading3")}
        isActive={editor.isActive("heading", { level: 3 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>

      <span className={styles.toolbarDivider} aria-hidden="true" />

      <ToolbarButton
        label={t("bulletList")}
        isActive={editor.isActive("bulletList")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        &bull; &mdash;
      </ToolbarButton>
      <ToolbarButton
        label={t("orderedList")}
        isActive={editor.isActive("orderedList")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        label={t("blockquote")}
        isActive={editor.isActive("blockquote")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo;
      </ToolbarButton>
      <ToolbarButton
        label={t("codeBlock")}
        isActive={editor.isActive("codeBlock")}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {"{ }"}
      </ToolbarButton>
      <ToolbarButton
        label={t("link")}
        isActive={editor.isActive("link")}
        disabled={disabled}
        onClick={setLink}
      >
        &#128279;
      </ToolbarButton>

      <span className={styles.toolbarDivider} aria-hidden="true" />

      <ToolbarButton
        label={t("undo")}
        disabled={disabled || !editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        &#8630;
      </ToolbarButton>
      <ToolbarButton
        label={t("redo")}
        disabled={disabled || !editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        &#8631;
      </ToolbarButton>
    </div>
  );
}
