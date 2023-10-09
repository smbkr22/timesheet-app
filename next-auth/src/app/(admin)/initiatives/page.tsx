"use client";

import React from "react";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddInitiativeForm from "@/components/forms/add-initiative-form";
import { Icons } from "@/components/icons";

const fetchAllInitiatives = async (auth) => {
  const { data } = await axios.get("/initiatives", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  return data;
};

const ViewAllInitiatives = () => {
  const { data } = useQuery(["GET-INITIATIVES"], () =>
    fetchAllInitiatives(auth)
  );

  return (
    <div className="container p-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">All Initiatives</h2>
        <Dialog>
          <DialogTrigger>
            <Button>
              <Icons.plus /> Create Initiative
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddInitiativeForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(600px,1fr))]">
        {data?.data.map((initiative) => {
          const createdDate = moment(initiative.createdAt);

          return (
            <Card
              key={initiative.initiativeId}
              className="grid content-between"
            >
              <CardHeader>
                <Accordion type="single" collapsible className="relative">
                  <AccordionItem value="value-1">
                    <AccordionTrigger>
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
                  <h3 className="text-lg capitalize">{initiative.createdBy}</h3>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ViewAllInitiatives;
