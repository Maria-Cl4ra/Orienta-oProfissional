import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Briefcase, DollarSign, Clock, GraduationCap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

const areas = ["Todas", "Exatas", "Humanas", "Biológicas", "Artes", "Desenvolvimento de Sistemas", "Música"];

export default function ExploreCareers() {
  const location = useLocation();
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.state?.filterArea) {
      setFilter(location.state.filterArea);
    }
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const data = await base44.entities.Career.list("-created_date", 100);
      setCareers(data);
    } catch (e) {
      // error
    } finally {
      setLoading(false);
    }
  };

  const filtered = careers.filter(c => {
    const matchArea = filter === "Todas" || c.area === filter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <Layout centerLabel="EXPLORAR CARREIRAS" showBackButton={true}>
      <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-script font-bold text-owl-purple mb-2">Explorar Carreiras</h1>
          <p className="text-muted-foreground text-sm">
            Conheça profissões, salários médios e tempo de formação para planejar seu futuro.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar profissão..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-foreground/10 bg-white focus:border-owl-purple focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Area filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {areas.map(a => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                filter === a
                  ? "bg-owl-navy text-white"
                  : "bg-white text-owl-navy border border-muted-foreground/20 hover:border-owl-purple"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Career cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma profissão encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((career, i) => (
              <button
                key={career.id}
                onClick={() => navigate(`/carreira/${career.id}`)}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-muted/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {career.image_url && (
                  <div className="relative h-40 overflow-hidden">
                    <img src={career.image_url} alt={career.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-owl-purple text-white text-xs font-bold rounded-full">
                      {career.area}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  {!career.image_url && (
                    <span className="inline-block px-3 py-1 bg-owl-purpleLight/20 text-owl-purple text-xs font-bold rounded-full mb-3">
                      {career.area}
                    </span>
                  )}
                  <h3 className="font-bold text-owl-navy text-lg mb-2">{career.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{career.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    {career.average_salary && (
                      <span className="flex items-center gap-1 text-owl-navy font-medium">
                        <DollarSign className="w-3 h-3" />
                        {career.average_salary}
                      </span>
                    )}
                    {career.education_time && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {career.education_time}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-owl-purple font-semibold text-sm group-hover:gap-2 transition-all">
                    Saiba Mais
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}