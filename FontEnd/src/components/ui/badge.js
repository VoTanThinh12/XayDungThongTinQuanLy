import React from "react";

export function Badge({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    outline: "border border-gray-300 bg-white text-gray-700",
    destructive: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
    secondary: "bg-gray-400 text-white",
  };
  return (
    <span className={`inline-block px-2 py-1 rounded ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </span>
  );
}
