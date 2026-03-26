// =============================================================================
// DADOS DOS CURSOS CIENTÍFICO-HUMANÍSTICOS — Ensino Secundário Portugal
// Design: Apple Education White — dados estruturados para cálculo de médias
// Atualizado: Estrutura com disciplinas obrigatórias/opcionais 10-11, exames por disciplina
// =============================================================================

export type TipoDisciplina = "trienal" | "bienal" | "anual";

export interface Disciplina {
  id: string;
  nome: string;
  tipo: TipoDisciplina;
  anos: ("10" | "11" | "12")[];
  exameNacional: boolean;
  codigoExame?: string; // código do exame que corresponde a esta disciplina
}

export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  disciplinas: Disciplina[];
}

// ─── LISTA COMPLETA DE EXAMES DISPONÍVEIS ────────────────────────────────────

export const EXAMES_DISPONIVEIS = [
  { codigo: "550", nome: "Inglês" },
  { codigo: "623", nome: "História A" },
  { codigo: "635", nome: "Matemática A" },
  { codigo: "639", nome: "Português" },
  { codigo: "702", nome: "Biologia e Geologia" },
  { codigo: "706", nome: "Desenho A" },
  { codigo: "708", nome: "Geometria Descritiva A" },
  { codigo: "712", nome: "Economia A" },
  { codigo: "714", nome: "Filosofia" },
  { codigo: "715", nome: "Física e Química A" },
  { codigo: "719", nome: "Geografia A" },
  { codigo: "723", nome: "História B" },
  { codigo: "724", nome: "História da Cultura e das Artes" },
  { codigo: "732", nome: "Latim A" },
  { codigo: "734", nome: "Literatura Portuguesa" },
  { codigo: "735", nome: "Matemática B" },
  { codigo: "835", nome: "Matemática A" },
] as const;

export type CodigoExame = (typeof EXAMES_DISPONIVEIS)[number]["codigo"];

// Mapeamento: código exame → ID disciplina que corresponde
export const EXAME_PARA_DISCIPLINA: Record<string, string> = {
  "550": "ingles", // Inglês
  "623": "historia-a", // História A
  "635": "matematica-a", // Matemática A
  "639": "portugues", // Português
  "702": "bio-geo", // Biologia e Geologia
  "706": "desenho-a", // Desenho A
  "708": "geometria-desc", // Geometria Descritiva A
  "712": "economia-a", // Economia A
  "714": "filosofia", // Filosofia
  "715": "fqa", // Física e Química A
  "719": "geografia-a", // Geografia A
  "723": "historia-b", // História B
  "724": "hca", // História da Cultura e das Artes
  "732": "latim-a", // Latim A
  "734": "literatura-pt", // Literatura Portuguesa
  "735": "matematica-b", // Matemática B
  "835": "macs", // MACS
};

// Disciplinas de 12º ano opcionais (anuais, peso=1)
export const DISCIPLINAS_12_OPCOES = [
  "Aplicações Informáticas B",
  "Clássicos da Literatura",
  "Direito",
  "Geografia C",
  "Economia C",
  "Filosofia A",
  "Inglês",
  "Psicologia B",
  "Biologia",
  "Física",
  "Química",
] as const;

export type DisciplinaOpcional12 = (typeof DISCIPLINAS_12_OPCOES)[number];

// ─── CURSOS ──────────────────────────────────────────────────────────────────

export const CURSOS: Curso[] = [
  {
    id: "ct",
    nome: "Ciências e Tecnologias",
    descricao: "Matemática A, Física-Química, Biologia/Geometria Descritiva",
    cor: "#0071E3",
    disciplinas: [
      // Trienais (peso 3) — 10º, 11º, 12º
      {
        id: "portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "matematica-a",
        nome: "Matemática A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "635",
      },
      {
        id: "ef",
        nome: "Educação Física",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: false,
      },
      // Bienais (peso 2) — 10º e 11º — OBRIGATÓRIAS
      {
        id: "fqa",
        nome: "Física e Química A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "715",
      },
      {
        id: "ingles",
        nome: "Inglês",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "550",
      },
      {
        id: "filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "714",
      },
      // Bienais (peso 2) — 10º e 11º — OPÇÕES (escolher 1)
      {
        id: "bio-geo",
        nome: "Biologia e Geologia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "702",
      },
      {
        id: "geometria-desc",
        nome: "Geometria Descritiva A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "708",
      },
    ],
  },
  {
    id: "cse",
    nome: "Ciências Socioeconómicas",
    descricao: "Matemática Aplicada, Economia, História ou Geografia",
    cor: "#34C759",
    disciplinas: [
      // Trienais (peso 3)
      {
        id: "portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "macs",
        nome: "Matemática A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "835",
      },
      {
        id: "ef",
        nome: "Educação Física",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: false,
      },
      // Bienais (peso 2) — 10º e 11º — OBRIGATÓRIAS
      {
        id: "economia-a",
        nome: "Economia A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "712",
      },
      {
        id: "ingles",
        nome: "Inglês",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "550",
      },
      {
        id: "filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "714",
      },
      // Bienais (peso 2) — 10º e 11º — OPÇÕES (escolher 1)
      {
        id: "historia-b",
        nome: "História B",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "723",
      },
      {
        id: "geografia-a",
        nome: "Geografia A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "719",
      },
    ],
  },
  {
    id: "lh",
    nome: "Línguas e Humanidades",
    descricao: "História A, Geografia, Latim, Literatura, MACS",
    cor: "#FF9500",
    disciplinas: [
      // Trienais (peso 3)
      {
        id: "portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "historia-a",
        nome: "História A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "623",
      },
      {
        id: "ef",
        nome: "Educação Física",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: false,
      },
      // Bienais (peso 2) — 10º e 11º — OBRIGATÓRIA
      {
        id: "ingles",
        nome: "Inglês",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "550",
      },
      {
        id: "filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "714",
      },
      // Bienais (peso 2) — 10º e 11º — OPÇÕES (escolher 2)
      {
        id: "geografia-a",
        nome: "Geografia A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "719",
      },
      {
        id: "latim-a",
        nome: "Latim A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "732",
      },
      {
        id: "lingua-estrangeira",
        nome: "Língua Estrangeira II ou III",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "550",
      },
      {
        id: "literatura-pt",
        nome: "Literatura Portuguesa",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "734",
      },
      {
        id: "macs",
        nome: "Matemática A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "835",
      },
    ],
  },
  {
    id: "av",
    nome: "Artes Visuais",
    descricao: "Desenho A, Geometria Descritiva, História da Cultura e das Artes",
    cor: "#FF3B30",
    disciplinas: [
      // Trienais (peso 3)
      {
        id: "portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "desenho-a",
        nome: "Desenho A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "706",
      },
      {
        id: "ef",
        nome: "Educação Física",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: false,
      },
      // Bienais (peso 2) — 10º e 11º — OBRIGATÓRIAS
      {
        id: "ingles",
        nome: "Inglês",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "550",
      },
      {
        id: "filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "714",
      },
      // Bienais (peso 2) — 10º e 11º — OPÇÕES (escolher 2)
      {
        id: "geometria-desc",
        nome: "Geometria Descritiva A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "708",
      },
      {
        id: "hca",
        nome: "História da Cultura e das Artes",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
        codigoExame: "724",
      },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getPesoDisciplina(tipo: TipoDisciplina): number {
  switch (tipo) {
    case "trienal": return 3;
    case "bienal": return 2;
    case "anual": return 1;
  }
}

export function calcularCIFComTipo(
  notasPorAno: Array<{ p1: string; p2: string; p3: string }>,
  tipo: "trienal" | "bienal" | "anual"
): number | null {
  if (tipo === "anual") {
    if (notasPorAno.length === 0) return null;
    const periodos = [
      normalizarNota(notasPorAno[0].p1),
      normalizarNota(notasPorAno[0].p2),
      normalizarNota(notasPorAno[0].p3),
    ];
    const validos = periodos.filter((p): p is number => p !== null && !isNaN(p));
    if (validos.length === 0) return null;
    const media = validos.reduce((a, b) => a + b, 0) / validos.length;
    return Math.round(media);
  } else {
    const terceirosPeríodos = notasPorAno.map((n) => normalizarNota(n.p3));
    const validos = terceirosPeríodos.filter((p): p is number => p !== null && !isNaN(p));
    if (validos.length === 0) return null;
    const media = validos.reduce((a, b) => a + b, 0) / validos.length;
    return Math.round(media);
  }
}

export function calcularCIF(periodos: (number | null)[]): number | null {
  const validos = periodos.filter((p): p is number => p !== null && !isNaN(p));
  if (validos.length === 0) return null;
  return validos.reduce((a, b) => a + b, 0) / validos.length;
}

export function calcularCFD(cif: number, notaExame: number | null, tipoExame: "interno" | "ingresso" | null): number {
  if (tipoExame === "interno" && notaExame !== null) {
    // CIF já vem arredondada de calcularCIFComTipo
    return cif * 0.75 + notaExame * 0.25;
  }
  return cif;
}

export function calcularMediaFinal(disciplinas: { cfd: number; peso: number }[]): number | null {
  const validas = disciplinas.filter((d) => !isNaN(d.cfd));
  if (validas.length === 0) return null;
  // Usar CFD arredondados (já vêm arredondados de calcularCFD)
  const somaPonderada = validas.reduce((acc, d) => acc + Math.round(d.cfd) * d.peso, 0);
  const somaPesos = validas.reduce((acc, d) => acc + d.peso, 0);
  const mediaFinal = somaPonderada / somaPesos;
  // Resultado final com 1 casa decimal
  return Math.round(mediaFinal * 10) / 10;
}

export function normalizarNota(nota: number | string): number | null {
  const n = typeof nota === "string" ? parseFloat(nota.replace(",", ".")) : nota;
  if (isNaN(n)) return null;
  if (n > 20) return Math.round((n / 200) * 20 * 10) / 10;
  return Math.min(20, Math.max(0, n));
}

export function getNomeExame(codigo: string): string {
  const exame = EXAMES_DISPONIVEIS.find((e) => e.codigo === codigo);
  return exame?.nome ?? codigo;
}

export function getDisciplinaParaExame(codigoExame: string, curso: Curso): Disciplina | null {
  const discId = EXAME_PARA_DISCIPLINA[codigoExame];
  if (!discId) return null;
  return curso.disciplinas.find((d) => d.id === discId) ?? null;
}
