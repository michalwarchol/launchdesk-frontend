"use client";

import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId } from "react";

import styles from "./RichTextEditor.module.scss";
import Toolbar from "./Toolbar";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled,
  className,
}: RichTextEditorProps) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (!editor) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  const containerClassName = [
    styles.editor,
    error ? styles.invalid : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <div
        className={containerClassName}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {editor ? <Toolbar editor={editor} disabled={disabled} /> : null}
        <EditorContent editor={editor} className={styles.content} />
      </div>
      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
