"use client";

import axios from "@/api/axios";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import useAuth from "@/hooks/useAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  initiativeId: z.string(),
  taskId: z.array(z.string()).refine((value) => value.some((task) => task), {
    message: "You have to select at least one task.",
  }),
});

type AddInitiativeTaskFormType = {
  selectedInitiativeName: string;
  selectedInitiativeId: string;
  afterSave: () => void;
};

const fetchAllTasks = async (auth: any) => {
  const { data } = await axios.get("/tasks", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });
  return data;
};

const fetchInitiativeTasksById = async (auth: any, id: string) => {
  const { data } = await axios.get(`/initiativeTasks/initiatives/${id}`, {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const AddInitiativeTaskForm = (props: AddInitiativeTaskFormType) => {
  const { selectedInitiativeName, selectedInitiativeId, afterSave } = props;

  const { auth } = useAuth();

  const { data: initiativeTasks } = useQuery(
    ["GET-ALL-INITIATIVE-TASKS"],
    () => fetchInitiativeTasksById(auth, selectedInitiativeId),
    { select: (data) => data?.data.initiativeTasks.map((el) => el.taskId) }
  );
  const { data: tasks } = useQuery(
    ["GET-ALL-TASKS"],
    () => fetchAllTasks(auth),
    {
      select: (data) =>
        data?.data
          .map((task: Task) => ({
            label: task.taskName,
            value: task.taskId,
          }))
          .filter((task) => !initiativeTasks?.includes(task.value)),
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeId: selectedInitiativeName,
      taskId: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axios.post(
      "/initiativeTasks",
      { ...values, initiativeId: selectedInitiativeId },
      {
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );

    if (res.status === 201) toast("Initiative tasks has been assigned");
    afterSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="initiativeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Initiative Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="initiativeName..."
                  {...field}
                  disabled
                  className="capitalize"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taskId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Task Name</FormLabel>
              <div className="flex flex-wrap gap-3">
                {tasks?.length ? (
                  tasks?.map((task: { label: string; value: string }) => (
                    <FormField
                      key={task.value}
                      control={form.control}
                      name="taskId"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={task.value}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                id={task.value}
                                checked={field.value?.includes(task.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        task.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== task.value
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={task.value}
                              className="text-base font-normal capitalize"
                            >
                              {task.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))
                ) : (
                  <span className="text-sm">
                    All available task had been assigned.
                  </span>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="reset"
            disabled={form.formState.isSubmitting}
            className={buttonVariants({ variant: "secondary" })}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddInitiativeTaskForm;
