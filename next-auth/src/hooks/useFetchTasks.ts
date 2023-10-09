import { DailyLog } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchTimeSheetTasks = async () => {
  const { data } = await axios.get("http://localhost:4000/tasks");

  return data;
};

// const fetchTimeSheetTasksByDate = async (currentDate: Date) => {
//   const { data } = await axios.get(
//     `http://localhost:4000/tasks?createdAt[gte]=${currentDate}`
//   )

//   return data
// }

export const useGetTimeSheetData = () => {
  const timeSheetData = useQuery(["GET-TASKS"], fetchTimeSheetTasks);

  return timeSheetData;
};

export const useGetTimeSheetDataByDate = (date: Date) => {
  const timeSheetData = useQuery(["GET-TASKS-BY-DATE"], fetchTimeSheetTasks, {
    select: (data) =>
      data.filter(
        (task: any) =>
          task.createdAt.split("T")[0] === date.toISOString().split("T")[0]
      ),
  });

  return timeSheetData;
};

export const useCreateTimeSheetTask = () => {
  const queryClient = useQueryClient();

  const timeSheetData = useMutation(
    async (row: DailyLog) => {
      const { data } = await axios.post("http://localhost:4000/tasks", row);

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET-TASKS-BY-DATE"] });
      },
    }
  );

  return timeSheetData;
};
