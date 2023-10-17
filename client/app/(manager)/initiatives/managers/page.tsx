"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import { Initiative } from "@/types";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import useAuth from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddInitiativeTaskForm from "@/components/forms/add-initiative-task-form";
import { Icons } from "@/components/icons";

const fetchManagerInitiative = async (auth: any) => {
  const { data } = await axios.get(`/initiatives/users/${auth?.user.userId}`, {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const ManagerInitiatives = () => {
  const [open, setOpen] = useState(false);
  const [accordionState, setAccordionState] = useState("");

  const [selectedInitiativeId, setSelectedInitiativeId] = useState("");
  const [selectedInitiativeName, setSelectedInitiativeName] = useState("");
  const { auth } = useAuth();
  const router = useRouter();
  const { data: managerInitiatives } = useQuery(
    ["GET-MANAGER-INITIATIVES"],
    () => fetchManagerInitiative(auth)
  );

  return (
    <div className="container p-16 space-y-8">
      <h2 className="text-3xl">All Initiatives</h2>

      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(600px,1fr))]">
        {managerInitiatives?.data.initiativeMembers.map((member) => {
          const startDate = moment(member.startDate);
          const endDate = member.endDate ? moment(member.endDate) : null;

          return (
            <Card
              key={member.Initiative.initiativeId}
              className="grid content-between"
            >
              <CardHeader>
                <Accordion
                  type="single"
                  collapsible
                  className="relative"
                  value={accordionState}
                  onValueChange={setAccordionState}
                >
                  <AccordionItem value={member.Initiative.initiativeName}>
                    <div className="grid grid-cols-[1fr,auto,auto] gap-4 items-center">
                      <AccordionTrigger
                        onClick={() =>
                          setAccordionState(member.Initiative.initiativeName)
                        }
                      >
                        <CardTitle className="text-2xl tracking-wide uppercase">
                          {member.Initiative.initiativeName}
                        </CardTitle>
                      </AccordionTrigger>
                      <Button
                        onClick={() =>
                          router.push(
                            `/assign-users?initiativeId=${member.Initiative.initiativeId}&initiativeName=${member.Initiative.initiativeName}`
                          )
                        }
                        variant={"outline"}
                      >
                        Assign User
                      </Button>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                          onClick={() => {
                            setSelectedInitiativeName(
                              member.Initiative.initiativeName
                            );
                            setSelectedInitiativeId(
                              member.Initiative.initiativeId
                            );
                          }}
                          className={buttonVariants({
                            variant: "default",
                            size: "sm",
                          })}
                        >
                          <Icons.plus size={16} /> Assign task
                        </DialogTrigger>
                        <DialogContent>
                          <AddInitiativeTaskForm
                            selectedInitiativeName={selectedInitiativeName}
                            selectedInitiativeId={selectedInitiativeId}
                            afterSave={() => setOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <AccordionContent className="absolute z-50 p-4 pb-0 text-lg rounded-lg bg-secondary">
                      {member.Initiative.initiativeDescription}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <Icons.calendar />
                    <p className="font-medium">
                      {startDate.format("MMM - DD")}
                    </p>
                  </div>
                  <span>-</span>
                  <div className="flex gap-2">
                    <Icons.calendar />
                    <p className="font-medium">
                      {endDate?.format("MMM - DD") ?? "Now"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Icons.user2 />
                  <h3 className="text-lg capitalize">
                    {member.Initiative.createdBy}
                  </h3>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ManagerInitiatives;
