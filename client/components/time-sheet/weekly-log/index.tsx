import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import WeeklyLogTable from "./weekly-log-table";

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

      <WeeklyLogTable daysOfWeek={daysOfWeek} weekFirstDate={weekFirstDate} />
    </div>
  );
};

export default WeeklyLog;
