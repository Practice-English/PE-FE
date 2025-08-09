"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input as ShadInput } from "@/components/ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  label?: string;
  hint?: string;
  error?: string;
}

const baseContainerStyles = "mt-1 relative";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      label,
      hint,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className={cn(baseContainerStyles)}>
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <ShadInput
            ref={ref}
            className={cn(leftIcon && "pl-10", rightIcon && "pr-10", className)}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

type PasswordInputProps = Omit<InputProps, "type" | "rightIcon">;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ leftIcon, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      leftIcon={leftIcon}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label="Toggle password visibility"
          className="outline-none"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";
