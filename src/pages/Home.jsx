import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Briefcase, Mic, Users, MessageCircle, HelpCircle, Sparkles, TrendingUp, BookOpen, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OwlMascot from "@/components/OwlMascot";
import { base44 } from "@/api/base44Client";

const features = [
  { icon: Compass, title: "Teste Vocacional", desc: "Descubra sua área ideal com um teste profundo e personalizado.", path: "/teste-vocacional" },
  { icon: Briefcase, title: "Explorar Carreiras", desc: "Conheça profissões, salários e mercado de trabalho.", path: "/carreiras" },
  { icon: Mic, title: "Simulações", desc: "Pratique entrevistas reais e receba feedback imediato.", path: "/simulacao-entrevista" },
  { icon: Users, title: "Mentorias", desc: "Conecte-se com mentores e acelere sua jornada.", path: "/mentorias" },
  { icon: MessageCircle, title: "Comunidade", desc: "Compartilhe experiências e aprenda com outros.", path: "/comunidade" },
  { icon: HelpCircle, title: "Perguntas & Respostas", desc: "Tire dúvidas e ajude a comunidade a crescer.", path: "/perguntas" }
];

const steps = [
  { num: "01", title: "Faça o Teste", desc: "Responda perguntas sobre seus interesses, valores e habilidades." },
  { num: "02", title: "Descubra Seu Perfil", desc: "Receba um relatório completo com suas competências e áreas ideais." },
  { num: "03", title: "Explore Carreiras", desc: "Veja profissões compatíveis e conheça o mercado de cada uma." },
  { num: "04", title: "Conecte-se", desc: "Pratique, aprenda e cresça junto com a comunidade MentorOwl." }
];

export default function Home() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [careerCount, setCareerCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [testi, careers] = await Promise.all([
        base44.entities.Testimonial.filter({ approved: true }),
        base44.entities.Career.list("-created_date", 200)
      ]);
      setTestimonials(testi.slice(0, 3));
      setCareerCount(careers.length);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-owl-beige flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-owl-purpleLight/30 px-4 py-1.5 rounded-full text-sm font-medium text-owl-navy mb-5 animate-fade-in">
                <Sparkles className="w-4 h-4 text-owl-purple" /> Sua jornada profissional começa aqui
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-owl-navy leading-tight mb-4 animate-fade-in">
                Descubra a carreira<br />que combina com <span className="text-owl-purple">você</span>
              </h1>
              <p className="text-lg text-owl-navy/60 mb-8 max-w-md mx-auto lg:mx-0 animate-fade-in">
                Testes vocacionais profundos, exploração de carreiras e simulações — tudo em uma plataforma inteligente e acolhedora.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in">
                <button
                  onClick={() => navigate("/teste-vocacional")}
                  className="flex items-center justify-center gap-2 bg-owl-navy hover:bg-owl-navyDeep text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/carreiras")}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-owl-purpleLight/30 border-2 border-owl-purpleLight/50 text-owl-navy font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Explorar Carreiras
                </button>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-owl-purpleLight/30 blur-3xl rounded-full" />
              <div className="relative bg-white/60 backdrop-blur rounded-3xl p-8 border-2 border-owl-purpleLight/40 shadow-lg animate-pop-in">
                <OwlMascot size={160} className="mx-auto" />
                <p className="font-script text-2xl text-owl-purple text-center mt-3">Eu sou a Dolliki!</p>
                <p className="text-sm text-owl-navy/50 text-center">Sua mentora de carreira</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-owl-navy mb-2">Tudo que você precisa</h2>
          <p className="text-owl-navy/50">Recursos completos para orientar seu futuro profissional</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <button
                key={f.path}
                onClick={() => navigate(f.path)}
                className="group text-left bg-white rounded-3xl p-6 border-2 border-owl-purpleLight/20 hover:border-owl-purple hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 bg-owl-purpleLight/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-owl-purpleLight/50 transition-transform">
                  <Icon className="w-6 h-6 text-owl-navy" />
                </div>
                <h3 className="font-bold text-owl-navy text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-owl-navy/50 leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 text-owl-purple font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60 py-12 md:py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-owl-navy mb-2">Como funciona</h2>
            <p className="text-owl-navy/50">Quatro passos simples para o seu futuro</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative bg-owl-beige rounded-3xl p-6 border-2 border-owl-purpleLight/20 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-display text-4xl font-bold text-owl-purpleLight/60">{step.num}</span>
                <h3 className="font-bold text-owl-navy text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-owl-navy/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={`${careerCount}+`} label="Carreiras mapeadas" icon={Briefcase} />
          <StatCard value="12" label="Competências analisadas" icon={TrendingUp} />
          <StatCard value="7" label="Etapas no teste" icon={BookOpen} />
          <StatCard value="10" label="Conquistas" icon={Award} />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-white/60 py-12 md:py-16 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-display font-bold text-owl-navy mb-2">O que dizem nossos usuários</h2>
              <p className="text-owl-navy/50">Histórias reais de quem encontrou seu caminho</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-6 border-2 border-owl-purpleLight/20 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <p className="text-sm text-owl-navy/70 leading-relaxed italic mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-owl-purpleLight/40 flex items-center justify-center text-owl-navy font-bold text-sm">
                      {t.author_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-owl-navy text-sm">{t.author_name}</p>
                      {t.profession && <p className="text-xs text-owl-navy/50">{t.profession}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
        <div className="bg-gradient-to-br from-owl-navy to-owl-navyDeep rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-10"><OwlMascot size={120} /></div>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 relative">Pronto para descobrir seu futuro?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto relative">Faça o teste vocacional agora e receba um relatório completo com análise por IA.</p>
          <button
            onClick={() => navigate("/teste-vocacional")}
            className="inline-flex items-center gap-2 bg-owl-purpleLight hover:bg-white text-owl-navy font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 relative"
          >
            Começar Agora <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ value, label, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-owl-purpleLight/20 text-center">
      <Icon className="w-6 h-6 text-owl-purple mx-auto mb-2" />
      <p className="text-2xl md:text-3xl font-bold text-owl-navy">{value}</p>
      <p className="text-xs text-owl-navy/50 mt-1">{label}</p>
    </div>
  );
}