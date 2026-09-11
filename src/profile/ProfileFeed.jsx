import React, { useState } from "react";
import { ImagePlus, Send, HelpCircle, FileText, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PostCard from "@/components/PostCard";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = ["Programação", "Design", "Matemática", "ENEM", "Idiomas", "Inteligência Artificial", "Banco de Dados", "Desenvolvimento Web", "Mobile", "Carreira", "Faculdade", "Projetos", "Ciência", "Tecnologia", "Empreendedorismo", "Outros"];

export default function ProfileFeed({ posts, currentUser, profile, isOwn, theme, onPostCreated }) {
  const { toast } = useToast();
  const [type, setType] = useState("post");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Outros");
  const [images, setImages] = useState([]);
  const [posting, setPosting] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setImages(prev => [...prev, file_url]);
      } catch (err) {
        toast({ title: "Erro no upload", variant: "destructive" });
      }
    }
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handlePost = async () => {
    if (type === "duvida" && !title.trim()) { toast({ title: "Adicione um título à dúvida", variant: "destructive" }); return; }
    if (!content.trim() && images.length === 0 && type === "post") { toast({ title: "Escreva algo", variant: "destructive" }); return; }
    if (type === "duvida" && !content.trim()) { toast({ title: "Descreva sua dúvida", variant: "destructive" }); return; }
    setPosting(true);
    try {
      if (type === "duvida") {
        await base44.entities.Question.create({
          title: title.trim(),
          description: content,
          category,
          author_name: profile.full_name,
          author_avatar: profile.avatar_url || ""
        });
        toast({ title: "Dúvida enviada para o Q&A!", description: "Você pode vê-la na seção Perguntas & Respostas." });
        setTitle(""); setContent("");
      } else {
        await base44.entities.Post.create({
          content,
          images,
          category,
          author_name: profile.full_name,
          author_avatar: profile.avatar_url || "",
          likes_count: 0,
          comments_count: 0
        });
        toast({ title: "Publicado no feed!" });
        setContent(""); setImages([]);
        onPostCreated?.();
      }
    } catch (e) {
      toast({ title: "Erro ao publicar", variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-3" style={{ color: theme.primary }}>Publicações</h3>

      {/* Composer (only own profile) */}
      {isOwn && (
        <div className="bg-white rounded-2xl border-2 p-4 mb-4" style={{ borderColor: theme.light }}>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setType("post")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={type === "post" ? { background: theme.primary, color: "#fff" } : { color: theme.primary, background: theme.light }}
            >
              <FileText className="w-3.5 h-3.5" /> Publicação
            </button>
            <button
              onClick={() => setType("duvida")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={type === "duvida" ? { background: theme.primary, color: "#fff" } : { color: theme.primary, background: theme.light }}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Dúvida
            </button>
          </div>

          {type === "duvida" && (
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título da dúvida"
              className="w-full px-3 py-2 rounded-xl border text-sm mb-2"
              style={{ borderColor: theme.light }}
            />
          )}

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={type === "duvida" ? "Descreva sua dúvida..." : "Compartilhe sua jornada, projeto ou conquista..."}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border text-sm resize-none mb-2"
            style={{ borderColor: theme.light }}
          />

          {images.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {type === "post" && (
                <label className="cursor-pointer p-2 rounded-full transition-colors" style={{ color: theme.primary }}>
                  <ImagePlus className="w-4 h-4" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                </label>
              )}
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-full border text-xs"
                style={{ borderColor: theme.light, color: theme.primary }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={handlePost}
              disabled={posting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-105"
              style={{ background: theme.primary }}
            >
              <Send className="w-3.5 h-3.5" /> {type === "duvida" ? "Enviar Dúvida" : "Publicar"}
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 p-8 text-center" style={{ borderColor: theme.light }}>
          <p className="text-sm" style={{ color: theme.primary, opacity: 0.5 }}>
            {isOwn ? "Suas publicações aparecerão aqui e na Comunidade." : "Nenhuma publicação ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <PostCard key={p.id} post={p} currentUser={currentUser} onDeleted={onPostCreated} />
          ))}
        </div>
      )}
    </div>
  );
}