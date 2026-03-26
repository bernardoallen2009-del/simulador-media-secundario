// =============================================================================
// CONTEXTO GLOBAL DO SIMULADOR — Estado completo da aplicação
// Design: Apple Education White
// Atualizado: Sistema de exames flexível (qualquer exame para qualquer aluno)
// =============================================================================

import React, { createContext, useContext, useReducer } from "react";
import {
  Curso,
  Disciplina,
  DisciplinaOpcional12,
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
  exames: Array<{
    id: string; // código do exame (ex: "639")
    tipoExame: "interno" | "ingresso" | null;
    notaExame: string;
  }>;
}

export interface DadosOpcional12 {
  nome: DisciplinaOpcional12 | null;
  notas: NotasPeriodo;
  exames: Array<{
    id: string;
    tipoExame: "interno" | "ingresso" | null;
    notaExame: string;
  }>;
}

export interface ResultadoDisciplina {
  id: string;
  nome: string;
  tipo: "trienal" | "bienal" | "anual";
  peso: number;
  cif: number | null;
  cfd: number | null;
  examesAplicados: Array<{
    codigo: string;
    nome: string;
    nota: number | null;
    tipoExame: "interno" | "ingresso" | null;
    cfdResultante: number | null;
  }>;
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
  resultado: ResultadoFinal | null;
}

type Action =
  | { type: "SET_CURSO"; cursoId: string }
  | { type: "SET_PASSO"; passo: number }
  | { type: "SET_NOTA_PERIODO"; disciplinaId: string; ano: "10" | "11" | "12"; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "ADD_EXAME_DISCIPLINA"; disciplinaId: string; codigoExame: string }
  | { type: "REMOVE_EXAME_DISCIPLINA"; disciplinaId: string; exameId: string }
  | { type: "SET_TIPO_EXAME_DISCIPLINA"; disciplinaId: string; exameId: string; tipoExame: "interno" | "ingresso" | null }
  | { type: "SET_NOTA_EXAME_DISCIPLINA"; disciplinaId: string; exameId: string; notaExame: string }
  | { type: "SET_OPCAO_12"; slot: 1 | 2; campo: keyof DadosOpcional12; valor: string | null }
  | { type: "SET_NOTA_OPCAO_PERIODO"; slot: 1 | 2; periodo: "p1" | "p2" | "p3"; valor: string }
  | { type: "ADD_EXAME_OPCAO"; slot: 1 | 2; codigoExame: string }
  | { type: "REMOVE_EXAME_OPCAO"; slot: 1 | 2; exameId: string }
  | { type: "SET_TIPO_EXAME_OPCAO"; slot: 1 | 2; exameId: string; tipoExame: "interno" | "ingresso" | null }
  | { type: "SET_NOTA_EXAME_OPCAO"; slot: 1 | 2; exameId: string; notaExame: string }
  | { type: "CALCULAR_RESULTADO"; curso: Curso }
  | { type: "RESET" };

// ─── ESTADO INICIAL ──────────────────────────────────────────────────────────

const notasVazias = (): NotasPeriodo => ({ p1: "", p2: "", p3: "" });

const opcionalVazio = (): DadosOpcional12 => ({
  nome: null,
  notas: notasVazias(),
  exames: [],
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
        exames: [],
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

    case "ADD_EXAME_DISCIPLINA": {
      const prev = state.dadosDisciplinas[action.disciplinaId] ?? {
        disciplinaId: action.disciplinaId,
        notas: { "10": notasVazias(), "11": notasVazias(), "12": notasVazias() },
        exames: [],
      };
      const novoExame = { id: action.codigoExame, tipoExame: null as "interno" | "ingresso" | null, notaExame: "" };
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: {
            ...prev,
            exames: [...prev.exames, { ...novoExame, id: action.codigoExame }],
          },
        },
      };
    }

    case "REMOVE_EXAME_DISCIPLINA": {
      const prev = state.dadosDisciplinas[action.disciplinaId];
      if (!prev) return state;
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: {
            ...prev,
            exames: prev.exames.filter((e) => e.id !== action.exameId),
          },
        },
      };
    }

    case "SET_TIPO_EXAME_DISCIPLINA": {
      const prev = state.dadosDisciplinas[action.disciplinaId];
      if (!prev) return state;
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: {
            ...prev,
            exames: prev.exames.map((e) =>
              e.id === action.exameId ? { ...e, tipoExame: action.tipoExame } : e
            ),
          },
        },
      };
    }

    case "SET_NOTA_EXAME_DISCIPLINA": {
      const prev = state.dadosDisciplinas[action.disciplinaId];
      if (!prev) return state;
      return {
        ...state,
        dadosDisciplinas: {
          ...state.dadosDisciplinas,
          [action.disciplinaId]: {
            ...prev,
            exames: prev.exames.map((e) =>
              e.id === action.exameId ? { ...e, notaExame: action.notaExame } : e
            ),
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
          ...(action.campo === "nome" ? { notas: notasVazias(), exames: [] } : {}),
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

    case "ADD_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      const novoExame = { id: action.codigoExame, tipoExame: null as "interno" | "ingresso" | null, notaExame: "" };
      return {
        ...state,
        [key]: {
          ...state[key],
          exames: [...state[key].exames, novoExame],
        },
      };
    }

    case "REMOVE_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return {
        ...state,
        [key]: {
          ...state[key],
          exames: state[key].exames.filter((e) => e.id !== action.exameId),
        },
      };
    }

    case "SET_TIPO_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return {
        ...state,
        [key]: {
          ...state[key],
          exames: state[key].exames.map((e) =>
            e.id === action.exameId ? { ...e, tipoExame: action.tipoExame } : e
          ),
        },
      };
    }

    case "SET_NOTA_EXAME_OPCAO": {
      const key = action.slot === 1 ? "opcional1" : "opcional2";
      return {
        ...state,
        [key]: {
          ...state[key],
          exames: state[key].exames.map((e) =>
            e.id === action.exameId ? { ...e, notaExame: action.notaExame } : e
          ),
        },
      };
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

        // Processar exames adicionados
        const examesAplicados = (dados?.exames ?? []).map((exame) => {
          const notaExameNum = normalizarNota(exame.notaExame);
          const cfdResultante = cif !== null ? calcularCFD(cif, notaExameNum, exame.tipoExame) : null;
          return {
            codigo: exame.id,
            nome: exame.id, // será preenchido com getNomeExame no componente
            nota: notaExameNum,
            tipoExame: exame.tipoExame,
            cfdResultante,
          };
        });

        // CFD final é o melhor resultado (CIF ou melhor CFD com exame)
        let cfd = cif;
        if (examesAplicados.length > 0) {
          const cfdComExames = examesAplicados
            .filter((e) => e.cfdResultante !== null)
            .map((e) => e.cfdResultante!);
          if (cfdComExames.length > 0) {
            cfd = Math.max(cif ?? 0, ...cfdComExames);
          }
        }

        resultados.push({
          id: disc.id,
          nome: disc.nome,
          tipo: disc.tipo,
          peso: getPesoDisciplina(disc.tipo),
          cif,
          cfd,
          examesAplicados,
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

        const examesAplicados = (opcao.exames ?? []).map((exame) => {
          const notaExameNum = normalizarNota(exame.notaExame);
          const cfdResultante = cif !== null ? calcularCFD(cif, notaExameNum, exame.tipoExame) : null;
          return {
            codigo: exame.id,
            nome: exame.id,
            nota: notaExameNum,
            tipoExame: exame.tipoExame,
            cfdResultante,
          };
        });

        let cfd = cif;
        if (examesAplicados.length > 0) {
          const cfdComExames = examesAplicados
            .filter((e) => e.cfdResultante !== null)
            .map((e) => e.cfdResultante!);
          if (cfdComExames.length > 0) {
            cfd = Math.max(cif ?? 0, ...cfdComExames);
          }
        }

        resultados.push({
          id: `opcional-${slot}`,
          nome: opcao.nome,
          tipo: "anual",
          peso: 1,
          cif,
          cfd,
          examesAplicados,
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
