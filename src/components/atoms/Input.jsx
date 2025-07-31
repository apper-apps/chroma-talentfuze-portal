import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;