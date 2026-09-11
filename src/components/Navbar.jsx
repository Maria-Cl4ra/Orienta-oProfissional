import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Menu, X, User, Settings, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Explorar Carreiras", path: "/carreiras" },
  { label: "Teste Vocacional", path: "/teste-vocacional" },
  { label: "Mentorias", path: "/mentorias" }
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    base44.entities.Profile.filter({ created_by_id: user.id }).then(profs => {
      if (profs[0]) setProfileId(profs[0].id);
    }).catch(() => {});
  }, [isAuthenticated, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isCommunityActive = isActive("/comunidade") || isActive("/perguntas");

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-owl-purpleLight/30">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                isActive(link.path)
                  ? "bg-owl-purpleLight/50 text-owl-navy"
                  : "text-owl-navy/60 hover:text-owl-navy hover:bg-owl-purpleLight/20"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Comunidade dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-colors outline-none",
                isCommunityActive
                  ? "bg-owl-purpleLight/50 text-owl-navy"
                  : "text-owl-navy/60 hover:text-owl-navy hover:bg-owl-purpleLight/20"
              )}
            >
              Comunidade <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="rounded-2xl">
              <DropdownMenuItem onClick={() => navigate("/comunidade")} className="rounded-xl cursor-pointer">
                Feed da Comunidade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/perguntas")} className="rounded-xl cursor-pointer">
                Perguntas &amp; Respostas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Search, Notif, Auth */}
        <div className="flex items-center gap-2">
          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-owl-navy/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-36 lg:w-44 pl-9 pr-3 py-2 rounded-full bg-owl-purpleLight/15 border border-transparent focus:border-owl-purple focus:bg-white focus:outline-none text-sm transition-all"
              />
            </div>
          </form>

          {/* Notifications */}
          {isAuthenticated && (
            <button
              onClick={() => navigate("/notificacoes")}
              className="relative p-2 rounded-full hover:bg-owl-purpleLight/20 transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5 text-owl-navy/70" />
            </button>
          )}

          {/* Auth: logged out */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-full text-sm font-medium text-owl-navy hover:bg-owl-purpleLight/20 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-full text-sm font-bold bg-owl-navy text-white hover:bg-owl-navyDeep transition-colors shadow-sm"
              >
                Cadastrar-se
              </button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-owl-purpleLight/20 transition-colors outline-none">
                <div className="w-8 h-8 rounded-full bg-owl-purpleLight/40 flex items-center justify-center text-owl-navy font-bold text-sm overflow-hidden">
                  {user?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium text-owl-navy max-w-[100px] truncate">
                  {user?.full_name?.split(" ")[0] || "Usuário"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-owl-navy/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-56">
                <DropdownMenuLabel className="text-xs text-owl-navy/50 font-normal truncate">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(profileId ? `/perfil/${profileId}` : "/editar-perfil")} className="rounded-xl cursor-pointer">
                  <User className="w-4 h-4 mr-2" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-xl cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Painel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/historico-testes")} className="rounded-xl cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" /> Histórico Vocacional
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-owl-purpleLight/20 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-owl-navy" /> : <Menu className="w-5 h-5 text-owl-navy" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-owl-purpleLight/30 px-4 py-3 space-y-1 animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-owl-navy/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2.5 rounded-full bg-owl-purpleLight/15 border border-transparent focus:border-owl-purple focus:outline-none text-sm"
            />
          </form>

          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive(link.path) ? "bg-owl-purpleLight/40 text-owl-navy" : "text-owl-navy/70 hover:bg-owl-purpleLight/20"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 py-1 text-xs font-semibold text-owl-navy/40 uppercase mt-2">Comunidade</div>
          <Link to="/comunidade" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-owl-navy/70 hover:bg-owl-purpleLight/20 transition-colors">
            Feed
          </Link>
          <Link to="/perguntas" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-owl-navy/70 hover:bg-owl-purpleLight/20 transition-colors">
            Perguntas &amp; Respostas
          </Link>

          {!isAuthenticated && (
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium border border-owl-navy/20 text-owl-navy"
              >
                Entrar
              </button>
              <button
                onClick={() => { navigate("/register"); setMobileOpen(false); }}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-bold bg-owl-navy text-white"
              >
                Cadastrar-se
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}