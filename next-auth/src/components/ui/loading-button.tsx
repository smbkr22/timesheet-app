"use client";

import * as React from "react";

// import { experimental_useFormStatus as useFormStatus } from "react-dom"

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";
import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // const { pending } = useFormStatus()
    const mounted = useMounted();

    const pending = true;

    if (!mounted)
      return (
        <Skeleton
          className={cn(
            buttonVariants({ variant, size, className }),
            "bg-muted text-muted-foreground"
          )}
        >
          {props.children}
        </Skeleton>
      );

    return (
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      >
        {pending && (
          <Icons.spinner
            className="w-4 h-4 mr-2 animate-spin"
            aria-hidden="true"
          />
        )}
        {props.children}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
