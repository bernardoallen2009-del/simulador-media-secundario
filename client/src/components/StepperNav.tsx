// =============================================================================
// STEPPER NAV — Indicador de progresso lateral
// Design: Apple Education White — passos numerados com linha de progresso
// =============================================================================

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSimulador } from "@/contexts/SimuladorContext";
import { CURSOS } from "@/lib/cursos";

const PASSOS = [
  { id: 1, label: "Curso" },
  { id: 2, label: "Notas" },
  { id: 3, label: "Opções 12.º" },
  { id: 4, label: "Exames" },
  { id: 5, label: "Resultado" },
];

export default function StepperNav() {
  const { state, dispatch } = useSimulador();
  const passo = state.passo;

  const podeSaltarPara = (id: number) => {
    if (id === 1) return true;
    if (id === 2) return state.cursoPorId !== null;
    if (id === 3) return state.cursoPorId !== null;
    if (id === 4) return state.cursoPorId !== null;
    return false; // passo 5 só via cálculo
  };

  return (
    <nav className="flex flex-col gap-1">
      {PASSOS.map((p, idx) => {
        const isActive = passo === p.id;
        const isDone = passo > p.id;
        const canClick = podeSaltarPara(p.id) && !isActive && p.id !== 5;

        return (
          <div key={p.id} className="flex items-stretch gap-3">
            {/* Linha vertical + círculo */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: isActive ? "#0071E3" : isDone ? "#34C759" : "#E5E5EA",
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                ) : (
                  <span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#AEAEB2]"}`}>
                    {p.id}
                  </span>
                )}
              </motion.div>
              {idx < PASSOS.length - 1 && (
                <div className="w-px flex-1 mt-1 mb-1 min-h-4">
                  <motion.div
                    className="w-full h-full rounded-full"
                    animate={{ backgroundColor: isDone ? "#34C759" : "#E5E5EA" }}
                    transition={{ duration: 0.3 }}
                    style={{ minHeight: "16px" }}
                  />
                </div>
              )}
            </div>

            {/* Label */}
            <button
              disabled={!canClick}
              onClick={() => canClick && dispatch({ type: "SET_PASSO", passo: p.id })}
              className={`text-[14px] font-medium pb-4 text-left transition-colors duration-150
                ${isActive ? "text-[#0071E3]" : isDone ? "text-[#34C759]" : "text-[#AEAEB2]"}
                ${canClick ? "hover:text-[#0071E3] cursor-pointer" : "cursor-default"}
              `}
            >
              {p.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
