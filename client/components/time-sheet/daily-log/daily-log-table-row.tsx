import { useState } from "react";
import axios from "@/api/axios";
import { DailyLog, Initiative, Task } from "@/types";
import { useQuery } from "@tanstack/react-query";
import TimePicker from "react-time-picker";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/icons";

import "react-time-picker/dist/TimePicker.css";
import useAuth from "@/hooks/useAuth";

type DailyLogTableRowProps = {
  row: DailyLog;
  rowIndex: number;
  handleChange: (
    value: string | null,
    rowIndex: number,
    columnKey: keyof DailyLog
  ) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof DailyLog
  ) => void;
};

const fetchAllInitiatives = async (auth) => {
  const { data } = await axios.get("/memberTasks/users/initiatives", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });
  return data;
};

const fetchAllTasks = async (auth, id: string) => {
  const { data } = await axios.get(`/tasks/initiatives/${id}`, {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const DailyLogTableRow = (props: DailyLogTableRowProps) => {
  const { row, rowIndex, handleChange, handleInputChange } = props;

  const [selectedInitiativeId, setSelectedInitiativeId] = useState("");
  const { auth } = useAuth();
  const { data: initiatives } = useQuery(["GET-MEMBER-INITIATIVES"], () =>
    fetchAllInitiatives(auth)
  );
  const { data: tasks } = useQuery(
    ["GET-INITIATIVE-TASKS", selectedInitiativeId],
    () => fetchAllTasks(auth, selectedInitiativeId)
  );

  return (
    <TableRow>
      <TableCell width={400}>
        <Select
          value={row.initiativeName}
          onValueChange={(value) => {
            setSelectedInitiativeId(value);
            handleChange(value, rowIndex, "initiativeName");
          }}
        >
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {initiatives?.data.initiatives.map((initiative: Initiative) => (
              <SelectItem
                key={initiative.initiativeId}
                value={initiative.initiativeId}
                className="capitalize"
              >
                {initiative.initiativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell width={400}>
        <Select
          value={row.taskName}
          onValueChange={(value) => handleChange(value, rowIndex, "taskName")}
        >
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Select Task" />
          </SelectTrigger>
          <SelectContent>
            {tasks?.data.tasks.map((task: Task) => (
              <SelectItem
                key={task.taskId}
                value={task.taskId}
                className="capitalize"
              >
                {task.taskName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Description"
          defaultValue={row.description}
          onChange={(e) => handleInputChange(e, rowIndex, "description")}
        />
      </TableCell>
      <TableCell>
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.workHour}
          onChange={(value) => {
            handleChange(value, rowIndex, "workHour");
          }}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger>
            <Icons.trash2 />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you want to delete the task ?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <DialogTrigger
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                <Icons.x />
                Cancel
              </DialogTrigger>
              <DialogTrigger
                className={buttonVariants({
                  variant: "default",
                })}
              >
                <Icons.check />
                Confirm
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default DailyLogTableRow;
