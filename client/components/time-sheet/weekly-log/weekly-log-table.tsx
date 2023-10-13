import { useCallback, useEffect, useState } from "react";
import axios from "@/api/axios";
import { ColumnTotals, WeeklyTableRow } from "@/types";
import moment from "moment";
import uuid from "react-uuid";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  memberTasks: WeeklyTableRow[];
};

const WeeklyLogTable = (props: WeeklyLogTableProps) => {
  const { daysOfWeek, weekFirstDate, memberTasks } = props;
  const { auth } = useAuth();

  const [submitClicked, setSubmitClicked] = useState(false);
  const [rows, setRows] = useState<WeeklyTableRow[]>([]);
  const [newRow, setNewRow] = useState<WeeklyTableRow>({
    createdAt: weekFirstDate,
    memberTaskId: uuid(),
    initiativeId: "",
    taskId: "",
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

  useEffect(() => {
    setRows(memberTasks);
  }, [memberTasks, weekFirstDate]);
  useEffect(() => {
    setNewRow({
      createdAt: weekFirstDate,
      memberTaskId: uuid(),
      initiativeId: "",
      taskId: "",
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
  }, [weekFirstDate]);

  const handleAddRow = () => {
    setRows([...rows, newRow]);
    setNewRow({
      createdAt: weekFirstDate,
      memberTaskId: uuid(),
      initiativeId: "",
      taskId: "",
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

  const deleteBeforeSave = async (
    createdAtDate: string,
    updatedRows: WeeklyTableRow[]
  ) => {
    try {
      const response = await axios.get("/memberTasks", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data from the server.");
      }

      const data = response.data;

      const startDate = new Date(createdAtDate);
      startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const filteredData = data?.data.memberTasks.filter((item: any) => {
        const itemDate = moment(item.createdAt);
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);

        return (
          itemDate.isSameOrAfter(startMoment, "day") &&
          itemDate.isSameOrBefore(endMoment, "day")
        );
      });

      for (const item of filteredData) {
        const deleteResponse = await axios.delete(
          `memberTasks/${item.memberTaskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        // if (deleteResponse.status !== 204) {
        //   throw new Error("Failed to delete object from the server.");
        // }
      }

      postSave(convertObjects(updatedRows));
    } catch (error) {
      console.error(error);
    }
  };

  const postSave = async (
    data: {
      createdAt: string;
      memberTaskId: string;
      initiativeId: string;
      taskId: string;
      description: string;
      workHours: string;
      error: boolean;
      isSaved: boolean;
    }[]
  ) => {
    const promises = data.map((row) => {
      return axios
        .post("/memberTasks", row, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((res) => console.log(res.status))
        .catch((err) => console.log(err.message));
    });

    try {
      await Promise.all(promises);
      console.log("All requests completed successfully.");
    } catch (error) {
      console.error("One or more requests failed:", error);
    }
  };

  const convertObjects = (updatedRows: WeeklyTableRow[]) => {
    const daysOfWeek: Array<keyof WeeklyTableRow> = [
      "mon",
      "tues",
      "wed",
      "thurs",
      "fri",
      "sat",
      "sun",
    ];
    const convertedObjects = updatedRows.flatMap((row) =>
      daysOfWeek.reduce(
        (
          acc: {
            memberTaskId: string;
            userId: string;
            initiativeId: string;
            taskId: string;
            description: string;
            workHours: string;
            createdAt: string;
            error: boolean;
            isSaved: boolean;
          }[],
          day,
          index
        ) => {
          if (row[day] !== "" && row[day] !== null) {
            const dayNumber = index + 1;
            const date = new Date(row.createdAt);
            date.setDate(date.getDate() + dayNumber - date.getDay());

            acc.push({
              createdAt: date.toISOString(),
              memberTaskId: uuid(),
              userId: auth.user.userId,
              initiativeId: row.initiativeId,
              taskId: row.taskId,
              description: "",
              workHours: row[day],
              error: row.error,
              isSaved: row.isSaved,
            });
          }
          return acc;
        },
        []
      )
    );

    return convertedObjects;
  };

  const handleChange = (
    value: string | null,
    rowIndex: number,
    columnKey: keyof WeeklyTableRow
  ) => {
    const updatedRows = [...rows];

    if (value === "Holiday") {
      updatedRows[rowIndex].taskId = value;
    }

    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: value };

    if (columnKey !== "initiativeId" && columnKey !== "taskId") {
      updatedRows[rowIndex].total = calculateRowTotal(updatedRows[rowIndex]);
    }
    setRows(updatedRows);
    calculateColumnTotals();
  };

  const handleSave = () => {
    const updatedRows = rows.map((row) => {
      if (row.initiativeId && row.taskId) {
        if (
          row.mon ||
          row.tues ||
          row.wed ||
          row.thurs ||
          row.fri ||
          row.sat ||
          row.sun
        ) {
          return {
            ...row,
            error: false,
          };
        } else {
          return {
            ...row,
            error: true,
          };
        }
      } else {
        return {
          ...row,
        };
      }
    });

    setRows(updatedRows);

    // const rowsHasErrors = updatedRows.some((row) => row.error === true);
    // if (!rowsHasErrors) {
    //   toast.success("Saved Successfully!");
    // } else {
    //   toast.error("Error");
    //   return;
    // }

    const date = weekFirstDate.toISOString();
    deleteBeforeSave(date, updatedRows);
  };

  const handleSubmit = () => {
    const updatedRows = rows.map((row) => {
      if (row.initiativeId && row.taskId) {
        if (
          row.mon ||
          row.tues ||
          row.wed ||
          row.thurs ||
          row.fri ||
          row.sat ||
          row.sun
        ) {
          return {
            ...row,
            error: false,
          };
        } else {
          return {
            ...row,
            error: true,
          };
        }
      } else {
        return {
          ...row,
        };
      }
    });

    setRows(updatedRows);
    setSubmitClicked(true);

    const rowsHasErrors = updatedRows.some((row) => row.error === true);
    if (!rowsHasErrors) {
      toast.success("Submitted Successfully!");
    } else {
      toast.error("Error");
      return;
    }

    const date = weekFirstDate.toISOString();
    // deleteBeforeSave(date).then(() => {
    //   postSave(convertObjects(updatedRows));
    // });
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

  async function deleteDataBasedOnDate(
    deleteTask: WeeklyTableRow,
    createdAtDate: string
  ) {
    try {
      const response = await axios.get("/memberTasks", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      const data = response.data;

      const startDate = new Date(createdAtDate);
      startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const filteredData = data.filter(
        (item: {
          createdAt: Date;
          memberTaskId: string;
          initiativeId: string;
          taskId: string;
          description: string;
          workHour: string;
          error: boolean;
          isSaved: boolean;
        }) => {
          const itemDate = new Date(item.createdAt);
          return (
            itemDate >= startDate &&
            itemDate <= endDate &&
            item.initiativeId === deleteTask.initiativeId &&
            item.taskId === deleteTask.taskId
          );
        }
      );

      for (const item of filteredData) {
        const deleteResponse = await axios.delete(`/memberTasks/${item.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  const handleDeleteTask = (rowID: string) => {
    const updatedRows = [...rows];
    const index = rows.findIndex((row) => row?.memberTaskId === rowID);

    const deleteTask = updatedRows[index];
    const createdAtDate = weekFirstDate.toISOString();

    deleteDataBasedOnDate(deleteTask, createdAtDate)
      .then(() => {
        console.log("Objects deleted successfully.");
        updatedRows.splice(index, 1);
        setRows(updatedRows);
      })
      .catch((error) => console.error("Error:", error));
  };

  console.log("rows", rows);

  return (
    <form className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="[&>th]:font-semibold [&>th]:text-base">
            <TableHead className="w-[375px]">Initiative Name</TableHead>
            <TableHead className="w-[375px]">Task Name</TableHead>
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
            <TableHead className="text-center w-[84px]">Total</TableHead>
            <TableHead className="text-center w-[84px]">Action</TableHead>
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
          <Icons.plus size={16} /> Add
        </Button>
        <Button type="button" variant={"outline"} onClick={handleSave}>
          Save
        </Button>
        <Dialog>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            Submit
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you want to submit the task ?</DialogTitle>
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
                onClick={handleSubmit}
              >
                <Icons.check />
                Confirm
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
};

export default WeeklyLogTable;
