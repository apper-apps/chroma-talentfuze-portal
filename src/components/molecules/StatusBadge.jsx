import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    active: { 
      variant: "success", 
      label: "Active", 
      icon: "CheckCircle" 
    },
    pending: { 
      variant: "warning", 
      label: "Pending", 
      icon: "Clock" 
    },
    completed: { 
      variant: "primary", 
      label: "Completed", 
      icon: "Check" 
    },
    draft: { 
      variant: "default", 
      label: "Draft", 
      icon: "Edit" 
    },
    matched: { 
      variant: "accent", 
      label: "Matched", 
      icon: "Users" 
    }
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {showIcon && <ApperIcon name={config.icon} size={12} />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;