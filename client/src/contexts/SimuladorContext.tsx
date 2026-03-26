// =============================================================================
// CONTEXTO GLOBAL DO SIMULADOR — Estado completo da aplicação
// Design: Apple Education White
// Atualizado: Sistema de exames global (seleção centralizada no Passo 4)
// =============================================================================

import React, { createContext, useContext, useReducer } from "react";
import {
  Curso,
  Disciplina,
  DisciplinaOpcional12,
  calcularCFD,
  calcularCIFComTipo,
  calcularMediaFinal,
  getPesoDisciplina,
  normalizarNota,
  getDisciplinaParaExame,
} from "@/lib/cursos";

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export interface NotasPeriodo {
  p1: string;
  p2: string;
  p3: string;
}

export interface DadosDisciplina {
  disciplinaId: string;
  notas: {
    "10": NotasPeriodo;
    "11": NotasPeriodo;
    "12": NotasPeriodo;
  };
}

export interface DadosOpcional12 {
  nome: DisciplinaOpcional12 | null;
  notas: NotasPeriodo;
}

export interface ExameSelecionado {
  id: string; // ID único (timestamp)
  codigoExame: string; // código do exame (ex: "639")
  tipoExame: "interno" | "ingresso" | null;
  notaExame: string;
}

export interface ResultadoDisciplina {
  id: string;
  nome: string;
  tipo: "trienal" | "bienal" | "anual";
  peso: number;
  cif: number | null;
  cfd: number | null;
  exameAplicado: ExameSelecionado | null;
}

export interface ResultadoFinal {
  disciplinas: ResultadoDisciplina[];
  mediaFinal: number | null;
}

export interface SimuladorState {
  passo: number; // 1-5
  cursoPorId: string | null;
  dadosDisciplinas: Record<string, DadosDisciplina>;
  opcional1: DadosOpcional12;
  opcional2: DadosOpcional12;
  exames: ExameSelecionado[]; // Exames globais
  resultado: ResultadoFinal | null;
  opcaoBioGeomDesc: "bio-geo" | "geometria-desc" | null;
}

type Action =
  | { type: "SET_CURSO"; cursoId: string }
  | { type: "SET_PASSO"; passo: number }
  | { type: "SET_NOTA_PERIODO"; disciplinaId: string; ano: "10" | "11" | "12"; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "SET_OPCAO_12"; slot: 1 | 2; campo: keyof DadosOpcional12; valor: string | null }
  | { type: "SET_NOTA_OPCAO_PERIODO"; slot: 1 | 2; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "ADD_EXAME"; codigoExame: string }
  | { type: "REMOVE_EXAME"; exameId: string }
  | { type: "SET_TIPO_EXAME"; exameId: string; tipoExame: "interno" | "ingresso" | null }
  | { type: "SET_NOTA_EXAME"; exameId: string; notaExame: string }
  | { type: "SET_OPCAO_BIO_GEOM"; opcao: "bio-geo" | "geometria-desc" }
  | { type: "CALCULAR_RESULTADO"; curso: Curso }
  | { type: "RESET" };

// ─── ESTADO INICIAL ──────────────────────────────────────────────────────────

const notasVazias = (): NotasPeriodo => ({ p1: "", p2: "", p3: "" });

const opcionalVazio = (): DadosOpcional12 => ({
  nome: null,
  notas: notasVazias(),
});

const initialState: SimuladorState = {
  passo: 1,
  cursoPorId: null,
  dadosDisciplinas: {},
  opcional1: opcionalVazio(),
  opcional2: opcionalVazio(),
  exames: [],
  resultado: null,
  opcaoBioGeomDesc: null,
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────

function reducer(state: SimuladorState, action: Action): SimuladorState {
  switch (action.type) {
    case "SET_CURSO":
      return { ...initialState, cursoPorId: action.cursoId, passo: 2 };

    case "SET_PASSO":
      return { ...state, passo: action.passo };

    case "SET_NOTA_PERIODO": {
      const prev = state.dadosDisciplinas[action.disciplinaId] ?? {
        disciplinaId: action.disciplinaId,
        notas: { "10": notasVazias(), "11": notasVazias(), "12": notasVazias() },
      };
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: {
            ...prev,
            notas: {
              ...prev.notas,
              [action.ano]: {
                ...prev.notas[action.ano],
                [action.periodo]: action.valor,
              },
            },
          },
        },
      };
    }

    case "SET_OPCAO_12": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return {
        ...state,
        [key]: {
          ...state[key],
          [action.campo]: action.valor,
          ...(action.campo === "nome" ? { notas: notasVazias() } : {}),
        },
      };
    }

    case "SET_NOTA_OPCAO_PERIODO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return {
        ...state,
        [key]: {
          ...state[key],
          notas: { ...state[key].notas, [action.periodo]: action.valor },
        },
      };
    }

    case "ADD_EXAME": {
      const novoExame: ExameSelecionado = {
        id: `${Date.now()}-${Math.random()}`,
        codigoExame: action.codigoExame,
        tipoExame: null,
        notaExame: "",
      };
      return {
        ...state,
        exames: [...state.exames, novoExame],
      };
    }

    case "REMOVE_EXAME": {
      return {
        ...state,
        exames: state.exames.filter((e) => e.id !== action.exameId),
      };
    }

    case "SET_TIPO_EXAME": {
      return {
        ...state,
        exames: state.exames.map((e) =>
          e.id === action.exameId ? { ...e, tipoExame: action.tipoExame } : e
        ),
      };
    }

    case "SET_NOTA_EXAME": {
      return {
        ...state,
        exames: state.exames.map((e) =>
          e.id === action.exameId ? { ...e, notaExame: action.notaExame } : e
        ),
      };
    }

    case "SET_OPCAO_BIO_GEOM": {
      return {
        ...state,
        opcaoBioGeomDesc: action.opcao,
      };
    }

    case "CALCULAR_RESULTADO": {
      const curso = action.curso;
      const resultados: ResultadoDisciplina[] = [];

      // Disciplinas do curso
      for (const disc of curso.disciplinas) {
        // Filtrar Bio/GeomDesc para CT
        if (curso.id === "ct" && (disc.id === "bio-geo" || disc.id === "geometria-desc")) {
          if (disc.id !== state.opcaoBioGeomDesc) continue;
        }

        const dados = state.dadosDisciplinas[disc.id];
        const notasPorAno: Array<{ p1: string; p2: string; p3: string }> = [];

        for (const ano of disc.anos) {
          const notas = dados?.notas[ano] ?? notasVazias();
          notasPorAno.push(notas);
        }

        const cif = calcularCIFComTipo(notasPorAno, disc.tipo);

        // Procurar exame que corresponde a esta disciplina
        let exameAplicado: ExameSelecionado | null = null;
        let cfd = cif;

        if (disc.codigoExame) {
          const exame = state.exames.find((e) => e.codigoExame === disc.codigoExame);
          if (exame && exame.tipoExame === "interno") {
            const notaNum = normalizarNota(exame.notaExame);
            if (cif !== null && notaNum !== null) {
              cfd = calcularCFD(cif, notaNum, "interno");
              exameAplicado = exame;
            }
          }
        }

        resultados.push({
          id: disc.id,
          nome: disc.nome,
          tipo: disc.tipo,
          peso: getPesoDisciplina(disc.tipo),
          cif,
          cfd,
          exameAplicado,
        });
      }

      // Opcionais de 12º
      for (const [slot, opcao] of [
        [1, state.opcional1],
        [2, state.opcional2],
      ] as const) {
        if (!opcao.nome) continue;
        const cif = calcularCIFComTipo([opcao.notas], "anual");

        resultados.push({
          id: `opcional-${slot}`,
          nome: opcao.nome,
          tipo: "anual",
          peso: 1,
          cif,
          cfd: cif,
          exameAplicado: null,
        });
      }

      const paraMedia = resultados
        .filter((r) => r.cfd !== null)
        .map((r) => ({ cfd: r.cfd!, peso: r.peso }));

      const mediaFinal = calcularMediaFinal(paraMedia);

      return {
        ...state,
        passo: 5,
        resultado: { disciplinas: resultados, mediaFinal },
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ─── CONTEXTO ────────────────────────────────────────────────────────────────

interface SimuladorContextValue {
  state: SimuladorState;
  dispatch: React.Dispatch<Action>;
}

const SimuladorContext = createContext<SimuladorContextValue | null>(null);

export function SimuladorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SimuladorContext.Provider value={{ state, dispatch }}>
      {children}
    </SimuladorContext.Provider>
  );
}

export function useSimulador() {
  const ctx = useContext(SimuladorContext);
  if (!ctx) throw new Error("useSimulador must be used within SimuladorProvider");
  return ctx;
}
