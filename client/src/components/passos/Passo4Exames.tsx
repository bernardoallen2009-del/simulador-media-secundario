// =============================================================================
// PASSO 4 — Exames Nacionais
// Design: Apple Education White — seleção de tipo de exame e nota
// =============================================================================

import { motion } from "framer-motion";
import { CURSOS, calcularCIF, calcularCFD, normalizarNota, DISCIPLINAS_COM_EXAME_12 } from "@/lib/cursos";
import { useSimulador } from "@/contexts/SimuladorContext";

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
      className={`w-36 text-sm font-medium rounded-lg border px-3 py-2 outline-none transition-all duration-150
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
    { val: null, label: "Não vai a exame" },
    { val: "interno", label: "Aluno Interno" },
    { val: "ingresso", label: "Prova de Ingresso" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {opcoes.map((op) => (
        <button
          key={String(op.val)}
          onClick={() => onChange(op.val)}
          className={`px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-all duration-150
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

  // Disciplinas do curso com exame nacional
  const disciplinasComExame = curso.disciplinas.filter((d) => d.exameNacional);

  // Opcionais com exame
  const opcionaisComExame = [
    { slot: 1 as const, opcao: state.opcional1 },
    { slot: 2 as const, opcao: state.opcional2 },
  ].filter(({ opcao }) => opcao.nome && DISCIPLINAS_COM_EXAME_12[opcao.nome as keyof typeof DISCIPLINAS_COM_EXAME_12]);

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
          Indica se vais a exame e qual a nota. Como aluno interno, a CFD = CIF × 75% + Exame × 25%.
        </p>
      </div>

      <div className="space-y-4">
        {/* Disciplinas trienais do curso com exame */}
        {disciplinasComExame.map((disc, idx) => {
          const dados = state.dadosDisciplinas[disc.id];
          const cif = getCIFDisc(disc.id);
          const tipoExame = dados?.tipoExame ?? null;
          const notaExame = dados?.notaExame ?? "";
          const notaExameNum = normalizarNota(notaExame);
          const cfd = cif !== null ? calcularCFD(cif, notaExameNum, tipoExame) : null;

          return (
            <motion.div
              key={disc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#F2F2F7] flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#1D1D1F]">{disc.nome}</span>
                {disc.codigoExame && (
                  <span className="text-[11px] text-[#AEAEB2]">Código: {disc.codigoExame}</span>
                )}
              </div>
              <div className="px-5 py-4 space-y-3">
                <TipoExameSelector
                  value={tipoExame}
                  onChange={(v) => dispatch({ type: "SET_TIPO_EXAME", disciplinaId: disc.id, tipoExame: v })}
                />
                {tipoExame !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-4 flex-wrap"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-[#AEAEB2]">Nota do Exame</label>
                      <NotaExameInput
                        value={notaExame}
                        onChange={(v) => dispatch({ type: "SET_NOTA_EXAME", disciplinaId: disc.id, notaExame: v })}
                      />
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#AEAEB2] mb-0.5">CIF</span>
                        <span className="font-semibold text-[#1D1D1F] tabular-nums">
                          {cif !== null ? cif.toFixed(1) : "—"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#AEAEB2] mb-0.5">CFD</span>
                        <span className={`font-semibold tabular-nums ${
                          cfd !== null
                            ? cfd >= 14 ? "text-emerald-600" : cfd >= 10 ? "text-amber-600" : "text-red-600"
                            : "text-[#AEAEB2]"
                        }`}>
                          {cfd !== null ? cfd.toFixed(1) : "—"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Opcionais com exame */}
        {opcionaisComExame.map(({ slot, opcao }) => {
          const cif = getCIFOpcao(slot);
          const tipoExame = opcao.tipoExame;
          const notaExame = opcao.notaExame;
          const notaExameNum = normalizarNota(notaExame);
          const cfd = cif !== null ? calcularCFD(cif, notaExameNum, tipoExame) : null;

          return (
            <motion.div
              key={`opcao-${slot}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#F2F2F7] flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#1D1D1F]">{opcao.nome}</span>
                <span className="text-[11px] text-[#AEAEB2]">Opção {slot}</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <TipoExameSelector
                  value={tipoExame}
                  onChange={(v) => dispatch({ type: "SET_TIPO_EXAME_OPCAO", slot, tipoExame: v })}
                />
                {tipoExame !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-4 flex-wrap"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-[#AEAEB2]">Nota do Exame</label>
                      <NotaExameInput
                        value={notaExame}
                        onChange={(v) => dispatch({ type: "SET_NOTA_EXAME_OPCAO", slot, notaExame: v })}
                      />
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#AEAEB2] mb-0.5">CIF</span>
                        <span className="font-semibold text-[#1D1D1F] tabular-nums">
                          {cif !== null ? cif.toFixed(1) : "—"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#AEAEB2] mb-0.5">CFD</span>
                        <span className={`font-semibold tabular-nums ${
                          cfd !== null
                            ? cfd >= 14 ? "text-emerald-600" : cfd >= 10 ? "text-amber-600" : "text-red-600"
                            : "text-[#AEAEB2]"
                        }`}>
                          {cfd !== null ? cfd.toFixed(1) : "—"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {disciplinasComExame.length === 0 && opcionaisComExame.length === 0 && (
          <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center text-[#6E6E73]">
            Nenhuma disciplina com exame nacional configurada.
          </div>
        )}
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
