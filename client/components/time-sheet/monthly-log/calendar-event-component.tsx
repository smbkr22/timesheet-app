import { useRef, useState } from "react";
import { EventProps } from "react-big-calendar";
import { CSSTransition } from "react-transition-group";

import useOutsideClick from "@/hooks/useOutsideClick";

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

function CalendarEventComponent({ event: { data } }: EventProps<MyEvent>) {
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
      onClick={() => setShowDetails(!showDetails)}
    >
      <p className="!text-primary-foreground truncate">{data.totalWorkHours}</p>
      <CSSTransition
        in={showDetails}
        classNames="fly"
        timeout={150}
        unmountOnExit
      >
        <div className="absolute !h-auto z-[9999] w-[340px] flex flex-col gap-4 top-8 bg-background p-4 shadow-lg rounded-md">
          {data?.events?.map((event: any, index: number) => (
            <>
              <div
                key={index}
                className="p-2 break-words rounded-lg"
                onClick={() => setShowEventDetails(true)}
              >
                {event.data.taskId} - {event.data.workHours} hrs
              </div>
            </>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
}

export default CalendarEventComponent;
