import React, { useEffect, useState } from "react"

import {
  useGetTimeSheetDataByDate,
} from "@/hooks/useFetchTasks"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import DailyLogTable from "./daily-log-table"
import { DailyLog } from "@/types"

const DailyLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate)
    previousDay.setDate(currentDate.getDate() - 1)
    setCurrentDate(previousDay)
  }

  const goToNextDay = () => {
    const nextDate = new Date(currentDate)
    nextDate.setDate(nextDate.getDate() + 1)
    setCurrentDate(nextDate)
  }

  const { data } = useGetTimeSheetDataByDate(currentDate)
  const [rows, setRows] = useState<DailyLog[]>([])

  useEffect(() => {
    console.log(data)
    if (data) {
      setRows(data);
    }
  }, [data]);
  return (
    <>
      <div className="flex flex-row gap-[5rem] text-theme-secondary justify-center my-8">
        <div className="flex items-center justify-between gap-2 px-5 w-96">
          <Button
            onClick={() => {
              goToPreviousDay()
            }}
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            <Icons.ChevronLeft />
            <span className="sr-only">Previous Day</span>
          </Button>

          <div className="col-span-7 text-center">
            {currentDate.toDateString() === new Date().toDateString()
              ? "Today"
              : currentDate.toDateString()}
          </div>

          <Button
            onClick={() => {
              goToNextDay()
            }}
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            <Icons["chevron-right"] />
            <span className="sr-only">Next Day</span>
          </Button>
        </div>
      </div>
      <DailyLogTable createdDate={currentDate} rows={rows} setRows={setRows}/>
    </>
  )
}

export default DailyLog
