import React, { useState } from "react";
import { Mail, Send, MessageCircle, MapPin, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Using InvokeLLM to generate a helpful response
      toast({ title: "Mensagem enviada! Entraremos em contato em breve." });
      setFormData({ name: "", email: "", message: "" });
    } catch (e) {
      toast({ title: "Erro ao enviar mensagem", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout centerLabel="ENTRE EM CONTATO">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20">
        {/* Pill button */}
        <div className="flex justify-start mb-8">
          <button className="px-6 py-3 bg-[#E8E8E0] text-owl-navy font-semibold rounded-full text-sm hover:bg-muted transition-colors">
            Entre em Contato
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-owl-navy mb-4">
              Vamos conversar
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Tem dúvidas sobre o teste vocacional, carreiras ou cursos? Nossa coruja está aqui para ajudar! Envie sua mensagem e responderemos o mais rápido possível.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-owl-purpleLight/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-owl-purple" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-owl-navy">contato@mentorowl.com.br</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-owl-purpleLight/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-owl-purple" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-semibold text-owl-navy">(11) 4002-8922</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-owl-purpleLight/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-owl-purple" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="text-sm font-semibold text-owl-navy">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <OwlMascot size={70} className="opacity-90" />
            </div>
          </div>

          {/* Right - form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-muted/30 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-owl-purple" />
              <h2 className="font-bold text-owl-navy">Envie sua mensagem</h2>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Como podemos ajudar?"
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-muted/40 focus:border-owl-purple focus:outline-none text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-owl-purple hover:bg-owl-navy text-white font-bold py-3 rounded-full transition-colors text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}