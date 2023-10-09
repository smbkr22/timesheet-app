"use client";

import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import { signIn } from "next-auth/react";
import { useForm, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";

const LOGIN_URL = "/users/login";

const SignIn = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-65px)]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center p-8 space-y-4 border-2 w-96 rounded-xl border-border"
      >
        <div className="w-full space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email", {
              required: "Email is required",
            })}
            type="email"
            id="email"
            placeholder="email..."
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{`${errors.email.message}`}</p>
          )}
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            id="password"
            placeholder="password..."
          />
          {errors.password && (
            <p className="text-sm text-red-600">{`${errors.password.message}`}</p>
          )}
        </div>
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? <Loader /> : null}
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
