// 12 competências analisadas pelo teste vocacional
export const COMPETENCIES = [
  "Criatividade", "Liderança", "Empatia", "Lógica", "Comunicação",
  "Organização", "Análise", "Pesquisa", "Tecnologia", "Ciências",
  "Negócios", "Arte"
];

// Templates ideais por área (valores 0-100)
export const AREA_TEMPLATES = {
  "Exatas": { Criatividade: 35, Liderança: 40, Empatia: 40, Lógica: 90, Comunicação: 45, Organização: 75, Análise: 85, Pesquisa: 70, Tecnologia: 55, Ciências: 65, Negócios: 55, Arte: 30 },
  "Humanas": { Criatividade: 50, Liderança: 75, Empatia: 85, Lógica: 40, Comunicação: 85, Organização: 65, Análise: 55, Pesquisa: 60, Tecnologia: 30, Ciências: 35, Negócios: 45, Arte: 40 },
  "Biológicas": { Criatividade: 35, Liderança: 40, Empatia: 55, Lógica: 65, Comunicação: 50, Organização: 60, Análise: 80, Pesquisa: 85, Tecnologia: 40, Ciências: 90, Negócios: 35, Arte: 30 },
  "Artes": { Criatividade: 90, Liderança: 45, Empatia: 60, Lógica: 30, Comunicação: 65, Organização: 45, Análise: 35, Pesquisa: 35, Tecnologia: 35, Ciências: 25, Negócios: 35, Arte: 85 },
  "Desenvolvimento de Sistemas": { Criatividade: 55, Liderança: 50, Empatia: 45, Lógica: 88, Comunicação: 60, Organização: 70, Análise: 78, Pesquisa: 55, Tecnologia: 92, Ciências: 35, Negócios: 50, Arte: 40 },
  "Música": { Criatividade: 80, Liderança: 40, Empatia: 50, Lógica: 40, Comunicação: 55, Organização: 45, Análise: 35, Pesquisa: 35, Tecnologia: 35, Ciências: 30, Negócios: 30, Arte: 75 }
};

// Estrutura do teste multi-etapas
export const STEPS = [
  {
    id: "profile",
    title: "Perfil Inicial",
    icon: "👤",
    questions: [
      { id: "p_idade", type: "select", question: "Qual sua idade?", options: [
        { text: "Até 18 anos" }, { text: "19 a 25 anos" }, { text: "26 a 30 anos" }, { text: "31 anos ou mais" }
      ]},
      { id: "p_trabalha", type: "select", question: "Você já trabalha?", options: [
        { text: "Sim, atualmente" }, { text: "Já trabalhei" }, { text: "Nunca trabalhei" }
      ]},
      { id: "p_faculdade", type: "select", question: "Pretende fazer faculdade?", options: [
        { text: "Sim, com certeza" }, { text: "Estou pensando" }, { text: "Ainda não" }
      ]},
      { id: "p_empreender", type: "select", question: "Deseja empreender?", options: [
        { text: "Sim, é prioridade" }, { text: "Talvez um dia" }, { text: "Não pretendo" }
      ]},
      { id: "p_sabe_carreira", type: "select", question: "Já sabe qual carreira deseja seguir?", options: [
        { text: "Sim, tenho clareza" }, { text: "Tenho ideias, mas dúvida" }, { text: "Estou em dúvida total" }
      ]}
    ]
  },
  {
    id: "interests",
    title: "Interesses",
    icon: "✨",
    questions: [
      { id: "i1", type: "select", question: "Você prefere...", options: [
        { text: "Resolver um problema matemático", weights: { Lógica: 5, Análise: 3 } },
        { text: "Criar um desenho", weights: { Criatividade: 5, Arte: 4 } },
        { text: "Conversar com pessoas", weights: { Comunicação: 5, Empatia: 4 } },
        { text: "Programar", weights: { Tecnologia: 5, Lógica: 4 } }
      ]},
      { id: "i2", type: "select", question: "Você prefere...", options: [
        { text: "Cuidar de animais", weights: { Ciências: 5, Empatia: 3 } },
        { text: "Organizar eventos", weights: { Organização: 5, Negócios: 3 } },
        { text: "Fazer experimentos", weights: { Ciências: 5, Pesquisa: 4, Análise: 3 } },
        { text: "Escrever histórias", weights: { Criatividade: 4, Comunicação: 3 } }
      ]},
      { id: "i3", type: "select", question: "Você prefere...", options: [
        { text: "Liderar equipes", weights: { Liderança: 5, Comunicação: 3 } },
        { text: "Produzir vídeos", weights: { Criatividade: 4, Arte: 3, Tecnologia: 2 } },
        { text: "Analisar dados", weights: { Análise: 5, Lógica: 3, Organização: 2 } },
        { text: "Pintar um quadro", weights: { Arte: 5, Criatividade: 4 } }
      ]},
      { id: "i4", type: "select", question: "Você prefere...", options: [
        { text: "Estudar história", weights: { Pesquisa: 4, Comunicação: 3 } },
        { text: "Criar aplicativos", weights: { Tecnologia: 5, Lógica: 4, Criatividade: 2 } },
        { text: "Fazer cirurgias", weights: { Ciências: 5, Empatia: 3, Análise: 2 } },
        { text: "Tocar música", weights: { Arte: 5, Criatividade: 4 } }
      ]},
      { id: "i5", type: "select", question: "Você prefere...", options: [
        { text: "Trabalhar com números", weights: { Lógica: 5, Análise: 4, Negócios: 2 } },
        { text: "Trabalhar com textos", weights: { Comunicação: 5, Criatividade: 2 } },
        { text: "Trabalhar com imagens", weights: { Arte: 5, Criatividade: 4 } },
        { text: "Trabalhar com código", weights: { Tecnologia: 5, Lógica: 4, Análise: 2 } }
      ]},
      { id: "i6", type: "select", question: "Você prefere...", options: [
        { text: "Ensinar pessoas", weights: { Comunicação: 5, Empatia: 4, Liderança: 2 } },
        { text: "Pesquisar informações", weights: { Pesquisa: 5, Análise: 3 } },
        { text: "Desenvolver produtos", weights: { Negócios: 4, Criatividade: 3, Organização: 2 } },
        { text: "Compor melodias", weights: { Arte: 5, Criatividade: 4 } }
      ]},
      { id: "i7", type: "select", question: "Você prefere...", options: [
        { text: "Cuidar do meio ambiente", weights: { Ciências: 5, Pesquisa: 3 } },
        { text: "Administrar empresas", weights: { Negócios: 5, Organização: 4, Liderança: 2 } },
        { text: "Criar conteúdo digital", weights: { Criatividade: 4, Tecnologia: 3, Comunicação: 2 } },
        { text: "Estudar física", weights: { Lógica: 4, Análise: 4, Ciências: 3 } }
      ]},
      { id: "i8", type: "select", question: "Você prefere...", options: [
        { text: "Atender clientes", weights: { Comunicação: 5, Empatia: 4 } },
        { text: "Projetar construções", weights: { Arte: 3, Organização: 4, Análise: 3 } },
        { text: "Investigar fenômenos", weights: { Pesquisa: 5, Ciências: 4, Análise: 2 } },
        { text: "Editar fotos", weights: { Arte: 4, Criatividade: 3, Tecnologia: 2 } }
      ]}
    ]
  },
  {
    id: "personality",
    title: "Personalidade",
    icon: "🧠",
    questions: [
      { id: "pe1", type: "scale", question: "Sou uma pessoa criativa e inovadora", weights: { Criatividade: 1.5 } },
      { id: "pe2", type: "scale", question: "Gosto de liderar e assumir responsabilidades", weights: { Liderança: 1.5 } },
      { id: "pe3", type: "scale", question: "Tenho empatia e solidariedade com as pessoas", weights: { Empatia: 1.5 } },
      { id: "pe4", type: "scale", question: "Raciocino de forma lógica e estruturada", weights: { Lógica: 1.5 } },
      { id: "pe5", type: "scale", question: "Comunico-me com facilidade", weights: { Comunicação: 1.5 } },
      { id: "pe6", type: "scale", question: "Sou organizado(a) e metódico(a)", weights: { Organização: 1.5 } },
      { id: "pe7", type: "scale", question: "Gosto de analisar informações e dados", weights: { Análise: 1.5 } },
      { id: "pe8", type: "scale", question: "Tenho curiosidade investigativa", weights: { Pesquisa: 1.5 } },
      { id: "pe9", type: "scale", question: "Domino tecnologias e ferramentas digitais", weights: { Tecnologia: 1.5 } },
      { id: "pe10", type: "scale", question: "Tenho interesse por ciências e experimentos", weights: { Ciências: 1.5 } }
    ]
  },
  {
    id: "values",
    title: "Valores",
    icon: "💎",
    questions: [
      { id: "v1", type: "scale", question: "Estabilidade financeira", weights: { Negócios: 1.5 } },
      { id: "v2", type: "scale", question: "Ajudar e acolher pessoas", weights: { Empatia: 1.5, Comunicação: 0.5 } },
      { id: "v3", type: "scale", question: "Reconhecimento profissional", weights: { Liderança: 1.5 } },
      { id: "v4", type: "scale", question: "Liberdade e expressão criativa", weights: { Criatividade: 1.5, Arte: 1 } },
      { id: "v5", type: "scale", question: "Segurança e previsibilidade", weights: { Organização: 1.5 } },
      { id: "v6", type: "scale", question: "Impacto social", weights: { Empatia: 1, Comunicação: 1 } },
      { id: "v7", type: "scale", question: "Inovação e tecnologia", weights: { Tecnologia: 1.5, Criatividade: 0.5 } },
      { id: "v8", type: "scale", question: "Empreendedorismo", weights: { Negócios: 1.5, Liderança: 0.5 } }
    ]
  },
  {
    id: "environment",
    title: "Ambiente de Trabalho",
    icon: "🏢",
    questions: [
      { id: "e1", type: "multi", question: "Selecione todos os ambientes onde prefere trabalhar:", options: [
        { text: "Escritório corporativo", weights: { Organização: 3, Negócios: 2 } },
        { text: "Laboratório", weights: { Ciências: 4, Pesquisa: 3 } },
        { text: "Hospital", weights: { Ciências: 4, Empatia: 3 } },
        { text: "Escola ou faculdade", weights: { Comunicação: 3, Liderança: 2 } },
        { text: "Natureza / campo", weights: { Ciências: 3, Pesquisa: 3 } },
        { text: "Home office", weights: { Tecnologia: 3, Organização: 2 } },
        { text: "Startup", weights: { Tecnologia: 3, Negócios: 2, Criatividade: 2 } },
        { text: "Estúdio criativo", weights: { Arte: 4, Criatividade: 3 } },
        { text: "Indústria", weights: { Organização: 3, Análise: 2 } },
        { text: "Agência / criativo", weights: { Criatividade: 3, Arte: 2, Comunicação: 2 } }
      ]}
    ]
  },
  {
    id: "skills",
    title: "Habilidades",
    icon: "⚡",
    questions: [
      { id: "h1", type: "scale", question: "Matemática", weights: { Lógica: 1.8 } },
      { id: "h2", type: "scale", question: "Português e redação", weights: { Comunicação: 1.8 } },
      { id: "h3", type: "scale", question: "Lógica de programação", weights: { Tecnologia: 1.8, Lógica: 1 } },
      { id: "h4", type: "scale", question: "Desenho e ilustração", weights: { Arte: 1.8, Criatividade: 1 } },
      { id: "h5", type: "scale", question: "Música e áudio", weights: { Arte: 1.8 } },
      { id: "h6", type: "scale", question: "Comunicação e expressão", weights: { Comunicação: 1.8 } },
      { id: "h7", type: "scale", question: "Liderança e gestão", weights: { Liderança: 1.8 } },
      { id: "h8", type: "scale", question: "Idiomas estrangeiros", weights: { Comunicação: 1, Pesquisa: 1 } },
      { id: "h9", type: "scale", question: "Tecnologia e informática", weights: { Tecnologia: 1.8 } },
      { id: "h10", type: "scale", question: "Organização e planejamento", weights: { Organização: 1.8 } }
    ]
  },
  {
    id: "lifestyle",
    title: "Estilo de Vida",
    icon: "🌅",
    questions: [
      { id: "l1", type: "select", question: "Você prefere...", options: [
        { text: "Rotina fixa e previsível", weights: { Organização: 4 } },
        { text: "Rotina dinâmica e flexível", weights: { Criatividade: 4 } }
      ]},
      { id: "l2", type: "select", question: "Você prefere...", options: [
        { text: "Trabalhar sozinho", weights: { Pesquisa: 3, Análise: 2 } },
        { text: "Trabalhar em equipe", weights: { Comunicação: 4, Liderança: 2 } }
      ]},
      { id: "l3", type: "select", question: "Você aceitaria viajar constantemente?", options: [
        { text: "Sim, sem problemas", weights: { Pesquisa: 3, Ciências: 2 } },
        { text: "Às vezes", weights: { Organização: 1 } },
        { text: "Prefiro ficar no local", weights: { Organização: 3 } }
      ]},
      { id: "l4", type: "select", question: "Como prefere trabalhar?", options: [
        { text: "Remoto", weights: { Tecnologia: 4, Organização: 2 } },
        { text: "Presencial", weights: { Comunicação: 3, Organização: 2 } },
        { text: "Híbrido", weights: { Tecnologia: 2, Organização: 2, Comunicação: 1 } }
      ]},
      { id: "l5", type: "select", question: "Qual carga horária prefere?", options: [
        { text: "Flexível", weights: { Criatividade: 3, Negócios: 2 } },
        { text: "Fixa e definida", weights: { Organização: 3 } }
      ]},
      { id: "l6", type: "select", question: "Você gostaria de abrir sua própria empresa?", options: [
        { text: "Sim, é sonho", weights: { Negócios: 5, Liderança: 3, Criatividade: 2 } },
        { text: "Talvez um dia", weights: { Negócios: 2, Liderança: 1 } },
        { text: "Prefiro ser funcionário", weights: { Organização: 3 } }
      ]}
    ]
  }
];

export const SCALE_LABELS = ["Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"];

// Calcula as pontuações de competências (0-100) a partir das respostas
export function computeCompetencies(answers) {
  const raw = {};
  const max = {};
  COMPETENCIES.forEach(c => { raw[c] = 0; max[c] = 0; });

  STEPS.forEach(step => {
    if (!step.questions) return;
    step.questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) return;

      if (q.type === "select") {
        let qMax = {};
        q.options.forEach(o => {
          if (o.weights) Object.entries(o.weights).forEach(([c, v]) => {
            qMax[c] = Math.max(qMax[c] || 0, v);
          });
        });
        Object.entries(qMax).forEach(([c, v]) => { max[c] += v; });
        const opt = q.options[ans];
        if (opt?.weights) {
          Object.entries(opt.weights).forEach(([c, v]) => { raw[c] += v; });
        }
      } else if (q.type === "scale") {
        if (q.weights) {
          Object.entries(q.weights).forEach(([c, v]) => {
            raw[c] += v * ans;
            max[c] += v * 5;
          });
        }
      } else if (q.type === "multi") {
        if (Array.isArray(ans)) {
          q.options.forEach((opt, i) => {
            if (opt.weights) {
              Object.entries(opt.weights).forEach(([c, v]) => {
                max[c] += v;
                if (ans.includes(i)) raw[c] += v;
              });
            }
          });
        }
      }
    });
  });

  const result = {};
  COMPETENCIES.forEach(c => {
    result[c] = max[c] > 0 ? Math.round((raw[c] / max[c]) * 100) : 0;
  });
  return result;
}

// Similaridade por cosseno entre vetor do usuário e template
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  COMPETENCIES.forEach(c => {
    const a = vecA[c] || 0;
    const b = vecB[c] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  });
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// Compatibiliza carreiras com base nas competências do usuário
export function matchCareers(competencies, careers) {
  const matches = careers.map(career => {
    const template = AREA_TEMPLATES[career.area] || AREA_TEMPLATES["Exatas"];
    const similarity = cosineSimilarity(competencies, template);
    return { ...career, compatibility: Math.round(similarity * 100) };
  });
  matches.sort((a, b) => b.compatibility - a.compatibility);
  return matches;
}

// Gera texto de perfil personalizado
export function generateProfileText(competencies) {
  const sorted = Object.entries(competencies).sort(([, a], [, b]) => b - a);
  const top3 = sorted.slice(0, 3).map(([k]) => k.toLowerCase());
  const bottom2 = sorted.slice(-2).map(([k]) => k.toLowerCase());
  const topArea = matchAreas(competencies)[0];

  return `Seu perfil profissional destaca forte ${top3[0]}, ${top3[1]} e ${top3[2]}. ` +
    `A área com maior compatibilidade é ${topArea.area} (${topArea.compatibility}%). ` +
    `Você demonstra potencial nesses pontos, enquanto ${bottom2[0]} e ${bottom2[1]} ` +
    `podem ser áreas a desenvolver com o tempo e a prática.`;
}

// Compatibilidade por área
export function matchAreas(competencies) {
  return Object.entries(AREA_TEMPLATES).map(([area, template]) => ({
    area,
    compatibility: Math.round(cosineSimilarity(competencies, template) * 100)
  })).sort((a, b) => b.compatibility - a.compatibility);
}