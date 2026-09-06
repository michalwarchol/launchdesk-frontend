"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import tasksMockData from "@/app/(authorized)/tasks/mockData";
import usersMockData from "@/app/(authorized)/users/mockData";
import Autocomplete from "@/components/Autocomplete";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

import styles from "./NewAssignmentForm.module.scss";
import { AssigneeOption, NewAssignmentFormValues, newAssignmentSchema, TaskOption } from "./schema";

export default function NewAssignmentForm() {
  const t = useTranslations("NewAssignmentPage");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewAssignmentFormValues>({
    resolver: zodResolver(newAssignmentSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      task: null,
      assignees: [],
    },
  });

  const [taskQuery, setTaskQuery] = useState("");
  const [assigneeQuery, setAssigneeQuery] = useState("");

  const taskOptions: TaskOption[] = useMemo(
    () =>
      tasksMockData
        .filter((task) => task.name.toLowerCase().includes(taskQuery.trim().toLowerCase()))
        .map((task) => ({ id: task.id, name: task.name })),
    [taskQuery],
  );

  const assigneeOptions: AssigneeOption[] = useMemo(
    () =>
      usersMockData
        .filter((user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(assigneeQuery.trim().toLowerCase()),
        )
        .map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        })),
    [assigneeQuery],
  );

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = (values: NewAssignmentFormValues) => {
    // TODO: replace with API call once the backend is available
    console.info("New assignment:", values);
    router.push("/assignments");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title={t("title")} subtitle={t("subtitle")} backHref="/assignments" />

      <div className={styles.body}>
        <Controller
          control={control}
          name="task"
          render={({ field }) => (
            <Autocomplete<TaskOption>
              label={t("taskLabel")}
              placeholder={t("taskPlaceholder")}
              options={taskOptions}
              getOptionLabel={(task) => task.name}
              getOptionKey={(task) => task.id}
              inputValue={taskQuery}
              onInputValueChange={setTaskQuery}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errorText(errors.task?.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="assignees"
          render={({ field }) => (
            <Autocomplete<AssigneeOption>
              multiple
              label={t("assigneesLabel")}
              placeholder={t("assigneesPlaceholder")}
              options={assigneeOptions}
              getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
              getOptionKey={(user) => user.id}
              inputValue={assigneeQuery}
              onInputValueChange={setAssigneeQuery}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errorText(errors.assignees?.message)}
              renderOption={(user) => (
                <Avatar src={user.avatar} title={`${user.firstName} ${user.lastName}`} size="sm" />
              )}
              renderValue={(user) => (
                <>
                  <Avatar
                    src={user.avatar}
                    title={`${user.firstName} ${user.lastName}`}
                    size="sm"
                    hideText
                  />
                  {user.firstName} {user.lastName}
                </>
              )}
            />
          )}
        />
      </div>

      <footer className={styles.footer}>
        <Button variant="outline" onClick={() => router.push("/assignments")}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="primary">
          {t("submit")}
        </Button>
      </footer>
    </form>
  );
}
