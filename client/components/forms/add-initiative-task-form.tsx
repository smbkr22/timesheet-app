"use client";

import axios from "@/api/axios";
import { UserInfo } from "@/types";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  taskName: z.string().min(3, {
    message: "Task Name must be at least 3 characters.",
  }),
  taskDescription: z.string().min(5, {
    message: "Task Description must be at least 5 characters.",
  }),
  initiativeId: z.string(),
  userId: z.string(),
});

type AddInitiativeTaskFormType = {
  selectedInitiativeName: string;
  selectedInitiativeId: string;
  afterSave: () => void;
};

const fetchAllUsers = async (auth: any) => {
  const { data } = await axios.get("/users?role=user");

  return data;
};

const AddInitiativeTaskForm = (props: AddInitiativeTaskFormType) => {
  const { selectedInitiativeName, selectedInitiativeId, afterSave } = props;

  const { auth } = useAuth();
  const { data: users } = useQuery(["GET-USERS"], () => fetchAllUsers(auth), {
    select: (data) =>
      data.data.users.map((user: UserInfo) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.userId,
      })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeId: selectedInitiativeName,
      taskName: "",
      taskDescription: "",
      userId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axios.post(
      "/tasks",
      { ...values, initiativeId: selectedInitiativeId },
      {
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );

    if (res.status === 201) toast("New Task Created");
    afterSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="initiativeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initiative Name</FormLabel>
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

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2">Select Users</FormLabel>
              <FormControl>
                {/* <SearchSelect
                  fieldName="User"
                  selectItems={users ?? []}
                  className="w-full capitalize"
                /> */}
                <Select
                  onValueChange={field.onChange}
                  // defaultValue={field.value}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select Users..." />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    <SelectGroup>
                      {users?.length
                        ? users.map((data) => (
                            <SelectItem key={data.value} value={data.value}>
                              {data.label}
                            </SelectItem>
                          ))
                        : null}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

export default AddInitiativeTaskForm;
