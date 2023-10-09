"use client";

import axios from "@/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  initiativeName: z.string().min(5, {
    message: "Initiative Name must be at least 5 characters.",
  }),
  initiativeDescription: z.string().min(10, {
    message: "Initiative Description must be at least 10 characters.",
  }),
});

const AddInitiativeForm = () => {
  const { auth } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeName: "",
      initiativeDescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.post("/initiatives", values, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    console.log(response.data);
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddInitiativeForm;
