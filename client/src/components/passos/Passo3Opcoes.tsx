// =============================================================================
// PASSO 3 — Opções do 12.º Ano (2 disciplinas anuais)
// Design: Apple Education White
// =============================================================================

import { motion } from "framer-motion";
import { DISCIPLINAS_12_OPCOES, DisciplinaOpcional12, calcularCIFComTipo, normalizarNota } from "@/lib/cursos";
import { useSimulador, DadosOpcional12 } from "@/contexts/SimuladorContext";
import { toast } from "sonner";

function NotaInput({
  value,
  onChange,
  placeholder = "—",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const num = normalizarNota(value);
  const isValid = value === "" || (num !== null && num >= 0 && num <= 20);
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-14 text-center text-sm font-medium rounded-lg border px-2 py-1.5 outline-none transition-all duration-150
        ${isValid
          ? "border-[#D2D2D7] bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
          : "border-red-300 bg-red-50 text-red-600 focus:border-red-400 focus:ring-2 focus:ring-red-200"
        }`}
    />
  );
}

function OpcaoCard({
  slot,
  opcao,
  outroNome,
}: {
  slot: 1 | 2;
  opcao: DadosOpcional12;
  outroNome: DisciplinaOpcional12 | null;
}) {
  const { dispatch } = useSimulador();

  const disponiveis = DISCIPLINAS_12_OPCOES.filter((d) => d !== outroNome);

  const cif = calcularCIFComTipo([opcao.notas], "anual");

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#F2F2F7] flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-wide">
          {slot}.ª Disciplina Anual
        </span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
          Anual · Peso 1
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Seletor de disciplina */}
        <div>
          <label className="block text-[12px] font-medium text-[#AEAEB2] mb-1.5">Disciplina</label>
          <select
            value={opcao.nome ?? ""}
            onChange={(e) =>
              dispatch({
                type: "SET_OPCAO_12",
                slot,
                campo: "nome",
                valor: e.target.value as DisciplinaOpcional12 || null,
              })
            }
            className="w-full rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] text-sm font-medium px-3 py-2.5 outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all duration-150 appearance-none cursor-pointer"
          >
            <option value="">Selecionar disciplina…</option>
            {disponiveis.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Notas dos períodos */}
        {opcao.nome && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <label className="block text-[12px] font-medium text-[#AEAEB2] mb-2">
              Notas do 12.º Ano
            </label>
            <div className="flex items-center gap-3">
              {(["p1", "p2", "p3"] as const).map((p, i) => (
                <div key={p} className="flex flex-col items-center gap-1">
                  <span className="text-[11px] text-[#AEAEB2]">{i + 1}.º Per.</span>
                  <NotaInput
                    value={opcao.notas[p]}
                    onChange={(v) => dispatch({ type: "SET_NOTA_OPCAO_PERIODO", slot, periodo: p, valor: v })}
                  />
                </div>
              ))}
              <div className="flex flex-col items-center gap-1 ml-2">
                <span className="text-[11px] text-[#AEAEB2]">CIF</span>
                <span className={`text-sm font-semibold tabular-nums px-2 py-1 rounded-md
                  ${cif === null ? "text-[#AEAEB2]" :
                    cif >= 14 ? "text-emerald-600 bg-emerald-50" :
                    cif >= 10 ? "text-amber-600 bg-amber-50" :
                    "text-red-600 bg-red-50"}`}>
                  {cif !== null ? cif.toFixed(1) : "—"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Passo3Opcoes() {
  const { state, dispatch } = useSimulador();

  const temAmbas = state.opcional1.nome !== null && state.opcional2.nome !== null;
  const temPelo1 = state.opcional1.nome !== null || state.opcional2.nome !== null;

  const validarOpcoes = (): boolean => {
    if (!state.opcional1.nome) {
      toast.error("Seleciona a 1.ª disciplina anual do 12.º ano");
      return false;
    }
    if (!state.opcional2.nome) {
      toast.error("Seleciona a 2.ª disciplina anual do 12.º ano");
      return false;
    }
    if (state.opcional1.nome === state.opcional2.nome) {
      toast.error("Seleciona duas disciplinas diferentes");
      return false;
    }
    return true;
  };

  const handleContinuar = () => {
    if (validarOpcoes()) {
      dispatch({ type: "SET_PASSO", passo: 4 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">
          Opções do 12.º Ano
        </h2>
        <p className="text-[#6E6E73] text-base">
          Escolhe as duas disciplinas anuais que frequentas no 12.º ano. São disciplinas de peso 1 na média final.
        </p>
      </div>

      <div className="space-y-4">
        <OpcaoCard slot={1} opcao={state.opcional1} outroNome={state.opcional2.nome} />
        <OpcaoCard slot={2} opcao={state.opcional2} outroNome={state.opcional1.nome} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: "SET_PASSO", passo: 2 })}
          className="px-5 py-2.5 text-[#0071E3] text-[15px] font-semibold rounded-xl hover:bg-[#0071E3]/5 transition-all duration-150"
        >
          ← Voltar
        </button>
        <button
          onClick={handleContinuar}
          className="px-6 py-3 bg-[#0071E3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0077ED] active:bg-[#006CC7] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Continuar para Exames →
        </button>
      </div>
    </motion.div>
  );
}
