import React from "react";
import OwlMascot from "@/components/OwlMascot";
import { cn } from "@/lib/utils";

export default function Logo({ showMascot = true, size = "md", variant = "default", className = "" }) {
  const sizes = {
    sm: { mascot: 28, text: "text-lg", owl: "text-xl" },
    md: { mascot: 36, text: "text-2xl", owl: "text-3xl" },
    lg: { mascot: 52, text: "text-4xl", owl: "text-5xl" }
  };
  const s = sizes[size] || sizes.md;

  const mentorColor = variant === "light" ? "text-white" : "text-owl-navy";
  const owlColor = variant === "light" ? "text-owl-purpleLight" : "text-owl-purple";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showMascot && <OwlMascot size={s.mascot} />}
      <div className={cn("font-heading font-extrabold leading-none", s.text, mentorColor)}>
        Mentor
        <span className={cn("font-script font-bold", s.owl, owlColor)}>Owl</span>
      </div>
    </div>
  );
}