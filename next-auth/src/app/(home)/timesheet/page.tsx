"use client";

import React, { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DailyLog from "@/components/time-sheet/daily-log";
import WeeklyLog from "@/components/time-sheet/weekly-log";

const DATA = [
  {
    id: "asfsdfsdfs",
    name: "Daily Log",
  },
  {
    id: "asfsdfsdfs-afsfsf",
    name: "Weekly Log",
  },
  {
    id: "asfsdfsdfs-asfsferfsfsf",
    name: "Monthly Log",
  },
];

const LogTypeSelector = () => {
  const [selectedType, setSelectedType] = useState("Daily Log");

  const logOptions = useMemo(
    () =>
      DATA.map(({ id, name }) => ({
        label: name,
        value: name,
      })),
    []
  );

  return (
    <>
      <div className="flex justify-end m-8">
        <Select
          defaultValue={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Log Type" />
          </SelectTrigger>
          <SelectContent>
            {logOptions.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedType === "Daily Log" && <DailyLog />}
      {selectedType === "Weekly Log" && <WeeklyLog />}
      {/* {selectedType === "Monthly Log" && <MonthlyLog />} */}
    </>
  );
};

export default LogTypeSelector;
