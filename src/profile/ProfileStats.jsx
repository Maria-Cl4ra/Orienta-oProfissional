import React from "react";
import { TrendingUp, Zap, Users, UserPlus, GraduationCap, FolderKanban } from "lucide-react";

export default function ProfileStats({ level, xp, followers, following, mentorias, projects, theme }) {
  const xpForNext = (level || 1) * 100;
  const xpProgress = Math.min(100, ((xp || 0) / xpForNext) * 100);

  const stats = [
    { icon: TrendingUp, label: "Nível", value: level || 1 },
    { icon: Zap, label: "XP", value: xp || 0 },
    { icon: Users, label: "Seguidores", value: followers || 0 },
    { icon: UserPlus, label: "Seguindo", value: following || 0 },
    { icon: GraduationCap, label: "Mentorias", value: mentorias || 0 },
    { icon: FolderKanban, label: "Projetos", value: projects || 0 }
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-3 border-2 text-center transition-all hover:scale-105"
            style={{ borderColor: theme.light }}
          >
            <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: theme.primary }} />
            <p className="text-lg font-bold" style={{ color: theme.primary }}>{s.value}</p>
            <p className="text-xs" style={{ color: theme.primary, opacity: 0.6 }}>{s.label}</p>
          </div>
        );
      })}
      {/* XP progress bar spanning full width */}
      <div className="col-span-3 bg-white rounded-2xl p-3 border-2" style={{ borderColor: theme.light }}>
        <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: theme.primary }}>
          <span className="font-medium">Progresso para o nível {(level || 1) + 1}</span>
          <span className="font-bold">{xp || 0} / {xpForNext} XP</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: theme.light }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${xpProgress}%`, background: theme.primary }}
          />
        </div>
      </div>
    </div>
  );
}