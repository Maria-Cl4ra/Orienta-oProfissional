export const CATEGORIES = [
  "Programação", "Design", "Matemática", "ENEM", "Idiomas",
  "Inteligência Artificial", "Banco de Dados", "Desenvolvimento Web",
  "Mobile", "Carreira", "Faculdade", "Projetos", "Artes", "Música", "Pintura", 
  "Ciência", "Tecnologia", "Empreendedorismo", "Outros"
];

export const AREAS = ["Exatas", "Humanas", "Biológicas", "Artes", "Desenvolvimento de Sistemas", "Música"];

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}