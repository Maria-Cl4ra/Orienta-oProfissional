import { jsPDF } from "jspdf";

export function generateTestPDF(competencies, topArea, areaMatches, careerMatches, profileText, aiText) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(96, 71, 52); // owl-navy
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório Vocacional", 20, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("MentorOwl — Orientação Profissional Inteligente", 20, 28);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, 34);
  y = 55;

  // Top area
  doc.setTextColor(96, 71, 52);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Área com maior compatibilidade: ${topArea.area}`, 20, y);
  y += 8;
  doc.setFontSize(13);
  doc.text(`Compatibilidade: ${topArea.compatibility}%`, 20, y);
  y += 12;

  // Profile summary
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo do Perfil", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const profileLines = doc.splitTextToSize(profileText, pageWidth - 40);
  doc.text(profileLines, 20, y);
  y += profileLines.length * 5 + 8;

  // Competencies
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Competências (0-100)", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const sortedComps = Object.entries(competencies).sort(([, a], [, b]) => b - a);
  sortedComps.forEach(([comp, score]) => {
    doc.text(`${comp}: ${score}%`, 20, y);
    // Bar
    doc.setFillColor(240, 197, 212);
    doc.rect(80, y - 4, 80, 5, "F");
    doc.setFillColor(96, 71, 52);
    doc.rect(80, y - 4, (score / 100) * 80, 5, "F");
    y += 6;
  });
  y += 6;

  // Area matches
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Compatibilidade por Área", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  areaMatches.forEach(area => {
    doc.text(`${area.area}: ${area.compatibility}%`, 20, y);
    y += 5;
  });
  y += 6;

  // Career matches
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Carreiras Recomendadas", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  careerMatches.slice(0, 8).forEach((career, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(`${i + 1}. ${career.title} (${career.area}) — ${career.compatibility}%`, 20, y);
    y += 5;
  });
  y += 6;

  // AI interpretation
  if (aiText) {
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Análise da IA", 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const aiLines = doc.splitTextToSize(aiText, pageWidth - 40);
    aiLines.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += 5;
    });
  }

  // Footer
  const pages = doc.internal.pages.length;
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("MentorOwl — Seu futuro começa aqui", 20, 287);
    doc.text(`Página ${i}`, pageWidth - 25, 287);
  }

  doc.save("relatorio-vocacional-mentorowl.pdf");
}