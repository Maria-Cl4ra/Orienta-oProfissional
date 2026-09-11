import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Users, FileText, HelpCircle, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/social";

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("users");
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProfiles([]); setPosts([]); setQuestions([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => doSearch(), 350);
    return () => clearTimeout(timer);
  }, [query, tab]);

  const doSearch = async () => {
    const q = query.toLowerCase();
    try {
      if (tab === "users") {
        const all = await base44.entities.Profile.list("-created_date", 50);
        setProfiles(all.filter(p =>
          (p.full_name || "").toLowerCase().includes(q) ||
          (p.username || "").toLowerCase().includes(q) ||
          (p.skills || []).some(s => s.toLowerCase().includes(q)) ||
          (p.specialties || []).some(s => s.toLowerCase().includes(q))
        ));
      } else if (tab === "posts") {
        const all = await base44.entities.Post.list("-created_date", 50);
        setPosts(all.filter(p =>
          (p.content || "").toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
        ));
      } else if (tab === "questions") {
        const all = await base44.entities.Question.list("-created_date", 50);
        setQuestions(all.filter(qu =>
          (qu.title || "").toLowerCase().includes(q) ||
          (qu.description || "").toLowerCase().includes(q) ||
          (qu.tags || []).some(t => t.toLowerCase().includes(q))
        ));
      }
    } catch (e) {}
    setLoading(false);
  };

  const tabs = [
    { id: "users", label: "Usuários", icon: Users },
    { id: "posts", label: "Postagens", icon: FileText },
    { id: "questions", label: "Perguntas", icon: HelpCircle }
  ];

  return (
    <Layout centerLabel="BUSCAR">
      <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <h1 className="text-2xl font-script font-bold text-owl-purple mb-4">Buscar</h1>

        {/* Search input */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-owl-navy/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar usuários, posts, perguntas, tags..."
            className="w-full pl-11 pr-10 py-3 rounded-full border-2 border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm bg-white"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-owl-purpleLight/30">
              <X className="w-4 h-4 text-owl-navy/40" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t.id ? "bg-owl-navy text-white" : "bg-white text-owl-navy border border-owl-purpleLight/40"}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="text-center py-20">
            <SearchIcon className="w-12 h-12 text-owl-purpleLight mx-auto mb-3" />
            <p className="text-owl-navy/50 text-sm">Digite algo para buscar</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div>
        ) : (
          <>
            {tab === "users" && (
              <div className="space-y-2">
                {profiles.length === 0 ? (
                  <EmptyResults />
                ) : profiles.map(p => (
                  <button key={p.id} onClick={() => navigate(`/perfil/${p.id}`)} className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-owl-purpleLight/30 hover:border-owl-purpleLight/60 transition-all text-left">
                    <Avatar src={p.avatar_url} name={p.full_name} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-owl-navy truncate">{p.full_name}</p>
                      <p className="text-xs text-owl-purple">@{p.username}</p>
                    </div>
                    {p.area && <span className="px-2 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs rounded-full">{p.area}</span>}
                  </button>
                ))}
              </div>
            )}
            {tab === "posts" && (
              <div className="space-y-2">
                {posts.length === 0 ? <EmptyResults /> : posts.map(p => (
                  <button key={p.id} onClick={() => navigate("/comunidade")} className="w-full text-left p-3 bg-white rounded-2xl border-2 border-owl-purpleLight/30 hover:border-owl-purpleLight/60 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar src={p.author_avatar} name={p.author_name} size={24} />
                      <span className="text-xs text-owl-navy/50">{p.author_name} • {timeAgo(p.created_date)}</span>
                    </div>
                    <p className="text-sm text-owl-navy line-clamp-2">{p.content}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs rounded-full">{p.category}</span>
                  </button>
                ))}
              </div>
            )}
            {tab === "questions" && (
              <div className="space-y-2">
                {questions.length === 0 ? <EmptyResults /> : questions.map(q => (
                  <button key={q.id} onClick={() => navigate(`/pergunta/${q.id}`)} className="w-full text-left p-3 bg-white rounded-2xl border-2 border-owl-purpleLight/30 hover:border-owl-purpleLight/60 transition-all">
                    <p className="font-semibold text-sm text-owl-navy line-clamp-1">{q.title}</p>
                    <p className="text-xs text-owl-navy/60 line-clamp-1 mt-0.5">{q.description}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs rounded-full">{q.category}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

function EmptyResults() {
  return <p className="text-center text-owl-navy/40 text-sm py-10">Nenhum resultado encontrado.</p>;
}