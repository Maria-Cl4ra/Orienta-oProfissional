import React from "react";
import { cn } from "@/lib/utils";

export default function Avatar({ src, name, size = 40, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || ""}
        className={cn("rounded-full object-cover ring-2 ring-owl-purpleLight/30", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className={cn("rounded-full bg-owl-purpleLight/40 flex items-center justify-center font-bold text-owl-navy ring-2 ring-owl-purpleLight/30", className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}