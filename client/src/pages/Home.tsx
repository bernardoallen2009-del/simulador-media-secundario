// =============================================================================
// HOME — Layout principal do Simulador de Média do Ensino Secundário
// Design: Apple Education White
// Filosofia: Minimalismo funcional Apple, espaço em branco generoso,
//   hierarquia tipográfica clara, azul #0071E3, fundo #F5F5F7
// =============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, LogOut } from "lucide-react";
import { SimuladorProvider, useSimulador } from "@/contexts/SimuladorContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import StepperNav from "@/components/StepperNav";
import Passo1Curso from "@/components/passos/Passo1Curso";
import Passo2Notas from "@/components/passos/Passo2Notas";
import Passo3Opcoes from "@/components/passos/Passo3Opcoes";
import Passo4Exames from "@/components/passos/Passo4Exames";
import Passo5Resultado from "@/components/passos/Passo5Resultado";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663481093177/TiSqR2YRFWgkztqLrY8UYt/hero-bg-Xx9roi8jbWV26bf4xphwwW.webp";

function SimuladorContent() {
  const { state } = useSimulador();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F7" }}>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3] flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight">
              Simulador de Média
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#AEAEB2] hidden sm:block">
              Ensino Secundário · Portugal
            </span>
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#0071E3] hover:bg-[#0071E3]/5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {state.passo === 1 && (
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-[#1D1D1F] tracking-tight leading-tight mb-4">
                Calcula a tua Média<br />
                <span style={{ color: "#0071E3" }}>do Ensino Secundário</span>
              </h1>
              <p className="text-[#6E6E73] text-lg max-w-xl mx-auto">
                Simula a tua classificação final com base nas notas dos períodos e exames nacionais, seguindo a legislação portuguesa em vigor.
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Stepper lateral (desktop) */}
          <aside className="hidden lg:block w-36 flex-shrink-0 sticky top-20">
            <StepperNav />
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            {/* Stepper horizontal (mobile) */}
            <div className="lg:hidden mb-6">
              <MobileProgress passo={state.passo} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={state.passo}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                {state.passo === 1 && <Passo1Curso />}
                {state.passo === 2 && <Passo2Notas />}
                {state.passo === 3 && <Passo3Opcoes />}
                {state.passo === 4 && <Passo4Exames />}
                {state.passo === 5 && <Passo5Resultado />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-[#E5E5EA] bg-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-[#AEAEB2]">
            Simulador não oficial. Consulta sempre os regulamentos oficiais do Ministério da Educação.
          </p>
          <p className="text-[12px] text-[#AEAEB2]">
            Ensino Secundário · Portugal · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

function MobileProgress({ passo }: { passo: number }) {
  const labels = ["Curso", "Notas", "Opções", "Exames", "Resultado"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((label, idx) => {
        const id = idx + 1;
        const isActive = passo === id;
        const isDone = passo > id;
        return (
          <div key={id} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`h-1 w-full rounded-full transition-all duration-300 ${
                  isDone ? "bg-[#34C759]" : isActive ? "bg-[#0071E3]" : "bg-[#E5E5EA]"
                }`}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#0071E3]" : isDone ? "text-[#34C759]" : "text-[#AEAEB2]"}`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <SimuladorProvider>
      <SimuladorContent />
    </SimuladorProvider>
  );
}
