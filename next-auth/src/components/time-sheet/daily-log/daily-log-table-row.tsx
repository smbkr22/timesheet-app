import { useMemo } from "react";
import { DailyLog } from "@/types";
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

const DATA = [
  {
    userId: "sksd-sdsdkl-qwuqwo",
    InitiativeName: "Mobilize-Command-Alkon",
    InitiativeId: "sksd-sdsdkl-qwuqwo",
    tasks: [
      {
        taskName: "Dashboard Development",
        taskId: "99898-889797-556",
        taskDesc: "",
      },
      {
        taskName: "User Information Page",
        taskId: "99898-7asash-556",
        taskDesc: "",
      },
    ],
  },
  {
    userId: "sksd-sdsdkl-qwuqwo",
    InitiativeName: "GTreasury-Web-App",
    InitiativeId: "sksd-nnnnn-qwuqwo",
    tasks: [
      {
        taskName: "Customer Cards",
        taskId: "99898-xwqwsckf1-556",
        taskDesc: "",
      },
      {
        taskName: "Navigation Menu",
        taskId: "99898-nzxqwufgdffd544-556",
        taskDesc: "",
      },
    ],
  },
  {
    userId: "sksd-sdsdkl-qwuqwo",
    InitiativeName: "Holiday",
    InitiativeId: "sksd-sdsdkl-yuiyp",
    tasks: [
      {
        taskName: "Holiday",
        taskId: "99898-xwqwryrtyrtsckf1-556",
        taskDesc: "",
      },
    ],
  },
  {
    userId: "sksd-sdsdkl-qwuqwo",
    InitiativeName: "Leave",
    InitiativeId: "sksd-sdsdkl-vnvbnbn",
    tasks: [
      {
        taskName: "Half Day",
        taskId: "99898-xwqvnvnwsckf1-556",
        taskDesc: "",
      },
      {
        taskName: "Full Day",
        taskId: "99898-xvbvbcbwqvnvnwsckf1-556",
        taskDesc: "",
      },
    ],
  },
];

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

const DailyLogTableRow = (props: DailyLogTableRowProps) => {
  const { row, rowIndex, handleChange, handleInputChange } = props;

  const clientProjectOptions = useMemo(
    () => DATA.map((data) => data.InitiativeName) ?? [],
    []
  );

  const clientProjectTasks = useMemo(
    () =>
      DATA.find(
        (data) => data.InitiativeName === row.initiativeName
      )?.tasks.map((task) => task.taskName) ?? [],
    [row.initiativeName]
  );

  return (
    <TableRow>
      <TableCell width={400}>
        <Select
          value={row.initiativeName}
          onValueChange={(value) =>
            handleChange(value, rowIndex, "initiativeName")
          }
        >
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {clientProjectOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
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
            {clientProjectTasks.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
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
            <Icons.Trash2 />
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
                <Icons.X />
                Cancel
              </DialogTrigger>
              <DialogTrigger
                className={buttonVariants({
                  variant: "default",
                })}
              >
                <Icons.Check />
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
