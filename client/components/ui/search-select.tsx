"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type selectItemType = {
  value: string;
  label: string;
};

type searchSelectProps = {
  fieldName: string;
  selectItems: selectItemType[];
  className?: string;
  placeholder?: string;
};

export function SearchSelect(props: searchSelectProps) {
  const { placeholder, fieldName, className, selectItems } = props;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? selectItems.find((el) => el.value === value)?.label
            : `Select ${fieldName}...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No {fieldName} found.</CommandEmpty>
          <CommandGroup>
            {selectItems.map((el) => (
              <CommandItem
                key={el.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === el.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {el.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
