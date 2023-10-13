"use client";

import { useState } from "react";
import axios from "@/api/axios";
import { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import useAuth from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddTaskForm from "@/components/forms/add-task-form";
import { Icons } from "@/components/icons";

const fetchAllTasks = async (auth: any) => {
  const { data } = await axios.get("/tasks", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  return data;
};

const GetAllTasks = () => {
  const [open, setOpen] = useState(false);
  const [accordionState, setAccordionState] = useState("");
  const { auth } = useAuth();
  const { data: tasks } = useQuery(["GET-ALL-TASKS"], () =>
    fetchAllTasks(auth)
  );

  return (
    <div className="container p-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">All Tasks</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={buttonVariants({
              variant: "default",
            })}
          >
            <Icons.plus /> Create Task
          </DialogTrigger>
          <DialogContent>
            <AddTaskForm afterSave={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(600px,1fr))]">
        {tasks?.data.map((task: Task) => {
          const createdDate = moment(task.createdAt);

          return (
            <Card key={task.taskId} className="grid content-between">
              <CardHeader>
                <Accordion
                  type="single"
                  collapsible
                  className="relative"
                  value={accordionState}
                  onValueChange={setAccordionState}
                >
                  <AccordionItem value={task.taskName}>
                    <AccordionTrigger
                      onClick={() => setAccordionState(task.taskName)}
                    >
                      <CardTitle className="text-2xl tracking-wide uppercase">
                        {task.taskName}
                      </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="absolute z-50 p-4 pb-0 text-lg rounded-lg bg-secondary">
                      {task.taskDescription}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Icons.calendar />

                  <p className="text-lg font-medium">
                    {createdDate.format("MMM - DD")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Icons.user2 />
                  <h3 className="text-lg capitalize">{task.createdBy}</h3>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GetAllTasks;
