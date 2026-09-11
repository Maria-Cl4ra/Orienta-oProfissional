import React from "react";
import { Pencil, UserPlus, UserCheck, MessageCircle, GraduationCap, Bookmark } from "lucide-react";
import Avatar from "@/components/Avatar";

export default function ProfileHeader({ profile, theme, isOwn, isFollowing, onFollow, onMessage, onMentor, onSaved, isAdmin }) {
  const isMentor = profile.role === "Mentor" || profile.role === "Estudante e Mentor";
  const roles = [];
  if (profile.role) roles.push(profile.role);
  if (isAdmin) roles.push("ADM");

  const btnPrimary = { background: theme.primary, color: "#fff" };
  const btnOutline = { border: `2px solid ${theme.primary}`, color: theme.primary };

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="h-32 md:h-52 w-full"
        style={{
          background: profile.cover_url
            ? `url(${profile.cover_url}) center/cover`
            : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
        }}
      />

      {/* Info */}
      <div className="px-4 md:px-8 -mt-12 md:-mt-16 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Avatar */}
          <div
            className="rounded-full p-1.5 bg-white shadow-lg inline-flex flex-shrink-0"
            style={{ border: `3px solid ${theme.primary}` }}
          >
            <Avatar src={profile.avatar_url} name={profile.full_name} size={96} className="ring-0" />
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.primary }}>
                {profile.full_name}
              </h1>
              {roles.map(r => (
                <span
                  key={r}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: theme.light, color: theme.primary }}
                >
                  {r === "ADM" ? "ADM" : <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{r}</span>}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium" style={{ color: theme.accent }}>@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm mt-1.5 max-w-lg leading-relaxed" style={{ color: theme.primary, opacity: 0.7 }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pb-2">
            {isOwn ? (
              <>
                <button
                  onClick={onSaved}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 bg-white"
                  style={btnOutline}
                >
                  <Bookmark className="w-4 h-4" /> Salvos
                </button>
                <button
                  onClick={onMessage}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
                  style={btnPrimary}
                >
                  <Pencil className="w-4 h-4" /> Editar Perfil
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onFollow}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
                  style={isFollowing ? btnOutline : btnPrimary}
                >
                  {isFollowing ? <><UserCheck className="w-4 h-4" /> Seguindo</> : <><UserPlus className="w-4 h-4" /> Seguir</>}
                </button>
                <button
                  onClick={onMessage}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 bg-white"
                  style={btnOutline}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                {isMentor && (
                  <button
                    onClick={onMentor}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 bg-white"
                    style={btnOutline}
                  >
                    <GraduationCap className="w-4 h-4" /> Mentoria
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}