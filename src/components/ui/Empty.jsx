import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "Search",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="text-primary" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-secondary mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;