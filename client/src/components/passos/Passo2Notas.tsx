// =============================================================================
// PASSO 2 — Inserção de Notas por Disciplina e Período
// Design: Apple Education White — tabela de notas com inputs limpos
// =============================================================================

import { motion } from "framer-motion";
import { CURSOS, calcularCIFComTipo, normalizarNota } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";

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

function BadgeCIF({ cif }: { cif: number | null }) {
  if (cif === null) return <span className="text-[#AEAEB2] text-sm">—</span>;
  const cor =
    cif >= 14 ? "text-emerald-600 bg-emerald-50" :
    cif >= 10 ? "text-amber-600 bg-amber-50" :
    "text-red-600 bg-red-50";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-sm font-semibold tabular-nums ${cor}`}>
      {cif.toFixed(1)}
    </span>
  );
}

export default function Passo2Notas() {
  const { state, dispatch } = useSimulador();
  const curso = CURSOS.find((c) => c.id === state.cursoPorId);
  if (!curso) return null;

  const handleNota = (discId: string, ano: "10" | "11" | "12", periodo: "p1" | "p2" | "p3", valor: string) => {
    dispatch({ type: "SET_NOTA_PERIODO", disciplinaId: discId, ano, periodo, valor });
  };

  const getCIF = (discId: string) => {
    const dados = state.dadosDisciplinas[discId];
    const disc = curso.disciplinas.find((d) => d.id === discId);
    if (!disc || !dados) return null;
    const notasPorAno = disc.anos.map((ano) => dados.notas[ano]);
    return calcularCIFComTipo(notasPorAno, disc.tipo);
  };

  const getNotas = (discId: string, ano: "10" | "11" | "12") => {
    return state.dadosDisciplinas[discId]?.notas[ano] ?? { p1: "", p2: "", p3: "" };
  };

  // Filtrar disciplinas: se CT, mostrar apenas a selecionada (Bio ou GeomDesc)
  const disciplinasExibir = curso.disciplinas.filter((disc) => {
    if (state.cursoPorId === "ct") {
      if (disc.id === "bio-geo" || disc.id === "geometria-desc") {
        return disc.id === state.opcaoBioGeomDesc;
      }
    }
    return true;
  });

  const podeProsseguir = disciplinasExibir.some((d) => getCIF(d.id) !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">
          Notas por disciplina
        </h2>
        <p className="text-[#6E6E73] text-base">
          Insere as notas de cada período (escala 0–20). A CIF é calculada automaticamente.
        </p>
      </div>

      {/* Toggle Bio/GeomDesc para CT */}
      {state.cursoPorId === "ct" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white rounded-2xl border border-[#E5E5EA] shadow-sm p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">
                Opção de Ciência (10º-11º)
              </h3>
              <p className="text-[13px] text-[#6E6E73]">
                Escolhe qual disciplina vais fazer
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: "SET_OPCAO_BIO_GEOM", opcao: "bio-geo" })}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg border transition-all duration-150 whitespace-nowrap ${
                  state.opcaoBioGeomDesc === "bio-geo"
                    ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                    : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3]/40 hover:bg-[#0071E3]/5"
                }`}
              >
                Biologia e Geologia
              </button>
              <button
                onClick={() => dispatch({ type: "SET_OPCAO_BIO_GEOM", opcao: "geometria-desc" })}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg border transition-all duration-150 whitespace-nowrap ${
                  state.opcaoBioGeomDesc === "geometria-desc"
                    ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                    : "bg-white text-[#1D1D1F] border-[#D2D2D7] hover:border-[#0071E3]/40 hover:bg-[#0071E3]/5"
                }`}
              >
                Geometria Descritiva A
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {disciplinasExibir.map((disc, idx) => {
          const cif = getCIF(disc.id);
          const tipoBadge =
            disc.tipo === "trienal" ? { label: "Trienal", cls: "bg-blue-50 text-blue-600" } :
            disc.tipo === "bienal" ? { label: "Bienal", cls: "bg-purple-50 text-purple-600" } :
            { label: "Anual", cls: "bg-orange-50 text-orange-600" };

          return (
            <motion.div
              key={disc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
            >
              {/* Header da disciplina */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F2F2F7]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[15px] font-semibold text-[#1D1D1F]">{disc.nome}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tipoBadge.cls}`}>
                    {tipoBadge.label} · Peso {disc.tipo === "trienal" ? 3 : disc.tipo === "bienal" ? 2 : 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#AEAEB2]">CIF</span>
                  <BadgeCIF cif={cif} />
                </div>
              </div>

              {/* Grelha de notas */}
              <div className="px-5 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left text-[12px] font-medium text-[#AEAEB2] pb-2 w-16">Ano</th>
                        <th className="text-center text-[12px] font-medium text-[#AEAEB2] pb-2">1.º Período</th>
                        <th className="text-center text-[12px] font-medium text-[#AEAEB2] pb-2">2.º Período</th>
                        <th className="text-center text-[12px] font-medium text-[#AEAEB2] pb-2">3.º Período</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F7]">
                      {disc.anos.map((ano) => {
                        const notas = getNotas(disc.id, ano);
                        return (
                          <tr key={ano}>
                            <td className="py-2.5 text-[13px] font-semibold text-[#6E6E73]">{ano}.º</td>
                            {(["p1", "p2", "p3"] as const).map((p) => (
                              <td key={p} className="py-2.5 text-center">
                                <NotaInput
                                  value={notas[p]}
                                  onChange={(v) => handleNota(disc.id, ano, p, v)}
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botão avançar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => dispatch({ type: "SET_PASSO", passo: 3 })}
          disabled={!podeProsseguir}
          className="px-6 py-3 bg-[#0071E3] text-white text-[15px] font-semibold rounded-xl hover:bg-[#0077ED] active:bg-[#006CC7] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Continuar para Opções do 12.º Ano →
        </button>
      </div>
    </motion.div>
  );
}
