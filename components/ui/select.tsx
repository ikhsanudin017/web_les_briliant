import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn("h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand", className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

