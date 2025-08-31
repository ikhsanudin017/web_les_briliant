import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-brand text-white hover:opacity-90",
      outline: "border hover:bg-gray-50 dark:hover:bg-gray-900",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-900"
    } as const;
    return (
      <button ref={ref} className={cn(base, variants[variant], "h-9 px-4", className)} {...props} />
    );
  }
);
Button.displayName = "Button";

