import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary/50",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    accent: "bg-accent hover:bg-accent/90 text-white focus:ring-accent/50",
    ghost: "text-secondary hover:bg-secondary/10 focus:ring-secondary/50",
    danger: "bg-error hover:bg-error/90 text-white focus:ring-error/50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;