import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={20} 
      />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;