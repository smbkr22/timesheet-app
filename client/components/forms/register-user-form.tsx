"use client";

import axios from "@/api/axios";
import { Label } from "@radix-ui/react-label";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const REGISTER_URL = "users/signup";

type RegisterUserProps = {
  afterSave: () => void;
};

const RegisterUser = (props: RegisterUserProps) => {
  const { afterSave } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const queryClient = useQueryClient();

  const onSubmit = async (data: FieldValues) => {
    const response = await axios.post(REGISTER_URL, data);

    if (response.status === 201) {
      toast("New User was Created");
      queryClient.invalidateQueries(["GET-USERS"]);
    }
    reset();
    afterSave();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center space-y-4 "
    >
      <div className="w-full space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          {...register("firstName", {
            required: "FirstName is required",
          })}
          id="firstName"
          placeholder="firstName..."
        />
        {errors.firstName && (
          <p className="text-sm text-red-600">{`${errors.firstName.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          {...register("lastName", {
            required: "LastName is required",
          })}
          id="lastName"
          placeholder="lastName..."
        />
        {errors.lastName && (
          <p className="text-sm text-red-600">{`${errors.lastName.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          id="email"
          placeholder="email..."
        />
        {errors.email && (
          <p className="text-sm text-red-600">{`${errors.email.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          {...register("contactNumber", {
            required: "ContactNumber is required",
            pattern: {
              value: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
              message: "Invalid phone number",
            },
          })}
          type="contactNumber"
          id="contactNumber"
          placeholder="contactNumber..."
        />
        {errors.contactNumber && (
          <p className="text-sm text-red-600">{`${errors.contactNumber.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label>Role</Label>
        <RadioGroup defaultValue="user" className="flex gap-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem {...register("role")} value="user" id="user" />
            <Label htmlFor="user">User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              {...register("role")}
              value="manager"
              id="manager"
            />
            <Label htmlFor="manager">Manager</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem {...register("role")} value="admin" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
        </RadioGroup>
        {errors.contactNumber && (
          <p className="text-sm text-red-600">{`${errors.contactNumber.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          type="password"
          id="password"
          placeholder="password..."
        />
        {errors.password && (
          <p className="text-sm text-red-600">{`${errors.password.message}`}</p>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="passwordConfirm">Confirm Password</Label>
        <Input
          {...register("passwordConfirm", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues("password") || "Password must watch",
          })}
          type="password"
          id="passwordConfirm"
          placeholder="passwordConfirm..."
        />
        {errors.passwordConfirm && (
          <p className="text-sm text-red-600">{`${errors.passwordConfirm.message}`}</p>
        )}
      </div>
      <Button disabled={isSubmitting} type="submit" className="w-full">
        {isSubmitting ? <Loader /> : null}
        Sign Up
      </Button>
    </form>
  );
};

export default RegisterUser;
