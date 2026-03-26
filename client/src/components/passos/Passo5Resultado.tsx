// =============================================================================
// PASSO 5 — Dashboard de Resultados
// Design: Apple Education White — boletim visual com destaque da média final
// =============================================================================

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CURSOS, getNomeExame } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";
import { RotateCcw, Award, Info } from "lucide-react";

// Animação do número da média
function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target * 10) / 10);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span className="tabular-nums">
      {display.toFixed(1)}
    </span>
  );
}

function BadgeNota({ nota }: { nota: number | null }) {
  if (nota === null) return <span className="text-[#AEAEB2] tabular-nums">—</span>;
  const cls =
    nota >= 14 ? "bg-emerald-50 text-emerald-700" :
    nota >= 10 ? "bg-amber-50 text-amber-700" :
    "bg-red-50 text-red-700";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-sm font-semibold tabular-nums ${cls}`}>
      {nota.toFixed(1)}
    </span>
  );
}

export default function Passo5Resultado() {
  const { state, dispatch } = useSimulador();
  const resultado = state.resultado;
  const curso = CURSOS.find((c) => c.id === state.cursoPorId);

  if (!resultado || !curso) return null;

  const media = resultado.mediaFinal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Cartão principal da média */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl mb-6 p-8 text-center"
        style={{
          background: "linear-gradient(135deg, #0071E3 0%, #0EA5E9 100%)",
        }}
      >
        {/* Decoração de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-[15px] font-medium tracking-wide uppercase">
              Média Final do Ensino Secundário
            </span>
          </div>

          <div className="text-white" style={{ fontSize: "clamp(4rem, 15vw, 7rem)", fontWeight: 800, lineHeight: 1 }}>
            {media !== null ? <AnimatedNumber target={media} /> : "—"}
          </div>

          <p className="text-white/70 text-sm mt-3">
            {curso.nome}
          </p>
        </div>
      </motion.div>

      {/* Tabela de disciplinas */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden mb-4"
      >
        <div className="px-5 py-3.5 border-b border-[#F2F2F7] flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Boletim de Classificações</h3>
          <div className="group relative">
            <Info className="w-4 h-4 text-[#AEAEB2] cursor-help" />
            <div className="absolute left-6 top-0 z-10 hidden group-hover:block w-64 bg-[#1D1D1F] text-white text-xs rounded-xl p-3 shadow-lg">
              CFD = CIF × 75% + Exame × 25% (aluno interno). Sem exame, CFD = CIF. Melhor resultado é usado na média.
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F7]">
                <th className="text-left text-[12px] font-medium text-[#AEAEB2] px-5 py-2.5">Disciplina</th>
                <th className="text-center text-[12px] font-medium text-[#AEAEB2] px-3 py-2.5">Tipo</th>
                <th className="text-center text-[12px] font-medium text-[#AEAEB2] px-3 py-2.5">Peso</th>
                <th className="text-center text-[12px] font-medium text-[#AEAEB2] px-3 py-2.5">CIF</th>
                <th className="text-center text-[12px] font-medium text-[#AEAEB2] px-3 py-2.5">CFD Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F7]">
              {resultado.disciplinas.map((disc, idx) => {
                const tipoBadge =
                  disc.tipo === "trienal" ? { label: "Trienal", cls: "bg-blue-50 text-blue-600" } :
                  disc.tipo === "bienal" ? { label: "Bienal", cls: "bg-purple-50 text-purple-600" } :
                  { label: "Anual", cls: "bg-orange-50 text-orange-600" };

                return (
                  <motion.tr
                    key={disc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + idx * 0.04 }}
                    className="hover:bg-[#F5F5F7]/50 transition-colors duration-100"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#1D1D1F]">{disc.nome}</div>
                      {disc.exameAplicado && (
                        <div className="text-[11px] text-[#AEAEB2] mt-1">
                          {getNomeExame(disc.exameAplicado.codigoExame)} (Aluno Inscrito) = {disc.exameAplicado.notaExame}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tipoBadge.cls}`}>
                        {tipoBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-[#6E6E73] font-medium">{disc.peso}</td>
                    <td className="px-3 py-3 text-center">
                      <BadgeNota nota={disc.cif} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <BadgeNota nota={disc.cfd} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Legenda de fórmula */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-[#F5F5F7] rounded-2xl p-4 mb-6 text-[13px] text-[#6E6E73] leading-relaxed"
      >
        <strong className="text-[#1D1D1F]">Fórmula da Média:</strong>{" "}
        Σ(CFD × Peso) ÷ Σ(Pesos) — Trienal=3, Bienal=2, Anual=1.
        {resultado.disciplinas.filter((d) => d.exameAplicado !== null).length > 0 && (
          <span className="ml-1">
            · <strong className="text-[#1D1D1F]">Com exames:</strong> CFD = CIF (arredondada) × 75% + Nota Exame × 25%.
          </span>
        )}
      </motion.div>

      {/* Botão recomeçar */}
      <div className="flex justify-center">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="flex items-center gap-2 px-6 py-3 text-[#0071E3] text-[15px] font-semibold rounded-xl border border-[#0071E3]/30 hover:bg-[#0071E3]/5 transition-all duration-150"
        >
          <RotateCcw className="w-4 h-4" />
          Recomeçar Simulação
        </button>
      </div>
    </motion.div>
  );
}
