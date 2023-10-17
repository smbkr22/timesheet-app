"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

import useAuth from "@/hooks/useAuth";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserInitiativeEndDateForm from "@/components/forms/user-initiative-end-date-form";
import UserInitiativeStartDateForm from "@/components/forms/user-initiative-start-date-form";
import { Icons } from "@/components/icons";

const fetchAllMemberTasks = async (auth: any) => {
  const { data } = await axios.get("/memberTasks", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });
  return data;
};

const AssignUser = () => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const initiativeName = searchParams.get("initiativeName");
  const initiativeId = searchParams.get("initiativeId");

  const { auth } = useAuth();
  const { data: memberTasks } = useQuery(["GET-ALL-MEMBER-TASKS"], () =>
    fetchAllMemberTasks(auth)
  );

  console.log(memberTasks);
  return (
    <div className="container py-8 space-y-8">
      <div className="flex gap-4">
        <h2 className="flex-1 text-2xl">Member Task Users</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Icons.userPlus />
            &nbsp;Assign User
          </DialogTrigger>
          <DialogContent>
            <UserInitiativeStartDateForm
              initiativeId={initiativeId}
              initiativeName={initiativeName}
              afterSave={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Icons.userMinus />
            &nbsp;Release User
          </DialogTrigger>
          <DialogContent>
            <UserInitiativeEndDateForm
              initiativeId={initiativeId}
              initiativeName={initiativeName}
              afterSave={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member User</TableHead>
            <TableHead>Initiative</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignUser;
