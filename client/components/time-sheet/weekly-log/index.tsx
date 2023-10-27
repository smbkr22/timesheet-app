import React, { useCallback, useEffect, useState } from "react";
import axios from "@/api/axios";
import { WeeklyTableRow } from "@/types";
import { useQuery } from "@tanstack/react-query";

import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Icons } from "@/components/icons";

import WeeklyLogTable from "./weekly-log-table";

const fetchAllMemberTasks = async (auth) => {
  const { data } = await axios.get("/memberTasks", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const WeeklyLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousWeek = () => {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const daysOfWeek: Date[] = [];
  const firstDay = new Date(currentDate);
  firstDay.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + i);
    daysOfWeek.push(day);
  }
  const weekFirstDate = daysOfWeek[0];

  const startDate = daysOfWeek[0].toLocaleDateString("en-US");
  const endDate = daysOfWeek[daysOfWeek.length - 1].toLocaleDateString("en-US");
  const dateRange = `${startDate} to ${endDate}`;

  const { auth } = useAuth();
  const [filteredData, setFilteredData] = useState<WeeklyTableRow[]>([]);
  const { data: memberTasks, isLoading } = useQuery(["GET-MEMBER-TASKS"], () =>
    fetchAllMemberTasks(auth)
  );

  const getFilteredData = useCallback(() => {
    const res: {
      createdAt: Date;
      memberTaskId: string;
      initiativeId: string;
      taskId: string;
      description: string;
      workHours: string;
      error: boolean;
      isSaved: boolean;
    }[] = memberTasks?.data.memberTasks ?? [];

    const filterData = res
      .map((d) => {
        const date = new Date(d.createdAt);
        const dayOfWeek = date.getDay();
        const data = {
          createdAt: d.createdAt,
          memberTaskId: d.memberTaskId,
          initiativeId: d.initiativeId,
          taskId: d.taskId,
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
        };

        switch (dayOfWeek) {
          case 1:
            data.mon = d.workHours ?? "";
            break;
          case 2:
            data.tues = d.workHours ?? "";
            break;
          case 3:
            data.wed = d.workHours ?? "";
            break;
          case 4:
            data.thurs = d.workHours ?? "";
            break;
          case 5:
            data.fri = d.workHours ?? "";
            break;
          case 6:
            data.sat = d.workHours ?? "";
            break;
          case 0:
            data.sun = d.workHours ?? "";
            break;
          default:
            break;
        }

        return data;
      })
      .filter((data) => {
        const dataDate = new Date(data["createdAt"]);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const getFullStartDate = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        );
        const getFullDataDate = new Date(
          dataDate.getFullYear(),
          dataDate.getMonth(),
          dataDate.getDate()
        );
        const getFullEndDate = new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate()
        );

        return (
          getFullDataDate >= getFullStartDate &&
          getFullDataDate <= getFullEndDate
        );
      })
      .reduce((acc: WeeklyTableRow[], current) => {
        const days: Array<keyof WeeklyTableRow> = [
          "mon",
          "tues",
          "wed",
          "thurs",
          "fri",
          "sat",
          "sun",
        ];
        const existingItem = acc.find(
          (item) =>
            item.initiativeId === current.initiativeId &&
            item.taskId === current.taskId
        ) as WeeklyTableRow;

        if (existingItem) {
          for (const day of days) {
            if (current[day] !== "") {
              existingItem[day] = current[day];
            }
          }

          let totalMinutes = 0;
          let hasWorkHours = false;

          for (const day of days) {
            const time = existingItem[day];
            if (typeof time === "string" && time !== "") {
              const [hours, minutes] = time.split(":").map(Number);
              totalMinutes += hours * 60 + minutes;
              hasWorkHours = true;
            }
          }

          if (hasWorkHours) {
            const totalHours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;
            existingItem.total = `${String(totalHours).padStart(
              2,
              "0"
            )}:${String(remainingMinutes).padStart(2, "0")}`;
          }
        } else {
          for (const day of days) {
            const dayWorkHour = current[day];
            if (typeof dayWorkHour === "string" && dayWorkHour !== "") {
              current.total = dayWorkHour;
              break;
            }
          }

          if (!current.total) {
            current.total = "00:00";
          }

          acc.push(current);
        }

        return acc;
      }, []);

    setFilteredData(filterData);
  }, [startDate, endDate, memberTasks?.data.memberTasks]);

  useEffect(() => {
    getFilteredData();
  }, [getFilteredData, startDate, endDate]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 mt-8">
      <div className="grid items-center grid-cols-[auto,1fr,auto] w-96 gap-5">
        <Button onClick={goToPreviousWeek} size={"icon"}>
          <Icons.chevronLeft />
        </Button>
        <div className="text-lg font-semibold text-center">{dateRange}</div>
        <Button onClick={goToNextWeek} size={"icon"}>
          <Icons.chevronRight />
        </Button>
      </div>

      {isLoading ? (
        <div className="min-h-[70vh] text-lg gap-2 flex justify-center items-center">
          <Loader /> <span>Loading...</span>
        </div>
      ) : (
        <WeeklyLogTable
          daysOfWeek={daysOfWeek}
          weekFirstDate={weekFirstDate}
          memberTasks={filteredData}
        />
      )}
    </div>
  );
};

export default WeeklyLog;
