import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import useAuth from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  initiativeId: z.string(),
  userId: z.string(),
  startDate: z.string({
    required_error: "A start date is required.",
  }),
  endDate: z.string({
    required_error: "A end date is required.",
  }),
});

type UserInitiativeEndDateForm = {
  initiativeName: string;
  initiativeId: string;
  userId: string;
  userName: string;
  startDate: string;
  afterSave: () => void;
};

const UserInitiativeEndDateForm = (props: UserInitiativeEndDateForm) => {
  const {
    initiativeId,
    initiativeName,
    userId,
    userName,
    startDate,
    afterSave,
  } = props;

  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeId: initiativeId,
      startDate: startDate,
      userId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const startDate = moment(values.startDate);
    const endDate = moment(values.endDate);
    const req = {
      ...values,
      startDate: startDate.format(),
      endDate: endDate.format(),
    };

    const res = await axios.patch("/memberTasks", req, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    if (res.status) {
      afterSave();
      toast(res.data.message);
      queryClient.invalidateQueries(["GET-ALL-MEMBER-TASK-INFOS"]);
    }
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
              <FormLabel>User</FormLabel>
              <FormControl>
                <FormControl>
                  <Input value={userName} disabled className="capitalize" />
                </FormControl>
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
                <Input
                  type="date"
                  {...field}
                  onChange={field.onChange}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} onChange={field.onChange} />
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

export default UserInitiativeEndDateForm;
