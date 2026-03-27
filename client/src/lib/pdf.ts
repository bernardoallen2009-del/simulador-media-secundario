import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SimuladorState, ResultadoFinal } from "@/contexts/SimuladorContext";
import { CURSOS, getNomeExame } from "./cursos";

export function gerarPDF(state: SimuladorState) {
  const { resultado, cursoPorId, dadosDisciplinas, opcional1, opcional2 } = state;
  const curso = CURSOS.find((c) => c.id === cursoPorId);

  if (!resultado || !curso) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(20);
  doc.setTextColor(0, 113, 227); // Azul Apple
  doc.text("Simulador de Média - Ensino Secundário", pageWidth / 2, 20, { align: "center" });

  // Info do Curso e Média
  doc.setFontSize(12);
  doc.setTextColor(29, 29, 31);
  doc.text(`Curso: ${curso.nome}`, 20, 35);
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Média Final: ${resultado.mediaFinal?.toFixed(1) ?? "—"}`, 20, 45);
  doc.setFont("helvetica", "normal");

  let currentY = 55;

  // Tabela Detalhada de Notas por Período
  doc.setFontSize(14);
  doc.text("Detalhes das Notas por Período", 20, currentY);
  currentY += 5;

  const tableData: any[] = [];

  // Disciplinas Regulares
  curso.disciplinas.forEach((disc) => {
    // Filtrar opções específicas do curso se necessário (como no SimuladorContext)
    if (curso.id === "ct" && (disc.id === "bio-geo" || disc.id === "geometria-desc")) {
      if (disc.id !== state.opcaoBioGeomDesc) return;
    }
    if (curso.id === "cse" && (disc.id === "geografia-a" || disc.id === "historia-b")) {
      if (disc.id !== state.opcaoGeografiaHistoria) return;
    }
    if (curso.id === "av" && (disc.id === "historia-cultura" || disc.id === "matematica-b")) {
      if (disc.id !== state.opcaoArtesVisuais) return;
    }

    const dados = dadosDisciplinas[disc.id];
    
    disc.anos.forEach((ano) => {
      const notas = dados?.notas[ano] || { p1: "—", p2: "—", p3: "—" };
      tableData.push([
        disc.nome,
        `${ano}º Ano`,
        notas.p1 || "—",
        notas.p2 || "—",
        notas.p3 || "—"
      ]);
    });
  });

  // Opcionais 12º
  [opcional1, opcional2].forEach((opc, idx) => {
    if (opc.nome) {
      tableData.push([
        `Opcional ${idx + 1}: ${opc.nome}`,
        "12º Ano",
        opc.notas.p1 || "—",
        opc.notas.p2 || "—",
        opc.notas.p3 || "—"
      ]);
    }
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Disciplina", "Ano", "P1", "P2", "P3"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [0, 113, 227] },
    margin: { left: 20, right: 20 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Tabela de Classificações Finais (CIF, Exame, CFD)
  doc.setFontSize(14);
  doc.text("Resumo de Classificações Finais", 20, currentY);
  currentY += 5;

  const summaryData = resultado.disciplinas.map((d) => [
    d.nome,
    d.tipo.charAt(0).toUpperCase() + d.tipo.slice(1),
    d.cif?.toFixed(1) ?? "—",
    d.exameAplicado ? `${getNomeExame(d.exameAplicado.codigoExame)}: ${d.exameAplicado.notaExame}` : "—",
    d.cfd?.toFixed(1) ?? "—"
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Disciplina", "Tipo", "CIF", "Exame", "CFD Final"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [0, 113, 227] },
    margin: { left: 20, right: 20 },
  });

  // Rodapé
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-PT")} - Simulador de Média não oficial`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`simulacao-media-${curso.id}.pdf`);
}
