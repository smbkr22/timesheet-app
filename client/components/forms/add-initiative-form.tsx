"use client";

import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
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

const fetchAllManagers = async () => {
  const { data } = await axios.get("/users?role=manager");

  return data;
};

const formSchema = z.object({
  initiativeName: z.string().min(3, {
    message: "Initiative Name must be at least 5 characters.",
  }),
  initiativeDescription: z.string().min(10, {
    message: "Initiative Description must be at least 10 characters.",
  }),
  userId: z.string({ required_error: "Manager name is required" }),
  startDate: z.string(),
});

const AddInitiativeForm = ({ afterSave }: { afterSave: () => void }) => {
  const { auth } = useAuth();
  const { data } = useQuery(["GET-ALL-MANAGERS"], () => fetchAllManagers(), {
    select: (data) =>
      data.data.users.map((user: UserInfo) => ({
        value: user.userId,
        label: user.firstName,
      })),
  });

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const date = moment(values.startDate);

    const response = await axios.post(
      "/initiatives",
      { ...values, startDate: date.format() },
      {
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );

    if (response.status === 201) {
      toast("New Initiative Created");
      queryClient.invalidateQueries(["GET-INITIATIVES"]);
    }

    afterSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="initiativeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initiative Name</FormLabel>
              <FormControl>
                <Input placeholder="initiativeName..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initiativeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initiative Description</FormLabel>
              <FormControl>
                <Textarea placeholder="initiativeDescription..." {...field} />
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
              <FormLabel className="block mb-2">Select Manager</FormLabel>
              <FormControl className="w-full">
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="selectManager..." />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    <SelectGroup>
                      {data?.length
                        ? data.map((data: { label: string; value: string }) => (
                            <SelectItem key={data.value} value={data.value}>
                              {data.label}
                            </SelectItem>
                          ))
                        : "No managers found"}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input placeholder="startDate..." type="date" {...field} />
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

export default AddInitiativeForm;
