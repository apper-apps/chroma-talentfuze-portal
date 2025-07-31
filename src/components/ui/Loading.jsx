import React from "react";
import { cn } from "@/utils/cn";

const LoadingSkeleton = ({ className, ...props }) => (
  <div
    className={cn("animate-pulse rounded-lg bg-gray-200", className)}
    {...props}
  />
);

const Loading = ({ type = "default", className }) => {
  if (type === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg card-shadow p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <LoadingSkeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            </div>
            <LoadingSkeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <LoadingSkeleton className="h-6 w-16" />
              <LoadingSkeleton className="h-6 w-20" />
              <LoadingSkeleton className="h-6 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-surface rounded-lg">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-1/6" />
            <LoadingSkeleton className="h-4 w-1/5" />
            <LoadingSkeleton className="h-4 w-1/6" />
            <LoadingSkeleton className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;