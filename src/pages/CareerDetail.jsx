import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, Clock, GraduationCap, CheckCircle, MessageSquare, Send, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [career, setCareer] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ author_name: "", profession: "", text: "" });

  useEffect(() => {
    loadCareer();
  }, [id]);

  const loadCareer = async () => {
    try {
      const data = await base44.entities.Career.get(id);
      setCareer(data);
      const testimonialsData = await base44.entities.Testimonial.filter({ career_title: data.title });
      setTestimonials(testimonialsData.filter(t => t.approved));
    } catch (e) {
      toast({ title: "Profissão não encontrada", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.text.trim()) {
      toast({ title: "Preencha nome e depoimento", variant: "destructive" });
      return;
    }
    try {
      await base44.entities.Testimonial.create({
        ...formData,
        career_title: career.title,
        approved: false
      });
      toast({ title: "Depoimento enviado! Será revisado por um administrador." });
      setFormData({ author_name: "", profession: "", text: "" });
      setShowForm(false);
    } catch (e) {
      toast({ title: "Erro ao enviar depoimento", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!career) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Profissão não encontrada.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centerLabel="EXPLORAR CARREIRAS">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-owl-purpleLight/20 text-owl-purple text-xs font-bold rounded-full mb-3">
            {career.area}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-owl-navy mb-3">{career.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed">{career.description}</p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {career.average_salary && (
            <div className="bg-white rounded-2xl p-5 border border-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-owl-purple" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Salário Médio</span>
              </div>
              <p className="font-bold text-owl-navy text-lg">{career.average_salary}</p>
            </div>
          )}
          {career.education_time && (
            <div className="bg-white rounded-2xl p-5 border border-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-owl-purple" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Tempo de Formação</span>
              </div>
              <p className="font-bold text-owl-navy text-lg">{career.education_time}</p>
            </div>
          )}
          {career.education_level && (
            <div className="bg-white rounded-2xl p-5 border border-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-owl-purple" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Nível</span>
              </div>
              <p className="font-bold text-owl-navy text-lg">{career.education_level}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {career.skills && career.skills.length > 0 && (
          <div className="bg-owl-gray/30 rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-owl-navy mb-4">Habilidades Necessárias</h2>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm text-owl-navy border border-muted/30">
                  <CheckCircle className="w-3.5 h-3.5 text-owl-green" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed info */}
        {(career.subarea || career.salary_range || career.market || career.routine || career.growth_trend) && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {career.subarea && <DetailItem label="Subárea" value={career.subarea} />}
            {career.salary_range && <DetailItem label="Faixa Salarial" value={career.salary_range} />}
            {career.market && <DetailItem label="Mercado de Trabalho" value={career.market} />}
            {career.routine && <DetailItem label="Rotina Profissional" value={career.routine} />}
            {career.growth_trend && <DetailItem label="Tendência de Crescimento" value={career.growth_trend} />}
            {career.entry_difficulty && <DetailItem label="Dificuldade de Ingresso" value={career.entry_difficulty} />}
            {career.remote_possible !== undefined && career.remote_possible !== null && <DetailItem label="Trabalho Remoto" value={career.remote_possible ? "Sim" : "Não"} />}
            {career.international_possible !== undefined && career.international_possible !== null && <DetailItem label="Atuação Internacional" value={career.international_possible ? "Sim" : "Não"} />}
          </div>
        )}

        {/* Testimonials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-owl-navy text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Depoimentos
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm font-semibold text-owl-purple hover:text-owl-navy transition-colors"
            >
              {showForm ? "Cancelar" : "+ Compartilhar experiência"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmitTestimonial} className="bg-white rounded-2xl p-6 mb-4 border border-muted/30 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Sua profissão (opcional)"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm"
                />
              </div>
              <textarea
                placeholder="Conte sua experiência com esta carreira..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">Seu depoimento será revisado por um administrador antes de ser exibido.</p>
              <button type="submit" className="flex items-center gap-2 bg-owl-purple hover:bg-owl-navy text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm">
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </form>
          )}

          {testimonials.length === 0 ? (
            <div className="bg-white/50 rounded-2xl p-8 text-center border border-muted/20">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Ainda não há depoimentos. Seja o primeiro a compartilhar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <div key={t.id} className="bg-white rounded-2xl p-5 border border-muted/30 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <p className="text-owl-navy text-sm leading-relaxed mb-3 italic">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-owl-purpleLight/30 flex items-center justify-center text-owl-purple font-bold text-xs">
                      {t.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-owl-navy text-sm">{t.author_name}</p>
                      {t.profession && <p className="text-xs text-muted-foreground">{t.profession}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/carreiras")}
          className="flex items-center gap-2 text-owl-navy font-semibold hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para carreiras
        </button>
      </div>
    </Layout>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</p>
      <p className="text-sm font-medium text-owl-navy">{value}</p>
    </div>
  );
}