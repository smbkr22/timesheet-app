"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SearchSelect } from "../ui/search-select";
import { Textarea } from "../ui/textarea";

const selectItems = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const formSchema = z.object({
  initiativeName: z.string().min(5, {
    message: "Initiative Name must be at least 5 characters.",
  }),
  initiativeDescription: z.string().min(10, {
    message: "Initiative Description must be at least 10 characters.",
  }),
  selectManager: z.string(),
});

const AddInitiativeMemberForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeName: "",
      selectManager: "",
      initiativeDescription: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className="w-10/12 max-w-3xl p-4 space-y-6 border rounded-lg border-secondary"
        className="space-y-6"
      >
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
          name="selectManager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Manager</FormLabel>
              <br />
              <FormControl>
                <SearchSelect
                  fieldName="Manager"
                  className="w-full"
                  selectItems={selectItems}
                  {...field}
                />
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

export default AddInitiativeMemberForm;
