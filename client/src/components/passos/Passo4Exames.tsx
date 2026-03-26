// =============================================================================
// PASSO 4 — Exames Nacionais (Sistema Flexível)
// Design: Apple Education White — adicionar qualquer exame disponível
// =============================================================================

import { motion } from "framer-motion";
import { CURSOS, EXAMES_DISPONIVEIS, calcularCIF, calcularCFD, normalizarNota, getNomeExame } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";
import { Plus, X } from "lucide-react";

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
}: {
  value: "interno" | "ingresso" | null;
  onChange: (v: "interno" | "ingresso" | null) => void;
}) {
  const opcoes: { val: "interno" | "ingresso" | null; label: string }[] = [
    { val: null, label: "Nenhum" },
    { val: "interno", label: "Interno" },
    { val: "ingresso", label: "Ingresso" },
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {opcoes.map((op) => (
        <button
          key={String(op.val)}
          onClick={() => onChange(op.val)}
          className={`px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-all duration-150
            ${value === op.val
              ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
              : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3]/40 hover:bg-[#0071E3]/5"
            }`}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

export default function Passo4Exames() {
  const { state, dispatch } = useSimulador();
  const curso = CURSOS.find((c) => c.id === state.cursoPorId);
  if (!curso) return null;

  const getCIFDisc = (discId: string) => {
    const dados = state.dadosDisciplinas[discId];
    const disc = curso.disciplinas.find((d) => d.id === discId);
    if (!disc || !dados) return null;
    const periodos: (number | null)[] = [];
    for (const ano of disc.anos) {
      const n = dados.notas[ano];
      periodos.push(normalizarNota(n.p1), normalizarNota(n.p2), normalizarNota(n.p3));
    }
    return calcularCIF(periodos);
  };

  const getCIFOpcao = (slot: 1 | 2) => {
    const opcao = slot === 1 ? state.opcional1 : state.opcional2;
    return calcularCIF([
      normalizarNota(opcao.notas.p1),
      normalizarNota(opcao.notas.p2),
      normalizarNota(opcao.notas.p3),
    ]);
  };

  // Exames já adicionados (para não permitir duplicatas)
  const examesAdicionadosPorDisc = (discId: string) => {
    return new Set(state.dadosDisciplinas[discId]?.exames.map((e) => e.id) ?? []);
  };

  const examesAdicionadosOpcao = (slot: 1 | 2) => {
    const opcao = slot === 1 ? state.opcional1 : state.opcional2;
    return new Set(opcao.exames.map((e) => e.id));
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
          Adiciona exames para qualquer disciplina. Como aluno interno: CFD = CIF × 75% + Exame × 25%.
        </p>
      </div>

      <div className="space-y-4">
        {/* Disciplinas do curso */}
        {curso.disciplinas.map((disc, idx) => {
          const cif = getCIFDisc(disc.id);
          const examesAdicionados = examesAdicionadosPorDisc(disc.id);
          const examesDisponiveis = EXAMES_DISPONIVEIS.filter((e) => !examesAdicionados.has(e.codigo));

          return (
            <motion.div
              key={disc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#F2F2F7]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[15px] font-semibold text-[#1D1D1F]">{disc.nome}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#AEAEB2]">CIF</span>
                    <span className={`text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md
                      ${cif === null ? "text-[#AEAEB2]" :
                        cif >= 14 ? "text-emerald-600 bg-emerald-50" :
                        cif >= 10 ? "text-amber-600 bg-amber-50" :
                        "text-red-600 bg-red-50"}`}>
                      {cif !== null ? cif.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>

                {/* Exames adicionados */}
                {state.dadosDisciplinas[disc.id]?.exames.length ?? 0 > 0 ? (
                  <div className="space-y-2">
                    {(state.dadosDisciplinas[disc.id]?.exames ?? []).map((exame) => {
                      const notaNum = normalizarNota(exame.notaExame);
                      const cfd = cif !== null ? calcularCFD(cif, notaNum, exame.tipoExame) : null;
                      return (
                        <div key={exame.id} className="flex items-center gap-2 bg-[#F5F5F7] rounded-lg p-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#1D1D1F]">{getNomeExame(exame.id)}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <TipoExameSelector
                                value={exame.tipoExame}
                                onChange={(v) =>
                                  dispatch({ type: "SET_TIPO_EXAME_DISCIPLINA", disciplinaId: disc.id, exameId: exame.id, tipoExame: v })
                                }
                              />
                              {exame.tipoExame !== null && (
                                <div className="flex items-center gap-2">
                                  <NotaExameInput
                                    value={exame.notaExame}
                                    onChange={(v) =>
                                      dispatch({ type: "SET_NOTA_EXAME_DISCIPLINA", disciplinaId: disc.id, exameId: exame.id, notaExame: v })
                                    }
                                  />
                                  <span className={`text-[12px] font-semibold tabular-nums ${
                                    cfd !== null
                                      ? cfd >= 14 ? "text-emerald-600" : cfd >= 10 ? "text-amber-600" : "text-red-600"
                                      : "text-[#AEAEB2]"
                                  }`}>
                                    CFD: {cfd !== null ? cfd.toFixed(1) : "—"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              dispatch({ type: "REMOVE_EXAME_DISCIPLINA", disciplinaId: disc.id, exameId: exame.id })
                            }
                            className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-150 text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {/* Botão adicionar exame */}
              {examesDisponiveis.length > 0 && (
                <div className="px-5 py-3 bg-[#F5F5F7]">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        dispatch({ type: "ADD_EXAME_DISCIPLINA", disciplinaId: disc.id, codigoExame: e.target.value });
                        e.target.value = "";
                      }
                    }}
                    className="w-full text-[13px] rounded-lg border border-[#D2D2D7] bg-white text-[#1D1D1F] px-3 py-2 outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all duration-150"
                  >
                    <option value="">+ Adicionar exame…</option>
                    {examesDisponiveis.map((e) => (
                      <option key={e.codigo} value={e.codigo}>
                        {e.nome} ({e.codigo})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Opcionais de 12º */}
        {[1, 2].map((slot) => {
          const opcao = slot === 1 ? state.opcional1 : state.opcional2;
          if (!opcao.nome) return null;

          const cif = getCIFOpcao(slot as 1 | 2);
          const examesAdicionados = examesAdicionadosOpcao(slot as 1 | 2);
          const examesDisponiveis = EXAMES_DISPONIVEIS.filter((e) => !examesAdicionados.has(e.codigo));

          return (
            <motion.div
              key={`opcao-${slot}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#F2F2F7]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[15px] font-semibold text-[#1D1D1F]">{opcao.nome}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#AEAEB2]">CIF</span>
                    <span className={`text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md
                      ${cif === null ? "text-[#AEAEB2]" :
                        cif >= 14 ? "text-emerald-600 bg-emerald-50" :
                        cif >= 10 ? "text-amber-600 bg-amber-50" :
                        "text-red-600 bg-red-50"}`}>
                      {cif !== null ? cif.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>

                {/* Exames adicionados */}
                {opcao.exames.length > 0 && (
                  <div className="space-y-2">
                    {opcao.exames.map((exame) => {
                      const notaNum = normalizarNota(exame.notaExame);
                      const cfd = cif !== null ? calcularCFD(cif, notaNum, exame.tipoExame) : null;
                      return (
                        <div key={exame.id} className="flex items-center gap-2 bg-[#F5F5F7] rounded-lg p-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#1D1D1F]">{getNomeExame(exame.id)}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <TipoExameSelector
                                value={exame.tipoExame}
                                onChange={(v) =>
                                  dispatch({ type: "SET_TIPO_EXAME_OPCAO", slot: slot as 1 | 2, exameId: exame.id, tipoExame: v })
                                }
                              />
                              {exame.tipoExame !== null && (
                                <div className="flex items-center gap-2">
                                  <NotaExameInput
                                    value={exame.notaExame}
                                    onChange={(v) =>
                                      dispatch({ type: "SET_NOTA_EXAME_OPCAO", slot: slot as 1 | 2, exameId: exame.id, notaExame: v })
                                    }
                                  />
                                  <span className={`text-[12px] font-semibold tabular-nums ${
                                    cfd !== null
                                      ? cfd >= 14 ? "text-emerald-600" : cfd >= 10 ? "text-amber-600" : "text-red-600"
                                      : "text-[#AEAEB2]"
                                  }`}>
                                    CFD: {cfd !== null ? cfd.toFixed(1) : "—"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              dispatch({ type: "REMOVE_EXAME_OPCAO", slot: slot as 1 | 2, exameId: exame.id })
                            }
                            className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-150 text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botão adicionar exame */}
              {examesDisponiveis.length > 0 && (
                <div className="px-5 py-3 bg-[#F5F5F7]">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        dispatch({ type: "ADD_EXAME_OPCAO", slot: slot as 1 | 2, codigoExame: e.target.value });
                        e.target.value = "";
                      }
                    }}
                    className="w-full text-[13px] rounded-lg border border-[#D2D2D7] bg-white text-[#1D1D1F] px-3 py-2 outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all duration-150"
                  >
                    <option value="">+ Adicionar exame…</option>
                    {examesDisponiveis.map((e) => (
                      <option key={e.codigo} value={e.codigo}>
                        {e.nome} ({e.codigo})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: "SET_PASSO", passo: 3 })}
          className="px-5 py-2.5 text-[#0071E3] text-[15px] font-semibold rounded-xl hover:bg-[#0071E3]/5 transition-all duration-150"
        >
          ← Voltar
        </button>
        <button
          onClick={() => {
            const cursoObj = CURSOS.find((c) => c.id === state.cursoPorId);
            if (cursoObj) dispatch({ type: "CALCULAR_RESULTADO", curso: cursoObj });
          }}
          className="px-6 py-3 bg-[#0071E3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0077ED] active:bg-[#006CC7] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Calcular Média Final →
        </button>
      </div>
    </motion.div>
  );
}
