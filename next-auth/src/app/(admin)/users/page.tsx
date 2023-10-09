"use client";

import React from "react";
import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import RegisterUser from "@/components/forms/register-user-form";
import { Icons } from "@/components/icons";

const fetchAllUsers = async (auth) => {
  const { data } = await axios.get("/users", {
    headers: { Authorization: `Bearer ${auth?.token}` },
  });

  return data;
};

const Users = () => {
  const { data } = useQuery(["GET-USERS"], () => fetchAllUsers(auth));

  return (
    <div className="container py-8">
      <div className="grid grid-cols-[auto,1fr,auto] gap-4 mb-8 items-center">
        <h2 className="text-2xl">All Users</h2>
        <Input placeholder="searchUsers..." />
        <Dialog modal={data}>
          <DialogTrigger>
            <Button>
              <Icons.userPlus />
              &nbsp; Register User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <RegisterUser />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(384px,1fr))]">
        {data?.data.users.map((user: UserInfo) => {
          const startDate = moment(user.startDate);
          const endDate = moment(user.endDate);

          return (
            <Card key={user.userId}>
              <CardHeader className="grid grid-cols-[auto,1fr] gap-4 items-center">
                <Icons.userCircle2 size={60} />
                <div>
                  <h2 className="capitalize">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p>{user.email}</p>
                  <p className="capitalize">{user.Roles[0].roleName}</p>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between text-lg">
                <p>{startDate.format("MMM - YYYY")}</p>
                <p>{endDate.format("MMM - YYYY")}</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
