import { useEffect, useState } from "react";
import { DailyLog } from "@/types";
import { toast } from "sonner";

import { useCreateTimeSheetTask } from "@/hooks/useFetchTasks";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";

import DailyLogTableRow from "./daily-log-table-row";

type DailyLogTableProps = {
  createdDate: Date;
  rows: DailyLog[];
  setRows: React.Dispatch<React.SetStateAction<DailyLog[]>>;
};

const DailyLogTable = (props: DailyLogTableProps) => {
  const { createdDate, rows, setRows } = props;

  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    calculateColumnTotals(rows);
  }, [rows]);

  const [newRow, setNewRow] = useState<DailyLog>({
    createdAt: createdDate.toISOString(),
    initiativeName: "",
    taskName: "",
    description: "",
    workHour: "",
    error: false,
    isSaved: false,
  });
  useEffect(() => {
    setNewRow({
      createdAt: createdDate.toISOString(),
      initiativeName: "",
      taskName: "",
      description: "",
      workHour: "",
      error: false,
      isSaved: false,
    });
  }, [createdDate]);

  const handleAddRow = () => {
    setRows([...rows, newRow]);
    setNewRow({
      createdAt: createdDate.toISOString(),
      initiativeName: "",
      taskName: "",
      description: "",
      workHour: "",
      error: false,
      isSaved: false,
    });
    setSubmitClicked(false);
  };

  const handleChange = (
    value: string | null,
    rowIndex: number,
    columnKey: keyof DailyLog
  ) => {
    const updatedRows = updateRows([...rows], value, rowIndex, columnKey);
    setRows(updatedRows);
    calculateColumnTotals(updatedRows);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof DailyLog
  ) => {
    const { value } = e.target;
    const updatedRows = updateRows([...rows], value, rowIndex, columnKey);
    setRows(updatedRows);
  };

  const [totalWorkHours, setTotalWorkHours] = useState("00:00");
  const calculateColumnTotals = (rowsToUpdate: DailyLog[]) => {
    const totalMinutes = rowsToUpdate.reduce((total, row) => {
      if (row.workHour) {
        const [hours, minutes] = row.workHour.split(":");
        return total + parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      }
      return total;
    }, 0);

    const formattedTotalWorkHours =
      Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      (totalMinutes % 60).toString().padStart(2, "0");

    setTotalWorkHours(formattedTotalWorkHours);
  };

  const updateRows = (
    rowsToUpdate: DailyLog[],
    value: string | null,
    rowIndex: number,
    columnKey: keyof DailyLog
  ) => {
    const updatedRows = [...rowsToUpdate];

    if (value === "Holiday") {
      updatedRows[rowIndex].taskName = value;
      updatedRows[rowIndex].description = value;
      updatedRows[rowIndex].workHour = "8:00";
    }

    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: value };

    if (updatedRows[rowIndex].initiativeName === "Leave") {
      if (updatedRows[rowIndex].taskName === "Half Day") {
        updatedRows[rowIndex].description = "Half Day";
        updatedRows[rowIndex].workHour = "4:00";
      }
      if (updatedRows[rowIndex].taskName === "Full Day") {
        updatedRows[rowIndex].description = "Full Day";
        updatedRows[rowIndex].workHour = "8:00";
      }
    }

    return updatedRows;
  };

  const { mutateAsync } = useCreateTimeSheetTask();
  const handleSave = async () => {
    if (!submitClicked) return;

    const updatedRows = rows.map((row) =>
      row.initiativeName !== "Leave" && row.initiativeName !== "Holiday"
        ? { ...row, error: false }
        : { ...row }
    );

    setRows(updatedRows);
    setSubmitClicked(true);

    const tasksToSave = updatedRows.filter((row) => !row.error);

    if (tasksToSave.length > 0) {
      await Promise.all(tasksToSave.map((row) => mutateAsync(row)));
      toast("Successfully Saved");
    }
  };

  return (
    <form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Initiative Name</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <DailyLogTableRow
              key={i}
              row={row}
              rowIndex={i}
              handleChange={handleChange}
              handleInputChange={handleInputChange}
            />
          ))}
        </TableBody>
        {rows.length ? (
          <TableFooter className="bg-background text-foreground">
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-lg text-right">Total: </TableCell>
              <TableCell className="text-lg pl-9">{totalWorkHours}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
      <div className="flex gap-4 px-1 mt-4">
        <Button onClick={handleAddRow} type="button">
          Add <Icons.plus />
        </Button>

        <Button
          onClick={handleSave}
          // disabled={
          //   rows.length > 0 ? rows.every((row) => row.isSaved === true) : false
          // }
          type="button"
        >
          Save
        </Button>

        {/* <Dialog>
          <DialogTrigger
            //   disabled={
            //     rows.length > 0
            //       ? rows.every((row) => row.isSaved === true)
            //       : false
            className={buttonVariants({
              variant: "default",
            })}
          >
            Submit
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> Do you want to submit ?</DialogTitle>
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
        </Dialog> */}
      </div>
    </form>
  );
};

export default DailyLogTable;
