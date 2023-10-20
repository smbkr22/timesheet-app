"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

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

const fetchAllMemberTaskInfos = async (auth: any) => {
  const { data } = await axios.get("/memberTasks/users/infos", {
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
  const { data: memberTaskInfos } = useQuery(
    ["GET-ALL-MEMBER-TASK-INFOS"],
    () => fetchAllMemberTaskInfos(auth)
  );

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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member User</TableHead>
            <TableHead>Initiative</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberTaskInfos?.data.memberTaskInfos.map((info, i) => {
            const startDate = moment(info.startDate);
            const endDate = info.endDate ? moment(info.endDate) : null;

            return (
              <TableRow key={i} className="capitalize">
                <TableCell>{info.userName}</TableCell>
                <TableCell>{info.initiativeName}</TableCell>
                <TableCell>{startDate.format("MMM - DD")}</TableCell>
                <TableCell>{endDate?.format("MMM - DD") ?? "Now"}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      <Icons.userMinus size={22} />
                    </DialogTrigger>
                    <DialogContent>
                      <UserInitiativeEndDateForm
                        initiativeId={info.initiativeId}
                        initiativeName={info.initiativeName}
                        userId={info.userId}
                        userName={info.userName}
                        startDate={startDate.format("YYYY-MM-DD")}
                        afterSave={() => setOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignUser;
