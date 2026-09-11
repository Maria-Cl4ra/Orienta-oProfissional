import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mic, MessageCircle, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";

const mentorAreas = [
  { icon: Mic, title: "Simulação de Entrevistas", desc: "Pratique entrevistas reais e receba feedback imediato para se preparar.", path: "/simulacao-entrevista" },
  { icon: MessageCircle, title: "Comunidade", desc: "Compartilhe experiências, tire dúvidas e conecte-se com outros estudantes.", path: "/comunidade" },
  { icon: Users, title: "Perguntas & Respostas", desc: "Receba ajuda da comunidade sobre carreiras e estudos.", path: "/perguntas" }
];

export default function Mentorias() {
  const navigate = useNavigate();
  return (
    <Layout centerLabel="MENTORIAS">
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-24">
        <div className="text-center mb-8">
          <OwlMascot size={80} className="mx-auto mb-4 animate-pop-in" />
          <h1 className="text-3xl font-display font-bold text-owl-navy mb-2">Mentorias</h1>
          <p className="text-owl-navy/50 text-sm max-w-md mx-auto">
            Acelere sua jornada com orientação prática e suporte da comunidade MentorOwl.
          </p>
        </div>

        <div className="space-y-3">
          {mentorAreas.map((m, i) => {
            const Icon = m.icon;
            return (
              <button
                key={m.path}
                onClick={() => navigate(m.path)}
                className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 border-2 border-owl-purpleLight/20 hover:border-owl-purple hover:shadow-md transition-all duration-300 text-left animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 bg-owl-purpleLight/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-owl-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-owl-navy">{m.title}</h3>
                  <p className="text-sm text-owl-navy/50">{m.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-owl-purple flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}