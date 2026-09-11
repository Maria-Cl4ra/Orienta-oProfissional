import { base44 } from "@/api/base44Client";

export const BADGE_DEFS = [
  { name: "Primeiro Teste", description: "Completou seu primeiro teste vocacional", icon: "Award" },
  { name: "Explorador de Carreiras", description: "Visitou a página de carreiras", icon: "Compass" },
  { name: "Especialista em Tecnologia", description: "Obteve 80%+ em Tecnologia", icon: "Cpu" },
  { name: "Mente Criativa", description: "Obteve 80%+ em Criatividade", icon: "Palette" },
  { name: "Líder Nato", description: "Obteve 80%+ em Liderança", icon: "Crown" },
  { name: "Analista Brilhante", description: "Obteve 80%+ em Análise", icon: "BarChart3" },
  { name: "Cientista em Potencial", description: "Obteve 80%+ em Ciências", icon: "FlaskConical" },
  { name: "Empreendedor Nato", description: "Obteve 80%+ em Negócios", icon: "Briefcase" },
  { name: "Comunicador Excelente", description: "Obteve 80%+ em Comunicação", icon: "MessageCircle" },
  { name: "100% do Relatório Lido", description: "Visualizou o relatório completo", icon: "BookOpen" }
];

const COMPETENCY_BADGES = {
  "Especialista em Tecnologia": { comp: "Tecnologia", min: 80 },
  "Mente Criativa": { comp: "Criatividade", min: 80 },
  "Líder Nato": { comp: "Liderança", min: 80 },
  "Analista Brilhante": { comp: "Análise", min: 80 },
  "Cientista em Potencial": { comp: "Ciências", min: 80 },
  "Empreendedor Nato": { comp: "Negócios", min: 80 },
  "Comunicador Excelente": { comp: "Comunicação", min: 80 }
};

export async function awardTestBadges(competencies) {
  const toAward = [{ name: "Primeiro Teste", description: "Completou seu primeiro teste vocacional", icon: "Award" }];

  Object.entries(COMPETENCY_BADGES).forEach(([badgeName, { comp, min }]) => {
    if ((competencies[comp] || 0) >= min) {
      const def = BADGE_DEFS.find(b => b.name === badgeName);
      if (def) toAward.push(def);
    }
  });

  try {
    const existing = await base44.entities.Badge.list();
    const existingNames = new Set(existing.map(b => b.name));
    const newlyEarned = [];
    for (const badge of toAward) {
      if (!existingNames.has(badge.name)) {
        try {
          await base44.entities.Badge.create(badge);
          newlyEarned.push(badge);
        } catch (e) {}
      }
    }
    return newlyEarned;
  } catch (e) {
    return [];
  }
}

export async function awardBadge(badgeName) {
  const def = BADGE_DEFS.find(b => b.name === badgeName);
  if (!def) return null;
  try {
    const existing = await base44.entities.Badge.filter({ name: badgeName });
    if (existing.length > 0) return null;
    await base44.entities.Badge.create(def);
    return def;
  } catch (e) {
    return null;
  }
}