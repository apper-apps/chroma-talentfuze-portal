import React from "react";
import { cn } from "@/utils/cn";

const Progress = React.forwardRef(({ 
  value = 0, 
  className, 
  color = "primary",
  size = "md",
  ...props 
}, ref) => {
  const colors = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error"
  };
  
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };
  
  return (
    <div
      ref={ref}
      className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizes[size], className)}
      {...props}
    >
      <div
        className={cn("transition-all duration-300 rounded-full", colors[color], sizes[size])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;