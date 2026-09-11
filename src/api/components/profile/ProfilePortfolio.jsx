import React, { useState } from "react";
import { Plus, Link as LinkIcon, Code2 } from "lucide-react";
import ProjectModal from "./ProjectModal";

export default function ProfilePortfolio({ projects, isOwn, theme, onRefresh }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Portfólio</h3>
        {isOwn && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ background: theme.primary }}
          >
            <Plus className="w-3.5 h-3.5" /> Novo projeto
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 p-8 text-center" style={{ borderColor: theme.light }}>
          <Code2 className="w-10 h-10 mx-auto mb-2" style={{ color: theme.primary, opacity: 0.3 }} />
          <p className="text-sm" style={{ color: theme.primary, opacity: 0.6 }}>
            {isOwn ? "Adicione seu primeiro projeto ao portfólio!" : "Nenhum projeto publicado ainda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: theme.light }}
            >
              {p.cover_image ? (
                <img src={p.cover_image} alt={p.title} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 flex items-center justify-center" style={{ background: theme.soft }}>
                  <Code2 className="w-8 h-8" style={{ color: theme.primary, opacity: 0.3 }} />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-bold text-sm" style={{ color: theme.primary }}>{p.title}</h4>
                {p.description && (
                  <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: theme.primary, opacity: 0.6 }}>{p.description}</p>
                )}
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: theme.light, color: theme.primary }}>{t}</span>
                    ))}
                  </div>
                )}
                {p.links?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {p.links.map((l, i) => (
                      <a key={i} href={l} target="_blank" rel="noreferrer" className="p-2 rounded-full transition-all hover:scale-110" style={{ background: theme.light, color: theme.primary }}>
                        <LinkIcon className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <ProjectModal onClose={() => setShowModal(false)} onSaved={onRefresh} theme={theme} />}
    </div>
  );
}