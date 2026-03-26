// =============================================================================
// PASSO 1 — Escolha do Curso
// Design: Apple Education White — cards de seleção com hover e animação
// =============================================================================

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Globe, Palette } from "lucide-react";
import { CURSOS } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";

const ICONES = [BookOpen, TrendingUp, Globe, Palette];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Passo1Curso() {
  const { dispatch } = useSimulador();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">
          Qual é o teu curso?
        </h2>
        <p className="text-[#6E6E73] text-base">
          Seleciona o curso científico-humanístico que frequentas para configurar as disciplinas.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {CURSOS.map((curso, idx) => {
          const Icon = ICONES[idx];
          return (
            <motion.button
              key={curso.id}
              variants={item}
              onClick={() => dispatch({ type: "SET_CURSO", cursoId: curso.id })}
              className="group relative text-left bg-white rounded-2xl p-6 border border-[#E5E5EA] shadow-sm hover:shadow-md hover:border-[#0071E3]/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
              style={{ "--curso-cor": curso.cor } as React.CSSProperties}
            >
              {/* Ícone colorido */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${curso.cor}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: curso.cor }} />
              </div>

              {/* Nome e descrição */}
              <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1 leading-snug">
                {curso.nome}
              </h3>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                {curso.descricao}
              </p>

              {/* Seta de acesso */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke={curso.cor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Linha de destaque inferior */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: curso.cor }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
