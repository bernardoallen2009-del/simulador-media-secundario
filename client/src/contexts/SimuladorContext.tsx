// =============================================================================
// CONTEXTO GLOBAL DO SIMULADOR — Estado completo da aplicação
// Design: Apple Education White
// =============================================================================

import React, { createContext, useContext, useReducer } from "react";
import {
  Curso,
  Disciplina,
  DisciplinaOpcional12,
  DISCIPLINAS_COM_EXAME_12,
  calcularCFD,
  calcularCIF,
  calcularMediaFinal,
  getPesoDisciplina,
  normalizarNota,
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
  tipoExame: "interno" | "ingresso" | null;
  notaExame: string;
}

export interface DadosOpcional12 {
  nome: DisciplinaOpcional12 | null;
  notas: NotasPeriodo;
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
  notaExame: number | null;
  tipoExame: "interno" | "ingresso" | null;
}

export interface ResultadoFinal {
  disciplinas: ResultadoDisciplina[];
  mediaFinal: number | null;
  notaCandidatura: number | null;
}

export interface SimuladorState {
  passo: number; // 1-5
  cursoPorId: string | null;
  dadosDisciplinas: Record<string, DadosDisciplina>;
  opcional1: DadosOpcional12;
  opcional2: DadosOpcional12;
  resultado: ResultadoFinal | null;
}

type Action =
  | { type: "SET_CURSO"; cursoId: string }
  | { type: "SET_PASSO"; passo: number }
  | { type: "SET_NOTA_PERIODO"; disciplinaId: string; ano: "10" | "11" | "12"; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "SET_TIPO_EXAME"; disciplinaId: string; tipoExame: "interno" | "ingresso" | null }
  | { type: "SET_NOTA_EXAME"; disciplinaId: string; notaExame: string }
  | { type: "SET_OPCAO_12"; slot: 1 | 2; campo: keyof DadosOpcional12; valor: string | null }
  | { type: "SET_NOTA_OPCAO_PERIODO"; slot: 1 | 2; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "SET_TIPO_EXAME_OPCAO"; slot: 1 | 2; tipoExame: "interno" | "ingresso" | null }
  | { type: "SET_NOTA_EXAME_OPCAO"; slot: 1 | 2; notaExame: string }
  | { type: "CALCULAR_RESULTADO"; curso: Curso }
  | { type: "RESET" };

// ─── ESTADO INICIAL ──────────────────────────────────────────────────────────

const notasVazias = (): NotasPeriodo => ({ p1: "", p2: "", p3: "" });

const opcionalVazio = (): DadosOpcional12 => ({
  nome: null,
  notas: notasVazias(),
  tipoExame: null,
  notaExame: "",
});

const initialState: SimuladorState = {
  passo: 1,
  cursoPorId: null,
  dadosDisciplinas: {},
  opcional1: opcionalVazio(),
  opcional2: opcionalVazio(),
  resultado: null,
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
        tipoExame: null,
        notaExame: "",
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

    case "SET_TIPO_EXAME": {
      const prev = state.dadosDisciplinas[action.disciplinaId];
      if (!prev) return state;
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: { ...prev, tipoExame: action.tipoExame },
        },
      };
    }

    case "SET_NOTA_EXAME": {
      const prev = state.dadosDisciplinas[action.disciplinaId];
      if (!prev) return state;
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: { ...prev, notaExame: action.notaExame },
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
          // Reset notas when changing discipline
          ...(action.campo === "nome" ? { notas: notasVazias(), tipoExame: null, notaExame: "" } : {}),
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

    case "SET_TIPO_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return { ...state, [key]: { ...state[key], tipoExame: action.tipoExame } };
    }

    case "SET_NOTA_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return { ...state, [key]: { ...state[key], notaExame: action.notaExame } };
    }

    case "CALCULAR_RESULTADO": {
      const curso = action.curso;
      const resultados: ResultadoDisciplina[] = [];

      // Disciplinas do curso
      for (const disc of curso.disciplinas) {
        const dados = state.dadosDisciplinas[disc.id];
        const todosOsPeriodos: (number | null)[] = [];

        for (const ano of disc.anos) {
          const notas = dados?.notas[ano] ?? notasVazias();
          todosOsPeriodos.push(normalizarNota(notas.p1));
          todosOsPeriodos.push(normalizarNota(notas.p2));
          todosOsPeriodos.push(normalizarNota(notas.p3));
        }

        const cif = calcularCIF(todosOsPeriodos);
        const notaExame = dados?.notaExame ? normalizarNota(dados.notaExame) : null;
        const tipoExame = dados?.tipoExame ?? null;
        const cfd = cif !== null ? calcularCFD(cif, notaExame, tipoExame) : null;

        resultados.push({
          id: disc.id,
          nome: disc.nome,
          tipo: disc.tipo,
          peso: getPesoDisciplina(disc.tipo),
          cif,
          cfd,
          notaExame,
          tipoExame,
        });
      }

      // Opcionais de 12º
      for (const [slot, opcao] of [
        [1, state.opcional1],
        [2, state.opcional2],
      ] as const) {
        if (!opcao.nome) continue;
        const periodos = [
          normalizarNota(opcao.notas.p1),
          normalizarNota(opcao.notas.p2),
          normalizarNota(opcao.notas.p3),
        ];
        const cif = calcularCIF(periodos);
        const notaExame = opcao.notaExame ? normalizarNota(opcao.notaExame) : null;
        const tipoExame = opcao.tipoExame;
        const cfd = cif !== null ? calcularCFD(cif, notaExame, tipoExame) : null;

        resultados.push({
          id: `opcional-${slot}`,
          nome: opcao.nome,
          tipo: "anual",
          peso: 1,
          cif,
          cfd,
          notaExame,
          tipoExame,
        });
      }

      const paraMedia = resultados
        .filter((r) => r.cfd !== null)
        .map((r) => ({ cfd: r.cfd!, peso: r.peso }));

      const mediaFinal = calcularMediaFinal(paraMedia);

      // Nota de candidatura: média simples de todas as CFDs
      const notaCandidatura = mediaFinal;

      return {
        ...state,
        passo: 5,
        resultado: { disciplinas: resultados, mediaFinal, notaCandidatura },
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
