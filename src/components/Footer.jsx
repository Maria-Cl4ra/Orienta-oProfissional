import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Linkedin, Github, Heart } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-owl-navyDeep text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Logo size="sm" variant="light" />
            <p className="text-sm text-white/50 mt-3 max-w-xs">
              Sua jornada de orientação profissional começa aqui.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-owl-purpleLight hover:text-owl-navy flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 hover:bg-owl-purpleLight hover:text-owl-navy flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-white/10 hover:bg-owl-purpleLight hover:text-owl-navy flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-owl-purpleLight transition-colors">Início</Link></li>
              <li><Link to="/teste-vocacional" className="hover:text-owl-purpleLight transition-colors">Teste Vocacional</Link></li>
              <li><Link to="/carreiras" className="hover:text-owl-purpleLight transition-colors">Carreiras</Link></li>
              <li><Link to="/mentorias" className="hover:text-owl-purpleLight transition-colors">Mentorias</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3">Comunidade</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/comunidade" className="hover:text-owl-purpleLight transition-colors">Feed</Link></li>
              <li><Link to="/perguntas" className="hover:text-owl-purpleLight transition-colors">Perguntas &amp; Respostas</Link></li>
              <li><Link to="/contato" className="hover:text-owl-purpleLight transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@mentorowl.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +55 11 4000-0000</li>
            </ul>
            <ul className="space-y-2 text-sm mt-3">
              <li><a href="#" className="hover:text-owl-purpleLight transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-owl-purpleLight transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">© 2026 MentorOwl. Todos os direitos reservados.</p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-owl-purpleLight fill-owl-purpleLight" /> para o seu futuro
          </p>
        </div>
      </div>
    </footer>
  );
}