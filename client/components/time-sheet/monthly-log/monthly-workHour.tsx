import moment, { Moment } from "moment";

export interface MonthlyWorkHourProps {
  currentMonth: Moment;
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

export default MonthlyWorkHour;
