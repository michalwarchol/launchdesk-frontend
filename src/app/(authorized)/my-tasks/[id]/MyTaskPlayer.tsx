"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useMyTaskQuery, useSetStepCompletionMutation } from "@/app/(authorized)/my-tasks/api";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import RichTextEditor from "@/components/RichTextEditor";
import { isRichTextEmpty } from "@/components/RichTextEditor/isRichTextEmpty";
import richTextStyles from "@/components/RichTextEditor/RichTextEditor.module.scss";
import { BFF_BASE } from "@/lib/api/config";
import { isApiError } from "@/lib/api/errors";

import styles from "./MyTaskPlayer.module.scss";

import type { MyTask, MyTaskStep } from "@/lib/api/types";

type Screen = { kind: "welcome" } | { kind: "step"; index: number } | { kind: "finish" };

interface MyTaskPlayerProps {
  assignmentId: string;
}

function resumeScreen(task: MyTask): Screen {
  if (task.steps.length === 0 || task.steps.every((step) => !step.completed)) {
    return { kind: "welcome" };
  }

  const unfinishedIndex = task.steps.findIndex((step) => !step.completed);

  if (unfinishedIndex === -1) return { kind: "finish" };

  return { kind: "step", index: unfinishedIndex };
}

export default function MyTaskPlayer({ assignmentId }: MyTaskPlayerProps) {
  const t = useTranslations("MyTaskPlayer");
  const { data, isPending, error } = useMyTaskQuery(assignmentId);
  const setCompletion = useSetStepCompletionMutation(assignmentId);
  const [override, setOverride] = useState<Screen | null>(null);
  const [saveError, setSaveError] = useState(false);

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title="…" backHref="/my-tasks" />
        <div className={styles.status} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.visuallyHidden}>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    const notFound = isApiError(error) && error.status === 404;

    return (
      <div className={styles.page}>
        <PageHeader title={t("notFound")} backHref="/my-tasks" />
        <Alert variant="error">{notFound ? t("notFound") : t("loadError")}</Alert>
      </div>
    );
  }

  const screen = override ?? resumeScreen(data);
  const step = screen.kind === "step" ? data.steps[screen.index] : undefined;
  const visibleScreen: Screen = screen.kind === "step" && !step ? { kind: "welcome" } : screen;

  const goBack = (notes: string) => {
    if (visibleScreen.kind !== "step" || !step || step.completed) return;

    setSaveError(false);

    const leave = () => {
      if (visibleScreen.index > 0) {
        setOverride({ kind: "step", index: visibleScreen.index - 1 });
        return;
      }

      setOverride({ kind: "welcome" });
    };

    void setCompletion
      .mutateAsync({ stepId: step.id, completed: false, notes })
      .then(leave)
      .catch(() => setSaveError(true));
  };

  return (
    <div className={styles.page}>
      <PageHeader title={data.name} backHref="/my-tasks" />
      <ProgressBar value={data.progress} />
      {saveError ? <Alert variant="error">{t("saveError")}</Alert> : null}
      {visibleScreen.kind === "welcome" ? (
        <Welcome task={data} onStart={() => setOverride({ kind: "step", index: 0 })} />
      ) : null}
      {visibleScreen.kind === "step" && step ? (
        <StepPanel
          key={step.id}
          assignmentId={data.id}
          step={step}
          isSaving={setCompletion.isPending}
          onBack={goBack}
          onAdvance={() => {
            setSaveError(false);
            if (visibleScreen.index >= data.steps.length - 1) {
              setOverride({ kind: "finish" });
              return;
            }

            setOverride({ kind: "step", index: visibleScreen.index + 1 });
          }}
          onSave={(completed, notes) =>
            setCompletion.mutateAsync({ stepId: step.id, completed, notes })
          }
          onSaveError={() => setSaveError(true)}
        />
      ) : null}
      {visibleScreen.kind === "finish" ? (
        <section className={styles.panel}>
          <h2 className={styles.stepTitle}>{t("thanksTitle")}</h2>
          <p className={styles.description}>{t("thanksBody")}</p>
        </section>
      ) : null}
    </div>
  );
}

function Welcome({ task, onStart }: { task: MyTask; onStart: () => void }) {
  const t = useTranslations("MyTaskPlayer");

  return (
    <section className={styles.panel}>
      <p className={styles.description}>{task.description}</p>
      <div className={styles.actions}>
        <Button onClick={onStart} disabled={task.steps.length === 0}>
          {t("letsStart")}
        </Button>
      </div>
    </section>
  );
}

function StepPanel({
  assignmentId,
  step,
  isSaving,
  onBack,
  onAdvance,
  onSave,
  onSaveError,
}: {
  assignmentId: string;
  step: MyTaskStep;
  isSaving: boolean;
  onBack: (notes: string) => void;
  onAdvance: () => void;
  onSave: (completed: boolean, notes: string) => Promise<MyTask>;
  onSaveError: () => void;
}) {
  const t = useTranslations("MyTaskPlayer");
  const [notes, setNotes] = useState(step.notes);
  const [notesError, setNotesError] = useState(false);

  const markStep = async (completed: boolean) => {
    if (completed && step.notesRequired && isRichTextEmpty(notes)) {
      setNotesError(true);
      return;
    }

    setNotesError(false);

    try {
      await onSave(completed, notes);
    } catch (error) {
      if (isApiError(error) && error.code === "notesRequired") {
        setNotesError(true);
        return;
      }

      onSaveError();
      return;
    }

    if (!completed) return;

    onAdvance();
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.stepTitle}>{step.name}</h2>
      <div className={richTextStyles.editor}>
        <div className={richTextStyles.content}>
          <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: step.description }} />
        </div>
      </div>
      {step.attachments.length > 0 ? (
        <div>
          <h3 className={styles.attachmentsTitle}>{t("attachments")}</h3>
          <ul className={styles.attachments}>
            {step.attachments.map((attachment) => (
              <li key={attachment.id}>
                <a
                  className={styles.attachment}
                  href={`${BFF_BASE}/assignments/me/${assignmentId}/steps/${step.id}/attachments/${attachment.id}/download`}
                >
                  {attachment.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className={styles.notes}>
        <span className={styles.attachmentsTitle}>{t("notesLabel")}</span>
        <RichTextEditor
          value={notes}
          onChange={(value) => {
            setNotes(value);
            if (notesError) setNotesError(false);
          }}
          placeholder={t("notesPlaceholder")}
          error={notesError ? t("notesRequired") : undefined}
          disabled={isSaving}
        />
      </div>
      <div className={styles.actions}>
        {!step.completed ? (
          <Button variant="outline" onClick={() => onBack(notes)} disabled={isSaving}>
            {t("back")}
          </Button>
        ) : null}
        <Button onClick={() => markStep(!step.completed)} disabled={isSaving}>
          {step.completed ? t("markNotDone") : t("markDone")}
        </Button>
        {step.completed ? (
          <Button variant="outline" onClick={onAdvance} disabled={isSaving}>
            {t("next")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
