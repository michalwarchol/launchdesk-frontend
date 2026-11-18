"use client";

import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId } from "react";

import styles from "./RichTextEditor.module.scss";
import Toolbar from "./Toolbar";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label: string;
  hideLabel?: boolean;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  hideLabel = false,
  onBlur,
  placeholder,
  error,
  disabled,
  className,
}: RichTextEditorProps) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        "aria-labelledby": labelId,
        "aria-multiline": "true",
        ...(error ? { "aria-invalid": "true", "aria-describedby": errorId } : {}),
      },
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        code: false,
        codeBlock: false,
      }),
      Code.extend({ excludes: "bold italic strike underline code" }),
      CodeBlock.extend({ marks: "link" }),
      Link.extend({ inclusive: false }).configure({ openOnClick: true }),
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

  useEffect(() => {
    if (!editor) return;

    const attributes: Record<string, string> = {
      "aria-labelledby": labelId,
      "aria-multiline": "true",
      ...(error ? { "aria-invalid": "true", "aria-describedby": errorId } : {}),
    };

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        attributes,
      },
    });

    // ProseMirror applies `editorProps.attributes` only when the view is created,
    // so keep the live element in sync when the error state changes.
    const dom = editor.view.dom;
    for (const name of ["aria-invalid", "aria-describedby"]) {
      if (!attributes[name]) dom.removeAttribute(name);
    }
    for (const [name, value] of Object.entries(attributes)) {
      dom.setAttribute(name, value);
    }
  }, [editor, error, errorId, labelId]);

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
      <span
        id={labelId}
        className={[styles.label, hideLabel ? styles.visuallyHidden : ""].filter(Boolean).join(" ")}
        onClick={() => editor?.commands.focus()}
      >
        {label}
      </span>
      <div className={containerClassName}>
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
