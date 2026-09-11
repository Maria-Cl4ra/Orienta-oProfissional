import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import { AREAS } from "@/lib/social";
import { PROFILE_THEMES } from "@/lib/profileThemes";
import { PROFILE_BADGES } from "@/lib/profileBadges";
import { useToast } from "@/components/ui/use-toast";

const LEVELS = ["Iniciante", "Intermediário", "Avançado", "Especialista"];

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: "", full_name: "", bio: "", avatar_url: "", cover_url: "",
    city: "", country: "", languages: [], github_url: "", linkedin_url: "",
    instagram_url: "", portfolio_url: "", website_url: "", area: "",
    specialties: [], skills: [], experience_level: "", education: [],
    certificates: [], learning_goals: [], objectives: "",
    is_public: true, hide_email: true, hide_city: false, who_can_message: "Todos",
    theme: "default", role: "Estudante", highlighted_badges: []
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm(f => ({ ...f, full_name: u.full_name || "" }));
      base44.entities.Profile.filter({ created_by_id: u.id }).then(profs => {
        if (profs[0]) {
          setProfileId(profs[0].id);
          setForm(prev => ({ ...prev, ...profs[0] }));
        }
      });
    }).catch(() => navigate("/login"));
  }, []);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const setArray = (field, value) => setForm(f => ({ ...f, [field]: value.split(",").map(s => s.trim()).filter(Boolean) }));

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set(field, file_url);
    } catch (err) {
      toast({ title: "Erro no upload", variant: "destructive" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) { toast({ title: "Nome de usuário é obrigatório", variant: "destructive" }); return; }
    setSaving(true);
    try {
      let savedId = profileId;
      if (profileId) {
        await base44.entities.Profile.update(profileId, form);
      } else {
        const saved = await base44.entities.Profile.create(form);
        savedId = saved.id;
      }
      toast({ title: "Perfil salvo!" });
      navigate(`/perfil/${savedId}`);
    } catch (err) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <Layout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div></Layout>;
  }

  return (
    <Layout centerLabel="EDITAR PERFIL">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 md:p-8 pb-20 md:pb-8 space-y-5">
        <h1 className="text-3xl font-script font-bold text-owl-purple">Editar Perfil</h1>

        <Section title="Fotos">
          <div className="flex gap-6">
            <div className="text-center">
              {form.avatar_url ? <img src={form.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover mb-2 ring-2 ring-owl-purpleLight mx-auto" /> : <div className="w-20 h-20 rounded-full bg-owl-purpleLight/30 mb-2 mx-auto flex items-center justify-center text-owl-navy/40 text-xs">Foto</div>}
              <label className="cursor-pointer text-xs text-owl-purple font-semibold flex items-center gap-1 justify-center"><Upload className="w-3 h-3" /> Avatar<input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "avatar_url")} /></label>
            </div>
            <div className="text-center">
              {form.cover_url ? <img src={form.cover_url} alt="" className="w-40 h-20 rounded-xl object-cover mb-2 mx-auto" /> : <div className="w-40 h-20 rounded-xl bg-owl-purpleLight/20 mb-2 mx-auto flex items-center justify-center text-owl-navy/40 text-xs">Capa</div>}
              <label className="cursor-pointer text-xs text-owl-purple font-semibold flex items-center gap-1 justify-center"><Upload className="w-3 h-3" /> Capa<input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "cover_url")} /></label>
            </div>
          </div>
        </Section>

        <Section title="Informações básicas">
          <Input label="Nome de usuário (@)" value={form.username} onChange={v => set("username", v)} placeholder="@seunome" />
          <Input label="Nome" value={form.full_name} onChange={v => set("full_name", v)} />
          <TextArea label="Biografia" value={form.bio} onChange={v => set("bio", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cidade" value={form.city || ""} onChange={v => set("city", v)} />
            <Input label="País" value={form.country || ""} onChange={v => set("country", v)} />
          </div>
          <Input label="Idiomas (vírgula)" value={(form.languages || []).join(", ")} onChange={v => setArray("languages", v)} />
        </Section>

        <Section title="Redes sociais">
          <Input label="GitHub" value={form.github_url || ""} onChange={v => set("github_url", v)} />
          <Input label="LinkedIn" value={form.linkedin_url || ""} onChange={v => set("linkedin_url", v)} />
          <Input label="Instagram" value={form.instagram_url || ""} onChange={v => set("instagram_url", v)} />
          <Input label="Portfólio" value={form.portfolio_url || ""} onChange={v => set("portfolio_url", v)} />
          <Input label="Site pessoal" value={form.website_url || ""} onChange={v => set("website_url", v)} />
        </Section>

        <Section title="Informações profissionais">
          <Select label="Área de atuação" value={form.area || ""} onChange={v => set("area", v)} options={AREAS} />
          <Input label="Especialidades (vírgula)" value={(form.specialties || []).join(", ")} onChange={v => setArray("specialties", v)} />
          <Input label="Competências (vírgula)" value={(form.skills || []).join(", ")} onChange={v => setArray("skills", v)} />
          <Select label="Nível de experiência" value={form.experience_level || ""} onChange={v => set("experience_level", v)} options={LEVELS} />
          <Input label="Formação (vírgula)" value={(form.education || []).join(", ")} onChange={v => setArray("education", v)} />
          <Input label="Certificados (vírgula)" value={(form.certificates || []).join(", ")} onChange={v => setArray("certificates", v)} />
        </Section>

        <Section title="Aprendizagem">
          <Input label="Áreas que deseja aprender (vírgula)" value={(form.learning_goals || []).join(", ")} onChange={v => setArray("learning_goals", v)} />
          <TextArea label="Objetivos" value={form.objectives || ""} onChange={v => set("objectives", v)} />
        </Section>

        <Section title="Cargo">
          <Select label="Cargo" value={form.role || "Estudante"} onChange={v => set("role", v)} options={["Estudante", "Mentor", "Estudante e Mentor"]} />
        </Section>

        <Section title="Tema do Perfil">
          <p className="text-xs text-owl-navy/50 mb-3">Personalize as cores do seu perfil. O layout permanece o mesmo para todos.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(PROFILE_THEMES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => set("theme", key)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${form.theme === key ? "border-owl-purple" : "border-owl-purpleLight/30 hover:border-owl-purpleLight"}`}
              >
                <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: t.primary }}>
                  {t.accent !== t.primary && <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent }} />}
                </span>
                <span className="text-xs font-medium text-owl-navy truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Badges em destaque">
          <p className="text-xs text-owl-navy/50 mb-3">Escolha quais conquistas destacar no seu perfil.</p>
          <div className="flex flex-wrap gap-2">
            {PROFILE_BADGES.map(b => {
              const Icon = b.icon;
              const active = (form.highlighted_badges || []).includes(b.key);
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => {
                    const current = form.highlighted_badges || [];
                    set("highlighted_badges", active ? current.filter(k => k !== b.key) : [...current, b.key]);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all`}
                  style={active ? { color: b.color, borderColor: b.color, background: `${b.color}10` } : { borderColor: "#f0c5d4", color: "#604734", opacity: 0.5 }}
                >
                  <Icon className="w-3.5 h-3.5" /> {b.label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Privacidade">
          <Toggle label="Perfil público" value={form.is_public} onChange={v => set("is_public", v)} />
          <Toggle label="Ocultar e-mail" value={form.hide_email} onChange={v => set("hide_email", v)} />
          <Toggle label="Ocultar cidade" value={form.hide_city} onChange={v => set("hide_city", v)} />
          <Select label="Quem pode enviar mensagens" value={form.who_can_message || "Todos"} onChange={v => set("who_can_message", v)} options={["Todos", "Seguidores", "Ninguém"]} />
        </Section>

        <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-owl-navy text-white font-bold py-3 rounded-full hover:bg-owl-navyDeep transition-colors disabled:opacity-50 sticky bottom-4 shadow-lg">
          <Save className="w-4 h-4" /> Salvar perfil
        </button>
      </form>
    </Layout>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4 space-y-3">
      <h2 className="font-bold text-sm text-owl-purple">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-owl-navy/70 mb-1">{label}</label>
      <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm" />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-owl-navy/70 mb-1">{label}</label>
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm resize-none" />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-owl-navy/70 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-owl-purpleLight/40 bg-owl-beige focus:border-owl-purple focus:outline-none text-sm">
        <option value="">Selecione...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-owl-navy">{label}</span>
      <button type="button" onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-owl-purple" : "bg-owl-purpleLight/40"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );
}