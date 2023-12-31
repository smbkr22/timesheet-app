"use client";

import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import { Label } from "@radix-ui/react-label";
import { Loader } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form";

import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const REGISTER_URL = "users/signup";

const RegisterUser = () => {
  const { setAuth } = useAuth();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const response = await axios.post(REGISTER_URL, data);
    console.log(response.data);
    reset();
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
        <div className="flex flex-row gap-4">
          <Label htmlFor="user">
            <input {...register("role")} type="radio" value="user" id="user" />
            User
          </Label>
          <Label htmlFor="manager">
            <input
              {...register("role")}
              type="radio"
              value="manager"
              id="manager"
            />
            Manager
          </Label>
          <Label htmlFor="admin">
            <input
              {...register("role")}
              type="radio"
              value="admin"
              id="admin"
            />
            Admin
          </Label>
        </div>
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
