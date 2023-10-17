"use client";

import { useState } from "react";
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
import { buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddInitiativeForm from "@/components/forms/add-initiative-form";
import { Icons } from "@/components/icons";

const fetchAllInitiatives = async (auth: any) => {
  const { data } = await axios.get("/initiatives", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  return data;
};

const GetAllInitiatives = () => {
  const [open, setOpen] = useState(false);
  const [accordionState, setAccordionState] = useState("");
  const { auth } = useAuth();
  const { data: initiatives } = useQuery(["GET-INITIATIVES"], () =>
    fetchAllInitiatives(auth)
  );

  return (
    <div className="container p-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">All Initiatives</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={buttonVariants({
              variant: "default",
            })}
          >
            <Icons.plus /> Create Initiative
          </DialogTrigger>
          <DialogContent>
            <AddInitiativeForm afterSave={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(600px,1fr))]">
        {initiatives?.data.map((initiative: Initiative) => {
          const createdDate = moment(initiative.createdAt);

          return (
            <Card
              key={initiative.initiativeId}
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
                  <AccordionItem value={initiative.initiativeName}>
                    <AccordionTrigger
                      onClick={() =>
                        setAccordionState(initiative.initiativeName)
                      }
                    >
                      <CardTitle className="text-2xl tracking-wide uppercase">
                        {initiative.initiativeName}
                      </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="absolute z-50 p-4 pb-0 text-lg rounded-lg bg-secondary">
                      {initiative.initiativeDescription}
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

                  <GetManagerName
                    key={initiative.initiativeId}
                    initiativeId={initiative.initiativeId}
                  />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GetAllInitiatives;

const fetchManager = async (initiativeId: string) => {
  const { data } = await axios.get(
    `/initiativeMembers/initiatives/${initiativeId}`
  );

  return data;
};

const GetManagerName = ({ initiativeId }: { initiativeId: string }) => {
  const { data: managers } = useQuery(
    ["GET-INITIATIVE-MANAGER", initiativeId],
    () => fetchManager(initiativeId)
  );

  return (
    <h3 className="text-lg capitalize">
      {managers?.data.user.firstName} {managers?.data.user.lastName}
    </h3>
  );
};
