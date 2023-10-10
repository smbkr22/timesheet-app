import { useState } from "react";
import axios from "@/api/axios";
import { AuthInfo, Initiative, Task, WeeklyTableRow } from "@/types";
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

type WeeklyLogTableRowProps = {
  rows: WeeklyTableRow[];
  row: WeeklyTableRow;
  rowIndex: number;
  handleChange: (
    value: string | null,
    rowIndex: number,
    col: keyof WeeklyTableRow
  ) => void;
  handleDeleteTask: (rowID: string) => void;

  submitClicked: boolean;
};

const fetchAllInitiatives = async (auth: AuthInfo) => {
  const { data } = await axios.get("/memberTasks/users/initiatives", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });
  return data;
};

const fetchAllTasks = async (auth: AuthInfo) => {
  const { data } = await axios.get(`/tasks`, {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const WeeklyLogTableRow = (props: WeeklyLogTableRowProps) => {
  const { rows, row, rowIndex, handleChange, handleDeleteTask, submitClicked } =
    props;

  // const [selectedInitiativeId, setSelectedInitiativeId] = useState(
  //   row.initiativeId
  // );
  // const [selectedTaskId, setSelectedTaskId] = useState(row.taskId);

  const { auth } = useAuth();
  const { data: initiatives } = useQuery(["GET-MEMBER-INITIATIVES"], () =>
    fetchAllInitiatives(auth)
  );
  const { data: tasks } = useQuery(
    ["GET-ALL-TASKS"],
    () => fetchAllTasks(auth),
    {
      select: (data) =>
        data?.data.filter(
          (task: Task) => task.initiativeId === row.initiativeId
        ),
    }
  );

  return (
    <TableRow>
      <TableCell>
        <Select
          value={row.initiativeId}
          onValueChange={(value) => {
            // setSelectedInitiativeId(value);
            handleChange(value, rowIndex, "initiativeId");
          }}
        >
          <SelectTrigger className="capitalize w-80">
            <SelectValue placeholder="Select Initiative" />
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

      <TableCell>
        <Select
          value={row.taskId}
          onValueChange={(value) => {
            // setSelectedTaskId(value);
            handleChange(value, rowIndex, "taskId");
          }}
        >
          <SelectTrigger className="capitalize w-80">
            <SelectValue placeholder="Select Task" />
          </SelectTrigger>
          <SelectContent>
            {tasks?.map((task: Task) => (
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

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.mon}
          onChange={(value) => handleChange(value, rowIndex, "mon")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.tues}
          onChange={(value) => handleChange(value, rowIndex, "tues")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.wed}
          onChange={(value) => handleChange(value, rowIndex, "wed")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.thurs}
          onChange={(value) => handleChange(value, rowIndex, "thurs")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.fri}
          onChange={(value) => handleChange(value, rowIndex, "fri")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.sat}
          onChange={(value) => handleChange(value, rowIndex, "sat")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-center">
        <TimePicker
          maxDetail="minute"
          disableClock
          clearIcon={null}
          locale="hu-HU"
          value={row.sun}
          onChange={(value) => handleChange(value, rowIndex, "sun")}
          className="!border !border-border !rounded-[0.2rem]"
        />
      </TableCell>

      <TableCell className="text-base font-semibold text-center">
        {row.total ? row.total : "00:00"}
      </TableCell>

      <TableCell className="text-center">
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
                onClick={() => handleDeleteTask(row.memberTaskId)}
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

export default WeeklyLogTableRow;
