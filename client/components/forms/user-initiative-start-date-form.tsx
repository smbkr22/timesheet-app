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
  userId: z.string({
    required_error: "A user is required.",
  }),
  startDate: z.string({
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
  afterSave: () => void;
};

const UserInitiativeStartDateForm = (
  props: UserInitiativeStartDateFormProps
) => {
  const { initiativeId, initiativeName, afterSave } = props;

  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const { data: users } = useQuery(
    ["GET-ALL-ONLY-USERS"],
    () => fetchAllUsers(),
    {
      select: (data) =>
        data.data.users.map((user: UserInfo) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.userId,
        })),
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initiativeId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const startDate = moment(values.startDate);

    const req = { ...values, startDate: startDate.format() };
    const res = await axios.post("/memberTasks", req, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    if (res.status === 201) toast("New Member Task has been created");

    queryClient.invalidateQueries(["GET-ALL-MEMBER-TASK-INFOS"]);
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
                <Input
                  placeholder="startDate..."
                  type="date"
                  {...field}
                  onChange={field.onChange}
                />
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
