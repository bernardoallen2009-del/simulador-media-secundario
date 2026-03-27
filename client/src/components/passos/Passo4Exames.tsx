// =============================================================================
// PASSO 4 — Exames Nacionais (Nova Lógica)
// Design: Apple Education White — selecionar exames e calcular CFD automaticamente
// =============================================================================

import { motion } from "framer-motion";
import { CURSOS, EXAMES_DISPONIVEIS, calcularCFD, calcularCIFComTipo, normalizarNota, getNomeExame, getDisciplinaParaExame } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";
import { toast } from "sonner";
import { X } from "lucide-react";

function NotaExameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const num = value ? parseFloat(value.replace(",", ".")) : null;
  const isValid = value === "" || (num !== null && !isNaN(num) && num >= 0 && num <= 200);
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0–20 ou 0–200"
      className={`w-32 text-sm font-medium rounded-lg border px-3 py-2 outline-none transition-all duration-150
        ${isValid
          ? "border-[#D2D2D7] bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
          : "border-red-300 bg-red-50 text-red-600"
        }`}
    />
  );
}

function TipoExameSelector({
  value,
  onChange,
  limiteInternosAtingido,
}: {
  value: "interno" | "ingresso" | null;
  onChange: (v: "interno" | "ingresso" | null) => void;
  limiteInternosAtingido: boolean;
}) {
  const opcoes: { val: "interno" | "ingresso" | null; label: string }[] = [
    { val: null, label: "Nenhum" },
    { val: "interno", label: "Aluno Interno" },
    { val: "ingresso", label: "Prova de Ingresso" },
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {opcoes.map((op) => {
        const isDisabled = op.val === "interno" && limiteInternosAtingido && value !== "interno";
        return (
          <button
            key={String(op.val)}
            onClick={() => !isDisabled && onChange(op.val)}
            disabled={isDisabled}
            className={`px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-all duration-150
              ${value === op.val
                ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                : isDisabled
                  ? "bg-[#F5F5F7] text-[#AEAEB2] border-[#E5E5EA] cursor-not-allowed"
                  : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3]/40 hover:bg-[#0071E3]/5"
              }`}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Passo4Exames() {
  const { state, dispatch } = useSimulador();
  const curso = CURSOS.find((c) => c.id === state.cursoPorId);
  if (!curso) return null;

  // Exames já adicionados
  const examesAdicionados = new Set(state.exames.map((e) => e.codigoExame));
  const examesDisponiveis = EXAMES_DISPONIVEIS.filter((e) => !examesAdicionados.has(e.codigo));

  // Contagem de exames internos (máximo 3)
  const numExamesInternos = state.exames.filter((e) => e.tipoExame === "interno").length;
  const limiteInternosAtingido = numExamesInternos >= 3;

  // Calcular CFD para cada exame
  const calcularCFDParaExame = (codigoExame: string, tipoExame: "interno" | "ingresso" | null, notaExame: string) => {
    const disc = getDisciplinaParaExame(codigoExame, curso);
    if (!disc) return null;

    const dados = state.dadosDisciplinas[disc.id];
    if (!dados) return null;

    // Calcular CIF da disciplina
    const notasPorAno = disc.anos.map((ano) => dados.notas[ano]);
    const cif = calcularCIFComTipo(notasPorAno, disc.tipo);
    if (cif === null) return null;

    const notaNum = normalizarNota(notaExame);
    if (notaNum === null) return null;

    return calcularCFD(cif, notaNum, tipoExame);
  };

  const validarExames = (): boolean => {
    // Verificar se há exames com tipo selecionado mas sem nota
    for (const exame of state.exames) {
      if (exame.tipoExame && !exame.notaExame) {
        toast.error(`Insere a nota para ${getNomeExame(exame.codigoExame)}`);
        return false;
      }
      if (exame.notaExame && !exame.tipoExame) {
        toast.error(`Seleciona o tipo de exame para ${getNomeExame(exame.codigoExame)}`);
        return false;
      }
    }
    return true;
  };

  const handleCalcular = () => {
    if (validarExames()) {
      const cursoObj = CURSOS.find((c) => c.id === state.cursoPorId);
      if (cursoObj) dispatch({ type: "CALCULAR_RESULTADO", curso: cursoObj });
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
          Exames Nacionais
        </h2>
        <p className="text-[#6E6E73] text-base">
          Seleciona os exames que vais fazer (máximo 3 como aluno interno). Para alunos internos: CFD = CIF (arredondada) × 75% + Nota Exame × 25%.
        </p>
      </div>

      {/* Exames já adicionados */}
      {state.exames.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden mb-6"
        >
          <div className="px-5 py-3.5 border-b border-[#F2F2F7]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Exames Selecionados</h3>
          </div>

          <div className="divide-y divide-[#F2F2F7]">
            {state.exames.map((exame, idx) => {
              const disc = getDisciplinaParaExame(exame.codigoExame, curso);
              const cfd = calcularCFDParaExame(exame.codigoExame, exame.tipoExame, exame.notaExame);

              return (
                <motion.div
                  key={exame.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-[#1D1D1F]">
                        {getNomeExame(exame.codigoExame)}
                      </div>
                      {disc && (
                        <div className="text-[12px] text-[#AEAEB2] mt-1">
                          Disciplina: <span className="font-medium text-[#6E6E73]">{disc.nome}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_EXAME", exameId: exame.id })
                      }
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-150 text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[12px] font-medium text-[#AEAEB2] block mb-1.5">
                        Tipo de Exame
                      </label>
                      <TipoExameSelector
                        value={exame.tipoExame}
                        onChange={(v) =>
                          dispatch({ type: "SET_TIPO_EXAME", exameId: exame.id, tipoExame: v })
                        }
                        limiteInternosAtingido={limiteInternosAtingido}
                      />
                    </div>

                    {exame.tipoExame !== null && (
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="text-[12px] font-medium text-[#AEAEB2] block mb-1.5">
                            Nota do Exame
                          </label>
                          <NotaExameInput
                            value={exame.notaExame}
                            onChange={(v) =>
                              dispatch({ type: "SET_NOTA_EXAME", exameId: exame.id, notaExame: v })
                            }
                          />
                        </div>
                        {disc && cfd !== null && (
                          <div className="text-center">
                            <div className="text-[12px] font-medium text-[#AEAEB2] mb-1">CFD</div>
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-semibold tabular-nums
                              ${cfd >= 14 ? "text-emerald-600 bg-emerald-50" :
                                cfd >= 10 ? "text-amber-600 bg-amber-50" :
                                "text-red-600 bg-red-50"}`}>
                              {cfd.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Adicionar novo exame */}
      {examesDisponiveis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-[#F2F2F7]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Adicionar Exame</h3>
          </div>

          <div className="px-5 py-4">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  dispatch({ type: "ADD_EXAME", codigoExame: e.target.value });
                  e.target.value = "";
                }
              }}
              className="w-full text-[13px] rounded-lg border border-[#D2D2D7] bg-white text-[#1D1D1F] px-3 py-2.5 outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all duration-150"
            >
              <option value="">Seleciona um exame…</option>
              {examesDisponiveis.map((e) => (
                <option key={e.codigo} value={e.codigo}>
                  {e.nome} ({e.codigo})
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {examesDisponiveis.length === 0 && state.exames.length > 0 && (
        <div className="bg-[#F5F5F7] rounded-2xl p-4 text-center text-[13px] text-[#6E6E73]">
          Todos os exames foram adicionados.
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: "SET_PASSO", passo: 3 })}
          className="px-5 py-2.5 text-[#0071E3] text-[15px] font-semibold rounded-xl hover:bg-[#0071E3]/5 transition-all duration-150"
        >
          ← Voltar
        </button>
        <button
          onClick={handleCalcular}
          className="px-6 py-3 bg-[#0071E3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0077ED] active:bg-[#006CC7] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Calcular Média Final →
        </button>
      </div>
    </motion.div>
  );
}
