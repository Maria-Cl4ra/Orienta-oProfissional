import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, CheckCircle2, Eye, Send, HelpCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import Avatar from "@/components/Avatar";
import { CATEGORIES, timeAgo } from "@/lib/social";
import { useToast } from "@/components/ui/use-toast";

export default function QAPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Programação");
  const [tagsInput, setTagsInput] = useState("");
  const [filterCat, setFilterCat] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await base44.entities.Question.list("-created_date", 50);
      setQuestions(data);
    } catch (e) {}
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!user) { toast({ title: "Faça login para perguntar", variant: "destructive" }); return; }
    if (!title.trim() || !description.trim()) { toast({ title: "Preencha título e descrição", variant: "destructive" }); return; }
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    try {
      await base44.entities.Question.create({
        title, description, category, tags,
        author_name: user.full_name || user.email,
        author_avatar: ""
      });
      setTitle(""); setDescription(""); setTagsInput(""); setShowForm(false);
      toast({ title: "Pergunta publicada!" });
      loadQuestions();
    } catch (e) {
      toast({ title: "Erro ao publicar", variant: "destructive" });
    }
  };

  const filtered = filterCat ? questions.filter(q => q.category === filterCat) : questions;

  return (
    <Layout centerLabel="PERGUNTAS & RESPOSTAS">
      <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-script font-bold text-owl-purple">Perguntas</h1>
            <p className="text-sm text-owl-navy/50">Tire dúvidas e ajude a comunidade</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-owl-navy text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-owl-navyDeep transition-colors">
            <Plus className="w-4 h-4" /> Perguntar
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/40 p-4 mb-5 space-y-3 animate-fade-in">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da pergunta" className="w-full px-4 py-2.5 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm font-medium" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva sua dúvida em detalhes..." rows={4} className="w-full px-4 py-2.5 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm resize-none" />
            <div className="flex flex-wrap gap-2">
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-1.5 rounded-full border border-owl-purpleLight/40 bg-owl-beige text-sm text-owl-navy focus:outline-none">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tags (vírgula)" className="flex-1 min-w-[120px] px-3 py-1.5 rounded-full border border-owl-purpleLight/40 text-sm focus:outline-none focus:border-owl-purple" />
              <button onClick={handleAsk} className="ml-auto flex items-center gap-2 bg-owl-navy text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-owl-navyDeep transition-colors">
                <Send className="w-3.5 h-3.5" /> Publicar
              </button>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilterCat("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${!filterCat ? "bg-owl-navy text-white" : "bg-white text-owl-navy border border-owl-purpleLight/40"}`}>Todas</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterCat === cat ? "bg-owl-navy text-white" : "bg-white text-owl-navy border border-owl-purpleLight/40"}`}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle className="w-12 h-12 text-owl-purpleLight mx-auto mb-3" />
            <p className="text-owl-navy/50 text-sm">Nenhuma pergunta ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(q => (
              <button key={q.id} onClick={() => navigate(`/pergunta/${q.id}`)} className="w-full text-left bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4 hover:border-owl-purpleLight/60 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <Avatar src={q.author_avatar} name={q.author_name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-owl-navy/50">{q.author_name}</span>
                      <span className="text-xs text-owl-navy/30">• {timeAgo(q.created_date)}</span>
                      {q.has_accepted && <CheckCircle2 className="w-3.5 h-3.5 text-owl-green" />}
                    </div>
                    <h3 className="font-semibold text-sm text-owl-navy mb-1 line-clamp-2">{q.title}</h3>
                    <p className="text-xs text-owl-navy/60 line-clamp-2">{q.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs font-bold rounded-full">{q.category}</span>
                      <span className="flex items-center gap-1 text-xs text-owl-navy/40"><MessageSquare className="w-3 h-3" /> {q.answers_count || 0}</span>
                      <span className="flex items-center gap-1 text-xs text-owl-navy/40"><Eye className="w-3 h-3" /> {q.views_count || 0}</span>
                      {q.tags?.slice(0, 2).map((tag, i) => <span key={i} className="text-xs text-owl-purple">#{tag}</span>)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}