import { useCallback, useEffect, useState } from "react";
import { ColumnTotals, WeeklyTableRow } from "@/types";
import uuid from "react-uuid";

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

import WeeklyLogTableRow from "./weekly-log-table-row";

type WeeklyLogTableProps = {
  daysOfWeek: Date[];
  weekFirstDate: Date;
};

const WeeklyLogTable = (props: WeeklyLogTableProps) => {
  const { daysOfWeek, weekFirstDate } = props;

  const [submitClicked, setSubmitClicked] = useState(false);
  const [rows, setRows] = useState<WeeklyTableRow[]>([]);
  const [newRow, setNewRow] = useState<WeeklyTableRow>({
    createdAt: weekFirstDate,
    id: uuid(),
    initiativeName: "",
    taskName: "",
    mon: "",
    tues: "",
    wed: "",
    thurs: "",
    fri: "",
    sat: "",
    sun: "",
    total: "00:00",
    error: false,
    isSaved: false,
  });

  const handleAddRow = () => {
    setRows([...rows, newRow]);
    setNewRow({
      createdAt: weekFirstDate,
      id: uuid(),
      initiativeName: "",
      taskName: "",
      mon: "",
      tues: "",
      wed: "",
      thurs: "",
      fri: "",
      sat: "",
      sun: "",
      total: "00:00",
      error: false,
      isSaved: false,
    });
  };

  const handleChange = (
    value: string | null,
    rowIndex: number,
    columnKey: keyof WeeklyTableRow
  ) => {
    const updatedRows = [...rows];

    if (value === "Holiday") {
      updatedRows[rowIndex].taskName = value;
    }

    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: value };

    if (columnKey !== "initiativeName" && columnKey !== "taskName") {
      updatedRows[rowIndex].total = calculateRowTotal(updatedRows[rowIndex]);
    }
    setRows(updatedRows);
    calculateColumnTotals();
  };

  const calculateRowTotal = useCallback((row: WeeklyTableRow) => {
    const timeParts = Object.values(row)
      .slice(4, 11)
      .map((time) => {
        if (time === "" || time === null) return "00:00";
        return time.split(":");
      });
    const rowTotalMinutes = timeParts.reduce(
      (totalMinutes, [hours, minutes]) => {
        const timeMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        return totalMinutes + timeMinutes;
      },
      0
    );
    return formatTimeFromMinutes(rowTotalMinutes);
  }, []);

  const [grandTotal, setGrandTotal] = useState(0);
  const [columnTotals, setColumnTotals] = useState({
    mon: 0,
    tues: 0,
    wed: 0,
    thurs: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  });
  const calculateColumnTotals = useCallback(() => {
    const totals: ColumnTotals = {
      mon: 0,
      tues: 0,
      wed: 0,
      thurs: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    let totalMinutes = 0;
    rows.forEach((row) => {
      const rowTotalMinutes = formatTimeFromHours(calculateRowTotal(row));
      Object.keys(totals).forEach((column) => {
        if (
          row[column as keyof ColumnTotals] === "" ||
          row[column as keyof ColumnTotals] === null
        )
          return;
        const timeParts = row[column as keyof ColumnTotals].split(":");
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        totals[column as keyof ColumnTotals] += hours * 60 + minutes;
      });
      totalMinutes += rowTotalMinutes;
    });
    setColumnTotals(totals);
    setGrandTotal(totalMinutes);
  }, [rows, calculateRowTotal]);

  useEffect(() => {
    calculateColumnTotals();
  }, [calculateColumnTotals]);

  const formatTimeFromHours = (totalHours: string) => {
    const timeParts = totalHours.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  };

  const formatTimeFromMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleDeleteTask = () => {};

  return (
    <form className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="[&>th]:font-semibold [&>th]:text-base">
            <TableHead>Initiative Name</TableHead>
            <TableHead>Task Name</TableHead>
            {daysOfWeek.map((day, i) => {
              const today = new Date();
              return (
                <TableHead key={i}>
                  <div
                    className={`text-center ${
                      day.toDateString() === today.toDateString()
                        ? "text-blue-700"
                        : day.toDateString() !== today.toDateString() &&
                          (day.getDay() === 0 || day.getDay() === 6)
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    <div className="font-bold">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div>{day.getDate()}</div>
                  </div>
                </TableHead>
              );
            })}
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <WeeklyLogTableRow
              key={rowIndex}
              rows={rows}
              row={row}
              rowIndex={rowIndex}
              handleChange={handleChange}
              handleDeleteTask={handleDeleteTask}
              submitClicked={submitClicked}
            />
          ))}
        </TableBody>

        {rows.length !== 0 ? (
          <TableFooter className="bg-background text-foreground">
            <TableRow className="[&>td]:font-semibold [&>td]:text-base [&>td]:tracking-wider">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.mon)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.tues)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.wed)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.thurs)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.fri)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.sat)}
              </TableCell>
              <TableCell className="text-center">
                {formatTimeFromMinutes(columnTotals.sun)}
              </TableCell>
              <TableCell className="text-center">
                {grandTotal ? formatTimeFromMinutes(grandTotal) : "00:00"}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>

      <div className="flex gap-4 px-1 mt-4 [&>button]:font-bold">
        <Button type="button" onClick={handleAddRow}>
          <Icons.plus /> Add
        </Button>
        <Button type="button" variant={"outline"}>
          Save
        </Button>
        <Button type="button">Submit</Button>
      </div>
    </form>
  );
};

export default WeeklyLogTable;
