"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Calendar, Event, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/ui/loader";

import CalendarEventComponent from "./calendar-event-component";
import MonthlyWorkHour from "./monthly-workHour";

type GetMemberTasksResponse = {
  memberTaskId: string;
  userId: string;
  initiativeTaskId: string;
  taskStatus: string;
  startDate: string;
  endDate: string;
  workHours: string;
  createdAt: string;
  updatedAt: string;
  initiativeId: string;
  taskId: string;
};

interface MyEvents {
  start: Date;
  end: Date;
  data: {
    createdAt: string;
    initiativeId: string;
    taskId: string;
    workHours: string;
  };
}

interface GroupedEvent {
  date: string;
  totalWorkHours: moment.Duration;
  events: MyEvents[];
}

const localizer = momentLocalizer(moment);
const fetchAllMemberTasks = async (auth: any) => {
  const { data } = await axios.get("/memberTasks", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};
const WeeklyLogCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { auth } = useAuth();
  const { isFetched, isLoading, isError, data } = useQuery(
    ["GET-MEMBER-TASKS"],
    () => fetchAllMemberTasks(auth)
  );

  const myEventsList: MyEvents[] = useMemo(() => {
    const eventData = data?.data?.memberTasks.map(
      (d: GetMemberTasksResponse) => {
        return {
          start: moment(d.createdAt).toDate(),
          end: moment(d.createdAt).toDate(),
          data: {
            createdAt: d.createdAt,
            initiativeId: d.initiativeId,
            taskId: d.taskId,
            workHours: d.workHours,
          },
        };
      }
    );

    return eventData ?? [];
  }, [data]);

  const [currentMonth, setCurrentMonth] = useState(moment());
  const handleNavigate = (newDate: Date) => {
    console.log(newDate);
    setCurrentMonth(moment(newDate));
  };

  const [leavesTaken, setLeavesTaken] = useState("00:00");
  const [holidaysTaken, setHolidaysTaken] = useState("00:00");
  const [totalWorkHour, setTotalWorkHour] = useState("00:00");
  const getCurrentMonthEvents = () => {
    const filteredEvents = myEventsList.filter((event) => {
      const eventMonth = moment(event.start).month();
      return eventMonth === currentMonth.month();
    });

    const leaveMinutes = filteredEvents
      .map((event) => {
        if (event.data.initiativeId === "Leave") {
          return event.data.workHours;
        }

        return;
      })
      .filter((el) => el !== undefined)
      .reduce((total, time = "00:00") => {
        const [hours, minutes] = time.split(":");
        return total + parseInt(hours) * 60 + parseInt(minutes);
      }, 0);

    const holidayMinutes = filteredEvents
      .map((event) => {
        if (event.data.initiativeId === "Holiday") {
          return event.data.workHours;
        }

        return;
      })
      .filter((el) => el !== undefined)
      .reduce((total, time = "00:00") => {
        const [hours, minutes] = time.split(":");
        return total + parseInt(hours) * 60 + parseInt(minutes);
      }, 0);

    let totalMinutes = filteredEvents
      .map((event) => event.data.workHours)
      .filter((el) => el !== "")
      .reduce((total, time) => {
        const [hours, minutes] = time.split(":");
        return total + parseInt(hours) * 60 + parseInt(minutes);
      }, 0);

    totalMinutes = totalMinutes - leaveMinutes - holidayMinutes;

    formatTime(leaveMinutes, "leave");
    formatTime(holidayMinutes, "holiday");
    formatTime(totalMinutes, "total");
  };

  const formatTime = (min: number, hourType: string) => {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    if (hourType === "leave") {
      setLeavesTaken(formattedTime);
    }

    if (hourType === "holiday") {
      setHolidaysTaken(formattedTime);
    }
    if (hourType === "total") {
      setTotalWorkHour(formattedTime);
    }
  };

  const groupEventsByDay = (events: MyEvents[]) => {
    const groupedEvents: { [key: string]: GroupedEvent } = events.reduce(
      (acc, event) => {
        const eventDate = moment(event.start).format("YYYY-MM-DD");
        const workHourArray = event.data.workHours.split(":");
        const workHourDuration = moment.duration({
          hours: parseInt(workHourArray[0], 10),
          minutes: parseInt(workHourArray[1], 10),
        });

        if (!acc[eventDate]) {
          acc[eventDate] = {
            date: eventDate,
            totalWorkHours: workHourDuration,
            events: [],
          };
        } else {
          acc[eventDate].totalWorkHours.add(workHourDuration);
        }
        acc[eventDate].events.push(event);
        return acc;
      },
      {}
    );

    return Object.values(groupedEvents).map((group) => {
      const totalWorkHours = moment
        .utc(group.totalWorkHours.asMilliseconds())
        .format("HH:mm");

      return {
        start: moment(group.date).toDate(),
        end: moment(group.date).toDate(),
        data: {
          totalWorkHours,
          events: group.events,
        },
      };
    });
  };

  useEffect(() => {
    getCurrentMonthEvents();
  }, [currentMonth]);

  useEffect(() => {
    const groupedEvents = groupEventsByDay(myEventsList);
    setEvents(groupedEvents);
  }, [myEventsList]);

  return (
    <div className="flex flex-col items-center p-16 ">
      {isLoading && (
        <div className="flex items-center justify-center gap-2 h-[calc(100vh-220px)]">
          <Loader />
          <span className="text-xl text-theme-secondary">Loading...</span>
        </div>
      )}

      {isFetched && !isError && (
        <>
          <Calendar
            popup
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={["month"]}
            className="w-full my-8 custom-calendar"
            components={{ event: CalendarEventComponent }}
            onNavigate={handleNavigate}
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-8 ">
              <div className="pl-2 text-xl border-l-4 border-blue-600 text-theme-secondary">
                Logged Hours - {totalWorkHour ? totalWorkHour : `00:00`} hrs
              </div>
              <div className="pl-2 text-xl border-l-4 border-red-600 text-theme-secondary">
                Leave - {leavesTaken ? leavesTaken : 0} hrs
              </div>
              <div className="pl-2 text-xl border-l-4 border-green-600 text-theme-secondary">
                Holiday - {holidaysTaken ? holidaysTaken : 0} hrs
              </div>
            </div>

            <MonthlyWorkHour currentMonth={currentMonth} />
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyLogCalendar;
