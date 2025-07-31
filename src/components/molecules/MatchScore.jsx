import React from "react";
import { cn } from "@/utils/cn";

const MatchScore = ({ score, size = "md", className }) => {
  const sizes = {
    sm: { container: "w-12 h-12", text: "text-xs", stroke: "4" },
    md: { container: "w-16 h-16", text: "text-sm", stroke: "6" },
    lg: { container: "w-20 h-20", text: "text-base", stroke: "8" }
  };
  
  const currentSize = sizes[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className={cn("relative flex items-center justify-center", currentSize.container, className)}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={currentSize.stroke}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={currentSize.stroke}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B4FF0" />
            <stop offset="100%" stopColor="#00D4AA" />
          </linearGradient>
        </defs>
      </svg>
      <div className={cn("absolute inset-0 flex items-center justify-center font-bold gradient-text", currentSize.text)}>
        {score}%
      </div>
    </div>
  );
};

export default MatchScore;