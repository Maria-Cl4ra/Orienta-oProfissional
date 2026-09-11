import React from "react";
import { MapPin, Github, Linkedin, Instagram, Globe, Link as LinkIcon, Info, Target, Sparkles, Code, Star, Languages } from "lucide-react";

export default function ProfileAbout({ profile, theme, isOwn, onEdit }) {
  const hasLinks = profile.github_url || profile.linkedin_url || profile.instagram_url || profile.portfolio_url || profile.website_url;
  const allTags = [...(profile.skills || []), ...(profile.specialties || []), ...(profile.learning_goals || [])];

  const Section = ({ icon: Icon, title, children }) => (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color: theme.primary }} />
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.primary }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border-2 p-5" style={{ borderColor: theme.light }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Sobre</h3>
        {isOwn && (
          <button onClick={onEdit} className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105" style={{ border: `1.5px solid ${theme.primary}`, color: theme.primary }}>
            Editar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {profile.bio && (
          <Section icon={Info} title="Biografia">
            <p className="text-sm leading-relaxed" style={{ color: theme.primary, opacity: 0.75 }}>{profile.bio}</p>
          </Section>
        )}

        {profile.objectives && (
          <Section icon={Target} title="Objetivos">
            <p className="text-sm leading-relaxed" style={{ color: theme.primary, opacity: 0.75 }}>{profile.objectives}</p>
          </Section>
        )}

        {profile.area && (
          <Section icon={Sparkles} title="Área favorita">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: theme.light, color: theme.primary }}>{profile.area}</span>
          </Section>
        )}

        {allTags.length > 0 && (
          <Section icon={Code} title="Interesses & Habilidades">
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: theme.light, color: theme.primary }}>{tag}</span>
              ))}
            </div>
          </Section>
        )}

        {profile.languages?.length > 0 && (
          <Section icon={Languages} title="Idiomas">
            <div className="flex flex-wrap gap-1.5">
              {profile.languages.map((l, i) => (
                <span key={i} className="text-sm" style={{ color: theme.primary, opacity: 0.75 }}>{l}{i < profile.languages.length - 1 ? " · " : ""}</span>
              ))}
            </div>
          </Section>
        )}

        {!profile.hide_city && profile.city && (
          <Section icon={MapPin} title="Localização">
            <p className="text-sm" style={{ color: theme.primary, opacity: 0.75 }}>{profile.city}{profile.country ? `, ${profile.country}` : ""}</p>
          </Section>
        )}

        {hasLinks && (
          <Section icon={LinkIcon} title="Links">
            <div className="flex flex-wrap gap-2">
              {profile.github_url && <SocialLink href={profile.github_url} icon={Github} theme={theme} />}
              {profile.linkedin_url && <SocialLink href={profile.linkedin_url} icon={Linkedin} theme={theme} />}
              {profile.instagram_url && <SocialLink href={profile.instagram_url} icon={Instagram} theme={theme} />}
              {profile.website_url && <SocialLink href={profile.website_url} icon={Globe} theme={theme} />}
              {profile.portfolio_url && <SocialLink href={profile.portfolio_url} icon={LinkIcon} theme={theme} />}
            </div>
          </Section>
        )}

        {!profile.bio && !profile.objectives && !profile.area && allTags.length === 0 && !profile.languages?.length && !hasLinks && (
          <p className="text-sm text-center py-4" style={{ color: theme.primary, opacity: 0.5 }}>
            {isOwn ? "Preencha seu perfil para compartilhar sua jornada!" : "Sem informações ainda."}
          </p>
        )}
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, theme }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-2.5 rounded-full transition-all hover:scale-110"
      style={{ background: theme.light, color: theme.primary }}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}