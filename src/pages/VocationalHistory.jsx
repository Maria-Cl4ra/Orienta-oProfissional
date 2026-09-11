import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Award, TrendingUp, Calendar, ArrowLeft, GitCompare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";
import { COMPETENCIES, matchAreas } from "@/lib/vocationalData";
import { BADGE_DEFS } from "@/lib/badges";
import { cn } from "@/lib/utils";

const AREA_COLORS = {
  "Exatas": "#3B82F6", "Humanas": "#EC4899", "Biológicas": "#22C55E",
  "Artes": "#F59E0B", "Desenvolvimento de Sistemas": "#8B5CF6", "Música": "#EF4444"
};
const ALL_AREAS = Object.keys(AREA_COLORS);

export default function VocationalHistory() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([null, null]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [testResults, userBadges] = await Promise.all([
        base44.entities.TestResult.list("-created_date", 50),
        base44.entities.Badge.list()
      ]);
      setResults(testResults);
      setBadges(userBadges);
    } catch (e) {}
    setLoading(false);
  };

  const earnedBadgeNames = new Set(badges.map(b => b.name));

  // Evolution chart — oldest first
  const sorted = [...results].reverse();
  const avgScores = {};
  ALL_AREAS.forEach(a => {
    const scores = sorted.map(r => {
      const am = r.competencies ? matchAreas(r.competencies) : [];
      return am.find(x => x.area === a)?.compatibility || 0;
    });
    avgScores[a] = scores.length ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
  });
  const top3Areas = Object.entries(avgScores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([k]) => k);

  const evolutionData = sorted.map(r => {
    const am = r.competencies ? matchAreas(r.competencies) : [];
    const map = {};
    am.forEach(a => { map[a.area] = a.compatibility; });
    return {
      date: new Date(r.created_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      ...Object.fromEntries(top3Areas.map(a => [a, map[a] || 0]))
    };
  });

  // Comparison data
  const compareData = COMPETENCIES.map(c => ({
    comp: c.length > 8 ? c.slice(0, 8) + "…" : c,
    "Teste 1": selected[0] !== null && results[selected[0]]?.competencies ? results[selected[0]].competencies[c] || 0 : 0,
    "Teste 2": selected[1] !== null && results[selected[1]]?.competencies ? results[selected[1]].competencies[c] || 0 : 0
  }));

  const toggleSelect = (idx) => {
    if (!compareMode) return;
    setSelected(prev => {
      if (prev[0] === idx) return [null, prev[1]];
      if (prev[1] === idx) return [prev[0], null];
      if (prev[0] === null) return [idx, prev[1]];
      if (prev[1] === null) return [prev[0], idx];
      return [idx, prev[1]];
    });
  };

  if (loading) {
    return (
      <Layout centerLabel="HISTÓRICO">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (results.length === 0) {
    return (
      <Layout centerLabel="HISTÓRICO">
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <OwlMascot size={80} className="mb-4 opacity-60" />
          <p className="text-owl-navy text-lg mb-2">Você ainda não fez nenhum teste.</p>
          <p className="text-owl-navy/50 text-sm mb-6">Faça seu primeiro teste vocacional para ver seu histórico aqui!</p>
          <button onClick={() => navigate("/teste-vocacional")} className="bg-owl-navy text-white font-bold px-6 py-3 rounded-full hover:bg-owl-navyDeep transition-colors">
            Fazer Teste
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centerLabel="HISTÓRICO VOCACIONAL">
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-script font-bold text-owl-purple">Meu Perfil Vocacional</h1>
          <button
            onClick={() => { setCompareMode(!compareMode); setSelected([null, null]); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors",
              compareMode ? "bg-owl-purple text-white" : "border-2 border-owl-purple text-owl-purple hover:bg-owl-purpleLight/20"
            )}
          >
            <GitCompare className="w-4 h-4" /> {compareMode ? "Sair da comparação" : "Comparar testes"}
          </button>
        </div>

        {/* Badges / Conquistas */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
            <Award className="w-4 h-4 text-owl-purple" /> Conquistas ({badges.length}/{BADGE_DEFS.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BADGE_DEFS.map((b, i) => {
              const earned = earnedBadgeNames.has(b.name);
              return (
                <div key={i} className={cn(
                  "flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all",
                  earned ? "border-owl-purple bg-owl-purpleLight/20" : "border-owl-purpleLight/20 bg-muted/30 opacity-50"
                )}>
                  <span className="text-2xl mb-1">{earned ? "🏅" : "🔒"}</span>
                  <span className="text-xs font-semibold text-owl-navy leading-tight">{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolution chart */}
        {results.length >= 2 && (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
            <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
              <TrendingUp className="w-4 h-4 text-owl-purple" /> Evolução por área
            </h3>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0c5d4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#604734" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#aaa" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {top3Areas.map(a => (
                    <Line key={a} type="monotone" dataKey={a} stroke={AREA_COLORS[a]} strokeWidth={2} dot={{ r: 4 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Comparison chart */}
        {compareMode && selected[0] !== null && selected[1] !== null && (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5 animate-fade-in">
            <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
              <GitCompare className="w-4 h-4 text-owl-purple" /> Comparação de competências
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0c5d4" />
                  <XAxis dataKey="comp" tick={{ fontSize: 9, fill: "#604734" }} angle={-30} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#aaa" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="Teste 1" fill="#604734" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Teste 2" fill="#f0c5d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Test result cards */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-2">
            <Calendar className="w-4 h-4 text-owl-purple" /> Testes realizados ({results.length})
          </h3>
          {results.map((r, idx) => {
            const date = new Date(r.created_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
            const isSel = selected.includes(idx);
            return (
              <button
                key={r.id || idx}
                onClick={() => toggleSelect(idx)}
                disabled={!compareMode}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                  compareMode && isSel ? "border-owl-purple bg-owl-purpleLight/20" : "border-owl-purpleLight/30 bg-white",
                  compareMode ? "hover:border-owl-purple cursor-pointer" : "cursor-default"
                )}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: AREA_COLORS[r.top_area] || "#604734" }}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-owl-navy text-sm">{r.top_area}</p>
                  <p className="text-xs text-owl-navy/50">{date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-owl-purple text-xl leading-none">{r.compatibility}%</p>
                  <p className="text-xs text-owl-navy/50">compatibilidade</p>
                </div>
                {compareMode && isSel && <span className="text-xs font-bold text-owl-purple">✓ Sel.</span>}
              </button>
            );
          })}
        </div>

        {compareMode && (selected[0] === null || selected[1] === null) && (
          <p className="text-center text-xs text-owl-navy/40 mt-4">
            Selecione {selected[0] === null ? "1" : "2"} teste(s) para comparar
          </p>
        )}

        {/* Action */}
        <button
          onClick={() => navigate("/teste-vocacional")}
          className="mt-8 flex items-center gap-2 text-owl-navy font-semibold hover:gap-3 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao teste
        </button>
      </div>
    </Layout>
  );
}