"use client";

import { useSearchParams } from "next/navigation";

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

const AssignUser = () => {
  const searchParams = useSearchParams();
  const initiativeName = searchParams.get("initiativeName");
  const initiativeId = searchParams.get("initiativeId");
  return (
    <div className="container py-8 space-y-8">
      <div className="flex gap-4">
        <h2 className="flex-1 text-2xl">Member Task Users</h2>
        <Dialog>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Icons.userPlus />
            &nbsp;Assign User
          </DialogTrigger>
          <DialogContent>
            <UserInitiativeStartDateForm
              initiativeId={initiativeId}
              initiativeName={initiativeName}
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
