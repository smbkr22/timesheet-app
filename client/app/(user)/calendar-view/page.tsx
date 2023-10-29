"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import {
  Calendar,
  Event,
  EventProps,
  momentLocalizer,
} from "react-big-calendar";
import { CSSTransition } from "react-transition-group";

import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

import useAuth from "@/hooks/useAuth";
import useOutsideClick from "@/hooks/useOutsideClick";
import Loader from "@/components/ui/loader";

interface TableRow {
  createdAt: Date;
  id: number;
  initiativeName: string;
  taskName: string;
  description: string;
  workHours: string;
  error: boolean;
  isSaved: boolean;
}

interface MyEvents {
  start: Date;
  end: Date;
  data: {
    createdAt: Date;
    initiativeName: string;
    taskName: string;
    description: string;
    workHours: string;
  };
}

interface GroupedEvent {
  date: string;
  totalWorkHours: moment.Duration;
  events: MyEvents[];
}

const localizer = momentLocalizer(moment);
const fetchAllMemberTasks = async (auth) => {
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
    const eventData = data?.data?.memberTasks.map((d: TableRow) => {
      return {
        start: moment(d.createdAt).toDate(),
        end: moment(d.createdAt).toDate(),
        data: {
          createdAt: d.createdAt,
          initiativeName: d.initiativeName,
          taskName: d.taskName,
          workHours: d.workHours,
        },
      };
    });

    return eventData ?? [];
  }, [data]);

  const [currentMonth, setCurrentMonth] = useState(moment());
  const handleNavigate = (newDate: Date) => {
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
        if (event.data.initiativeName === "Leave") {
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
        if (event.data.initiativeName === "Holiday") {
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

export interface MonthlyWorkHourProps {
  currentMonth: any;
}

const MonthlyWorkHour = (props: MonthlyWorkHourProps) => {
  const { currentMonth } = props;

  const calculateWorkHoursForMonth = (startOfMonth: Date, endOfMonth: Date) => {
    const weekends = [6, 0];

    let currentDate = moment(startOfMonth);
    const end = moment(endOfMonth);

    let totalWorkHours = 0;

    while (currentDate.isSameOrBefore(end, "day")) {
      if (!weekends.includes(currentDate.day())) {
        totalWorkHours += 8;
      }
      currentDate.add(1, "day");
    }

    return totalWorkHours;
  };

  const startOfMonth = currentMonth.startOf("month").toDate();
  const endOfMonth = currentMonth.endOf("month").toDate();
  const workHours = calculateWorkHoursForMonth(startOfMonth, endOfMonth);

  return (
    <div className="pl-2 text-xl border-l-4 border-orange-600 text-theme-secondary">
      {currentMonth.format("MMMM YYYY")}: {workHours} hours
    </div>
  );
};

enum SpecialDayCode {
  Leave = "L",
  Holiday = "HL",
}

const EVENT_TYPES_COLORS = {
  L: "#bee2fa",
  HL: "#f80000",
};

export interface MyEvent extends Event {
  data?: any;
}

function CalendarEventComponent({
  event: { title, data },
}: EventProps<MyEvent>) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const ref = useRef(null);
  useOutsideClick(ref, () => {
    setShowDetails(false);
    setShowEventDetails(false);
  });

  return (
    <div
      ref={ref}
      className="relative w-full group"
      onClick={() => setShowDetails(true)}
    >
      <p className="overflow-hidden text-ellipsis whitespace-nowrap !text-theme-primary">
        {data.totalWorkHours}
      </p>
      <CSSTransition
        in={showDetails}
        classNames="fly"
        timeout={150}
        unmountOnExit
      >
        <div className="absolute !h-auto z-[9999] w-[340px] flex flex-col gap-4 top-0 bg-theme-background-popup p-4 shadow-lg rounded-md">
          {data.events.map((event: any, index: number) => (
            <>
              <div
                key={index}
                className="p-2 rounded-lg bg-theme-background-body"
                onClick={() => setShowEventDetails(true)}
              >
                {event.data.taskName} - {event.data.workHour} hrs
              </div>
            </>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
}
