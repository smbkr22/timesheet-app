"use client";

import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  taskName: z.string().min(3, {
    message: "Task Name must be at least 5 characters.",
  }),
  taskDescription: z.string().min(10, {
    message: "Task Description must be at least 10 characters.",
  }),
});

const AddTaskForm = ({ afterSave }: { afterSave: () => void }) => {
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.post("/tasks", values, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    if (response.status === 201) {
      toast("New Task Created");
      queryClient.invalidateQueries(["GET-ALL-TASKS"]);
    }

    afterSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="taskName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="taskName..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taskDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea placeholder="taskDescription..." {...field} />
              </FormControl>
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

export default AddTaskForm;
