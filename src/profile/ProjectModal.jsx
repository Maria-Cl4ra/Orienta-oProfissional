import React, { useState } from "react";
import { X, Upload, Save, Link as LinkIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function ProjectModal({ onClose, onSaved, theme }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", description: "", cover_image: "", technologies: [], links: [], files: [] });
  const [techInput, setTechInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (field === "files") set("files", [...form.files, file_url]);
      else set(field, file_url);
    } catch (err) {
      toast({ title: "Erro no upload", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Título é obrigatório", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await base44.entities.Project.create(form);
      toast({ title: "Projeto criado!" });
      onSaved?.();
      onClose?.();
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: theme.primary }}>Novo Projeto</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="space-y-3">
          {/* Cover */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Imagem de capa</label>
            {form.cover_image ? (
              <img src={form.cover_image} alt="" className="w-full h-32 rounded-xl object-cover mb-2" />
            ) : (
              <div className="w-full h-32 rounded-xl flex items-center justify-center mb-2" style={{ background: theme.light }}>
                <Upload className="w-6 h-6" style={{ color: theme.primary, opacity: 0.4 }} />
              </div>
            )}
            <label className="cursor-pointer text-xs font-medium flex items-center gap-1" style={{ color: theme.primary }}>
              <Upload className="w-3.5 h-3.5" /> Enviar imagem
              <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "cover_image")} />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Título *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Nome do projeto"
              className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.light }} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Descrição</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Sobre o projeto..."
              className="w-full px-3 py-2 rounded-xl border text-sm resize-none" style={{ borderColor: theme.light }} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Tecnologias</label>
            <div className="flex gap-2">
              <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (techInput.trim()) { set("technologies", [...form.technologies, techInput.trim()]); setTechInput(""); } } }}
                placeholder="Tecle Enter para adicionar" className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.light }} />
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.technologies.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: theme.light, color: theme.primary }}>
                    {t}
                    <button onClick={() => set("technologies", form.technologies.filter((_, idx) => idx !== i))} className="hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Links</label>
            <div className="flex gap-2">
              <input value={linkInput} onChange={e => setLinkInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (linkInput.trim()) { set("links", [...form.links, linkInput.trim()]); setLinkInput(""); } } }}
                placeholder="https://..." className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.light }} />
            </div>
            {form.links.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.links.map((l, i) => (
                  <a key={i} href={l} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: theme.light, color: theme.primary }}>
                    <LinkIcon className="w-3 h-3" /> Link {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: theme.primary }}>Arquivos</label>
            <label className="cursor-pointer text-xs font-medium flex items-center gap-1" style={{ color: theme.primary }}>
              <Upload className="w-3.5 h-3.5" /> Adicionar arquivo
              <input type="file" className="hidden" onChange={e => handleUpload(e, "files")} />
            </label>
            {form.files.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.files.map((f, i) => (
                  <a key={i} href={f} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: theme.light, color: theme.primary }}>Arquivo {i + 1}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-full font-bold disabled:opacity-50 transition-all hover:scale-105"
          style={{ background: theme.primary, color: "#fff" }}
        >
          <Save className="w-4 h-4" /> Salvar Projeto
        </button>
      </div>
    </div>
  );
}