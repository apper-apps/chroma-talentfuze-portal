import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SkillRating = ({ skill, rating, onRatingChange, readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-secondary">{skill}</span>
      <div className="flex items-center space-x-1">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            className={cn(
              "transition-colors duration-200",
              !readonly && "hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <ApperIcon
              name="Star"
              size={16}
              className={cn(
                "transition-colors duration-200",
                star <= rating
                  ? "text-warning fill-warning"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SkillRating;