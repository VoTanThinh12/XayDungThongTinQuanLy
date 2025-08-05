import React from "react";

export function Progress({ value = 0, className = "", ...props }) {
  return (
    <div className={`overflow-hidden rounded-full bg-gray-200 ${className}`} {...props}>
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
