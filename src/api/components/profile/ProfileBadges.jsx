import React from "react";
import { PROFILE_BADGES, getBadge } from "@/lib/profileBadges";

export default function ProfileBadges({ highlightedBadges, isAdmin, theme }) {
  let badges = (highlightedBadges || []).map(getBadge).filter(Boolean);

  // ADM badge always shows for admins
  if (isAdmin) {
    const adm = getBadge("adm");
    if (adm && !badges.find(b => b.key === "adm")) badges.unshift(adm);
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(b => {
        const Icon = b.icon;
        return (
          <div
            key={b.key}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 animate-fade-in"
            style={{ borderColor: b.color, color: b.color, background: `${b.color}10` }}
          >
            <Icon className="w-3.5 h-3.5" />
            {b.label}
          </div>
        );
      })}
    </div>
  );
}