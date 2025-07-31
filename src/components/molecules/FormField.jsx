import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className,
  children,
  ...props 
}) => {
  const inputId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      {children || <Input id={inputId} error={!!error} {...props} />}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;