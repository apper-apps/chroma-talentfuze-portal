import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-lg card-shadow p-6",
        hover && "transition-all duration-200 hover:card-shadow-hover hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;