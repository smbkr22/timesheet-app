"use client";

import { ChangeEvent, useState } from "react";
import axios from "@/api/axios";
import { UserInfo } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

import useAuth from "@/hooks/useAuth";
import { buttonVariants } from "@/components/ui/button";
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
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const { data } = useQuery(["GET-ALL-USERS"], () => fetchAllUsers(auth), {
    select: (data) => data.data.users,
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    queryClient.setQueryData(["GET-USERS"], (data) => {
      const filteredData =
        data?.data.users.filter((user: UserInfo) =>
          user.firstName.toLowerCase().includes(e.target.value.toLowerCase())
        ) ?? [];

      console.log(filteredData);
      // return filteredData;
    });
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-[auto,1fr,auto] gap-4 mb-8 items-center">
        <h2 className="text-2xl">All Users</h2>
        <Input
          type="search"
          placeholder="searchUsers..."
          onChange={handleSearch}
          className="bg-secondary text-secondary-foreground"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={buttonVariants({
              variant: "default",
            })}
          >
            <Icons.userPlus />
            &nbsp; Register User
          </DialogTrigger>
          <DialogContent>
            <RegisterUser afterSave={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fit,minmax(384px,420px))]">
        {data?.map((user: UserInfo) => {
          const startDate = moment(user.startDate);
          const endDate = moment(user.endDate);

          return (
            <Card
              key={user.userId}
              className="p-8 transition-all bg-secondary text-secondary-foreground hover:bg-accent hover:cursor-pointer hover:scale-105"
            >
              <p className="font-mono text-xl uppercase">
                {user.Roles[0].roleName}
              </p>
              <CardHeader className="flex flex-col items-center justify-center p-0 py-4">
                <Icons.userCircle2 size={82} />

                <h2 className="text-xl font-semibold capitalize">
                  {user.firstName} {user.lastName}
                </h2>
              </CardHeader>
              <CardFooter className="flex justify-between p-0">
                <div>
                  <p className="flex items-center gap-2">
                    <Icons.mail size={16} />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Icons.phone size={16} />
                    {user.contactNumber}
                  </p>
                </div>
                <div>
                  <p>{startDate.format("MMM - YYYY")}</p>
                  <p>{endDate.format("MMM - YYYY")}</p>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
