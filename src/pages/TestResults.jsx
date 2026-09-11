import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Sparkles, RefreshCw, Download, TrendingUp, Target, BookOpen, ArrowRight, Loader2, Award, History } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";
import { COMPETENCIES, computeCompetencies, matchCareers, matchAreas, generateProfileText } from "@/lib/vocationalData";
import { generateTestPDF } from "@/lib/pdfReport";
import { awardTestBadges } from "@/lib/badges";
import { useToast } from "@/components/ui/use-toast";

const AREA_COLORS = {
  "Exatas": "#3B82F6",
  "Humanas": "#EC4899",
  "Biológicas": "#22C55E",
  "Artes": "#F59E0B",
  "Desenvolvimento de Sistemas": "#8B5CF6",
  "Música": "#EF4444"
};

export default function TestResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { answers } = location.state || {};
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiText, setAiText] = useState("");
  const [saved, setSaved] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const savedRef = useRef(false);

  const competencies = answers ? computeCompetencies(answers) : null;
  const areaMatches = competencies ? matchAreas(competencies) : [];
  const topArea = areaMatches[0];
  const profileText = competencies ? generateProfileText(competencies) : "";

  useEffect(() => {
    if (!answers) {
      navigate("/teste-vocacional");
      return;
    }
    loadCareers();
    fetchAI();
  }, []);

  const loadCareers = async () => {
    try {
      const data = await base44.entities.Career.list("-created_date", 200);
      setCareers(data);
    } catch (e) {}
    setLoading(false);
  };

  const careerMatches = competencies && careers.length > 0 ? matchCareers(competencies, careers).slice(0, 8) : [];

  const fetchAI = async () => {
    if (!competencies) return;
    const sortedComps = Object.entries(competencies).sort(([, a], [, b]) => b - a).slice(0, 5).map(([k, v]) => `${k}: ${v}%`).join(", ");
    const topAreaName = matchAreas(competencies)[0]?.area || "";
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um orientador vocacional da plataforma MentorOwl. Analise o resultado do teste vocacional de um usuário e gere uma interpretação personalizada em português.\n\nPrincipais competências do usuário: ${sortedComps}\nÁrea com maior compatibilidade: ${topAreaName}\n\nEscreva um texto amigável e motivador (máximo 4 parágrafos) explicando:\n1. Por que essa área combina com o perfil dele\n2. Quais habilidades ele já possui e quais precisa desenvolver\n3. Um plano de estudos sugerido (cursos, práticas)\n4. Profissões emergentes semelhantes que valem a pena explorar\n\nSeja pessoal, use linguagem acolhedora e incentive o usuário.`,
        response_json_schema: {
          type: "object",
          properties: {
            interpretacao: { type: "string" }
          }
        }
      });
      setAiText(result.interpretacao || result);
    } catch (e) {
      setAiText("Não foi possível gerar a interpretação da IA no momento. Seu perfil está pronto acima!");
    }
    setAiLoading(false);
  };

  // Save result once
  useEffect(() => {
    if (savedRef.current || !competencies || !topArea || careers.length === 0) return;
    savedRef.current = true;
    saveResult();
  }, [competencies, topArea, careers]);

  const saveResult = async () => {
    try {
      await base44.entities.TestResult.create({
        top_area: topArea.area,
        compatibility: topArea.compatibility,
        competencies,
        career_matches: careerMatches.map(c => ({ title: c.title, area: c.area, compatibility: c.compatibility })),
        profile_summary: profileText,
        ai_interpretation: aiText || ""
      });
      setSaved(true);
      const earned = await awardTestBadges(competencies);
      setNewBadges(earned);
    } catch (e) {}
  };

  if (!answers) return null;

  if (loading) {
    return (
      <Layout centerLabel="RESULTADO">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <OwlMascot size={80} className="mb-4 animate-pulse" />
          <p className="text-owl-navy/60 text-sm">Analisando seu perfil...</p>
          <div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin mt-4" />
        </div>
      </Layout>
    );
  }

  const radarData = COMPETENCIES.map(c => ({ subject: c, A: competencies[c] || 0, fullMark: 100 }));

  return (
    <Layout centerLabel="SEU RESULTADO">
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-24">
        {/* Header */}
        <div className="text-center mb-6">
          <OwlMascot size={72} className="mx-auto mb-3 animate-pop-in" />
          <p className="text-sm text-owl-navy/50 font-semibold uppercase tracking-wide mb-2">Sua área com maior compatibilidade é</p>
          <h1 className="text-4xl md:text-6xl font-script font-bold mb-2" style={{ color: AREA_COLORS[topArea?.area] || "#604734" }}>
            {topArea?.area}
          </h1>
          <div className="inline-flex items-center gap-2 bg-owl-purpleLight/30 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-owl-purple" />
            <span className="font-bold text-owl-navy text-lg">{topArea?.compatibility}%</span>
            <span className="text-xs text-owl-navy/50">de compatibilidade</span>
          </div>
        </div>

        {/* Profile summary */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-2">
            <Target className="w-4 h-4 text-owl-purple" /> Resumo do seu perfil
          </h3>
          <p className="text-sm text-owl-navy/70 leading-relaxed">{profileText}</p>
        </div>

        {/* Competency radar */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
            <TrendingUp className="w-4 h-4 text-owl-purple" /> Suas competências
          </h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0c5d4" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#604734" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#aaa" }} />
                <Radar name="Perfil" dataKey="A" stroke="#604734" fill="#f0c5d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area compatibility bars */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
            <TrendingUp className="w-4 h-4 text-owl-purple" /> Compatibilidade por área
          </h3>
          <div className="space-y-2.5">
            {areaMatches.map(area => (
              <div key={area.area} className="flex items-center gap-3">
                <span className="text-xs font-medium text-owl-navy w-40 flex-shrink-0 truncate">{area.area}</span>
                <div className="flex-1 h-5 bg-owl-purpleLight/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${area.compatibility}%`, backgroundColor: AREA_COLORS[area.area] || "#604734" }}
                  />
                </div>
                <span className="text-xs font-bold text-owl-navy w-8 text-right">{area.compatibility}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career matches */}
        {careerMatches.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
            <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-4">
              <Trophy className="w-4 h-4 text-owl-purple" /> Carreiras com maior compatibilidade
            </h3>
            <div className="space-y-2">
              {careerMatches.map((career, i) => (
                <button
                  key={career.id || i}
                  onClick={() => navigate(`/carreira/${career.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-owl-purpleLight/10 transition-colors text-left"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: AREA_COLORS[career.area] || "#604734" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-owl-navy truncate">{career.title}</p>
                    <p className="text-xs text-owl-navy/50">{career.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-owl-purple text-lg leading-none">{career.compatibility}%</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-owl-navy to-owl-navyDeep rounded-2xl p-5 mb-5 text-white">
          <h3 className="flex items-center gap-2 font-bold text-sm mb-3">
            <BookOpen className="w-4 h-4 text-owl-purpleLight" /> Recomendações de estudo
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <RecItem text="Cursos Técnicos" />
            <RecItem text="Cursos Superiores" />
            <RecItem text="Cursos Livres" />
            <RecItem text="Certificações" />
            <RecItem text="Idiomas recomendados" />
            <RecItem text="Soft Skills" />
            <RecItem text="Hard Skills" />
            <RecItem text="Projetos práticos" />
          </div>
        </div>

        {/* AI Interpretation */}
        <div className="bg-owl-purpleLight/20 rounded-2xl border-2 border-owl-purpleLight/40 p-5 mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-3">
            <Sparkles className="w-4 h-4 text-owl-purple" /> Análise da IA
          </h3>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-sm text-owl-navy/50">
              <Loader2 className="w-4 h-4 animate-spin" /> Gerando interpretação personalizada...
            </div>
          ) : (
            <p className="text-sm text-owl-navy/80 leading-relaxed whitespace-pre-wrap">{aiText}</p>
          )}
        </div>

        {/* New badges earned */}
        {newBadges.length > 0 && (
          <div className="bg-gradient-to-br from-owl-purpleLight/30 to-owl-purpleLight/10 rounded-2xl border-2 border-owl-purpleLight/50 p-5 mb-5">
            <h3 className="flex items-center gap-2 font-bold text-sm text-owl-navy mb-3">
              <Award className="w-4 h-4 text-owl-purple" /> Conquistas desbloqueadas!
            </h3>
            <div className="flex flex-wrap gap-2">
              {newBadges.map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 text-sm animate-pop-in">
                  <span className="text-lg">🏅</span>
                  <span className="font-semibold text-owl-navy">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/teste-vocacional")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-owl-navy text-owl-navy font-semibold hover:bg-owl-navy hover:text-white transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refazer Teste
          </button>
          <button
            onClick={() => navigate("/carreiras")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-owl-navy text-white font-semibold hover:bg-owl-navyDeep transition-all text-sm"
          >
            Explorar Carreiras <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => generateTestPDF(competencies, topArea, areaMatches, careerMatches, profileText, aiText)}
            disabled={aiLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-owl-purple text-owl-purple font-semibold hover:bg-owl-purpleLight/20 transition-all text-sm disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
          <button
            onClick={() => navigate("/historico-testes")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-owl-navy/20 text-owl-navy font-semibold hover:bg-owl-navy/5 transition-all text-sm"
          >
            <History className="w-4 h-4" /> Histórico
          </button>
        </div>

        {saved && <p className="text-center text-xs text-owl-navy/40 mt-4">✓ Resultado salvo no seu histórico</p>}
      </div>
    </Layout>
  );
}

function RecItem({ text }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-owl-purpleLight" />
      {text}
    </div>
  );
}