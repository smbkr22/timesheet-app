import { useState } from "react";
import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button, buttonVariants } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  userId: z.string(),
  initiativeId: z.string(),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
});

const fetchAllUsers = async () => {
  const { data } = await axios.get("/users?role=user");

  return data;
};

type UserInitiativeStartDateFormProps = {
  initiativeId: string;
  initiativeName: string;
};

const UserInitiativeStartDateForm = (
  props: UserInitiativeStartDateFormProps
) => {
  const { initiativeId, initiativeName } = props;

  const [open, setOpen] = useState(false);
  const { data: users } = useQuery(["GET-ALL-USERS"], () => fetchAllUsers(), {
    select: (data) =>
      data.data.users.map((user: UserInfo) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.userId,
      })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userId: initiativeId },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initiative Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={initiativeName}
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
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select User</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select User..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {users?.length
                      ? users.map((data: { label: string; value: string }) => (
                          <SelectItem key={data.value} value={data.value}>
                            {data.label}
                          </SelectItem>
                        ))
                      : null}
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
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

export default UserInitiativeStartDateForm;
