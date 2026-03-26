// =============================================================================
// DADOS DOS CURSOS CIENTÍFICO-HUMANÍSTICOS — Ensino Secundário Portugal
// Design: Apple Education White — dados estruturados para cálculo de médias
// =============================================================================

export type TipoDisciplina = "trienal" | "bienal" | "anual";
export type AnoDisciplina = "10" | "11" | "12" | "10-11" | "10-11-12";

export interface Disciplina {
  id: string;
  nome: string;
  tipo: TipoDisciplina; // define o peso: trienal=3, bienal=2, anual=1
  anos: ("10" | "11" | "12")[]; // anos letivos em que a disciplina ocorre
  exameNacional: boolean;
  codigoExame?: string;
}

export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  disciplinas: Disciplina[];
}

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

// Disciplinas com exame nacional (para as opcionais de 12º)
export const DISCIPLINAS_COM_EXAME_12: Partial<Record<DisciplinaOpcional12, string>> = {
  "Inglês": "550",
  "Biologia": "702",
  "Física": "715",
  "Química": "716",
  "Filosofia A": "714",
  "Economia C": "721",
  "Geografia C": "719",
  "Psicologia B": "723",
};

// ─── CURSOS ──────────────────────────────────────────────────────────────────

export const CURSOS: Curso[] = [
  {
    id: "ct",
    nome: "Ciências e Tecnologias",
    descricao: "Matemática A, Física-Química, Biologia e Geologia",
    cor: "#0071E3",
    disciplinas: [
      // Trienais (peso 3) — 10º, 11º, 12º
      {
        id: "ct-portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "ct-matematica",
        nome: "Matemática A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "635",
      },
      // Bienais (peso 2) — 10º e 11º
      {
        id: "ct-filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "ct-fqa",
        nome: "Física e Química A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "ct-bio-geo",
        nome: "Biologia e Geologia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "ct-ef",
        nome: "Educação Física",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
    ],
  },
  {
    id: "cse",
    nome: "Ciências Socioeconómicas",
    descricao: "Matemática Aplicada às Ciências Sociais, Economia",
    cor: "#34C759",
    disciplinas: [
      // Trienais (peso 3)
      {
        id: "cse-portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "cse-matematica",
        nome: "Matemática Aplicada às Ciências Sociais",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "635",
      },
      // Bienais (peso 2)
      {
        id: "cse-filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "cse-economia",
        nome: "Economia A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "cse-historia",
        nome: "História A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "cse-ef",
        nome: "Educação Física",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
    ],
  },
  {
    id: "lh",
    nome: "Línguas e Humanidades",
    descricao: "História, Geografia, Língua Estrangeira",
    cor: "#FF9500",
    disciplinas: [
      // Trienais (peso 3)
      {
        id: "lh-portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "lh-historia",
        nome: "História A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "640",
      },
      // Bienais (peso 2)
      {
        id: "lh-filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "lh-geografia",
        nome: "Geografia A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "lh-lingua",
        nome: "Língua Estrangeira I, II ou III",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "lh-ef",
        nome: "Educação Física",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
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
        id: "av-portugues",
        nome: "Português",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "639",
      },
      {
        id: "av-desenho",
        nome: "Desenho A",
        tipo: "trienal",
        anos: ["10", "11", "12"],
        exameNacional: true,
        codigoExame: "701",
      },
      // Bienais (peso 2)
      {
        id: "av-filosofia",
        nome: "Filosofia",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "av-geometria",
        nome: "Geometria Descritiva A",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "av-hca",
        nome: "História da Cultura e das Artes",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
      },
      {
        id: "av-ef",
        nome: "Educação Física",
        tipo: "bienal",
        anos: ["10", "11"],
        exameNacional: false,
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

export function calcularCIF(periodos: (number | null)[]): number | null {
  const validos = periodos.filter((p): p is number => p !== null && !isNaN(p));
  if (validos.length === 0) return null;
  return validos.reduce((a, b) => a + b, 0) / validos.length;
}

export function calcularCFD(cif: number, notaExame: number | null, tipoExame: "interno" | "ingresso" | null): number {
  if (tipoExame === "interno" && notaExame !== null) {
    return cif * 0.75 + notaExame * 0.25;
  }
  return cif;
}

export function calcularMediaFinal(disciplinas: { cfd: number; peso: number }[]): number | null {
  const validas = disciplinas.filter((d) => !isNaN(d.cfd));
  if (validas.length === 0) return null;
  const somaPonderada = validas.reduce((acc, d) => acc + d.cfd * d.peso, 0);
  const somaPesos = validas.reduce((acc, d) => acc + d.peso, 0);
  return Math.round((somaPonderada / somaPesos) * 10) / 10;
}

export function normalizarNota(nota: number | string): number | null {
  const n = typeof nota === "string" ? parseFloat(nota.replace(",", ".")) : nota;
  if (isNaN(n)) return null;
  // Se nota > 20, assume escala 0-200 e converte
  if (n > 20) return Math.round((n / 200) * 20 * 10) / 10;
  return Math.min(20, Math.max(0, n));
}
