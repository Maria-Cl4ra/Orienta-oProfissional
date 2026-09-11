import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Award, Target, Users, Heart, MessageCircle, Zap, BookOpen, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/social";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.Profile.filter({ created_by_id: u.id }).then(profs => {
        if (profs[0]) {
          setProfile(profs[0]);
          loadStats(profs[0]);
        }
      });
    }).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, []);

  const loadStats = async (prof) => {
    try {
      const userPosts = await base44.entities.Post.filter({ created_by_id: prof.created_by_id }, "-created_date", 10);
      setPosts(userPosts);
      const likes = userPosts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
      setTotalLikes(likes);
    } catch (e) {}
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div></Layout>;

  if (!profile) {
    return (
      <Layout centerLabel="DASHBOARD">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-script font-bold text-owl-purple mb-2">Bem-vindo(a)! 🦉</h1>
          <p className="text-sm text-owl-navy/60 mb-6">Crie seu perfil para começar sua jornada.</p>
          <button onClick={() => navigate("/editar-perfil")} className="px-6 py-3 bg-owl-navy text-white font-bold rounded-full hover:bg-owl-navyDeep transition-colors">Criar perfil</button>
        </div>
      </Layout>
    );
  }

  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const xpForNext = level * 100;
  const xpProgress = Math.min(100, (xp / xpForNext) * 100);
  const xpRemaining = Math.max(0, xpForNext - xp);

  const stats = [
    { icon: MessageCircle, label: "Postagens", value: posts.length, color: "text-blue-500" },
    { icon: Users, label: "Seguidores", value: profile.followers_count || 0, color: "text-purple-500" },
    { icon: Heart, label: "Curtidas recebidas", value: totalLikes, color: "text-red-500" },
    { icon: Users, label: "Seguindo", value: profile.following_count || 0, color: "text-green-500" }
  ];

  return (
    <Layout centerLabel="DASHBOARD">
      <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-8 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar src={profile.avatar_url} name={profile.full_name} size={56} />
          <div>
            <h1 className="text-xl font-bold text-owl-navy">Olá, {profile.full_name?.split(" ")[0]}! 🦉</h1>
            <p className="text-sm text-owl-navy/50">Continue evoluindo sua jornada</p>
          </div>
        </div>

        {/* XP Card */}
        <div className="bg-gradient-to-br from-owl-navy to-owl-navyDeep rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-owl-purpleLight/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-owl-purpleLight" />
              </div>
              <div>
                <p className="text-xs text-white/60">Nível atual</p>
                <p className="text-2xl font-extrabold leading-none">Nível {level}</p>
              </div>
            </div>
            <Award className="w-8 h-8 text-owl-purpleLight/50" />
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-owl-purpleLight to-owl-purpleMed rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>{xp} XP</span>
            <span>{xpRemaining} XP para o nível {level + 1}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-owl-purpleLight/20 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-owl-navy leading-none">{stat.value}</p>
                <p className="text-xs text-owl-navy/50 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Learning goals */}
        {profile.learning_goals && profile.learning_goals.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4">
            <h2 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-3">
              <Target className="w-4 h-4 text-owl-purple" /> Metas de aprendizado
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.learning_goals.map((goal, i) => (
                <span key={i} className="px-3 py-1.5 bg-owl-purpleLight/30 text-owl-navy text-xs font-medium rounded-full">{goal}</span>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4">
          <h2 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-3">
            <TrendingUp className="w-4 h-4 text-owl-purple" /> Atividade recente
          </h2>
          {posts.length === 0 ? (
            <p className="text-center text-owl-navy/40 text-sm py-4">Nenhuma atividade ainda. Que tal postar algo?</p>
          ) : (
            <div className="space-y-2">
              {posts.slice(0, 5).map(post => (
                <button key={post.id} onClick={() => navigate("/comunidade")} className="w-full text-left p-3 rounded-xl hover:bg-owl-purpleLight/10 transition-colors">
                  <p className="text-sm text-owl-navy line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-owl-navy/40">
                    <span>{timeAgo(post.created_date)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes_count || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments_count || 0}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4">
          <h2 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-3">
            <BookOpen className="w-4 h-4 text-owl-purple" /> Ações rápidas
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <QuickAction label="Comunidade" onClick={() => navigate("/comunidade")} />
            <QuickAction label="Perguntas" onClick={() => navigate("/perguntas")} />
            <QuickAction label="Buscar" onClick={() => navigate("/buscar")} />
            <QuickAction label="Teste Vocacional" onClick={() => navigate("/teste-vocacional")} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function QuickAction({ label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-owl-purpleLight/20 hover:bg-owl-purpleLight/40 transition-colors text-sm font-medium text-owl-navy">
      {label} <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );
}