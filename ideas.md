# Ideias de Design — Simulador de Média do Ensino Secundário

<response>
<text>
## Abordagem 1 — "Apple Education White"

**Design Movement:** Minimalismo Funcional inspirado em Apple.com e Apple Education

**Core Principles:**
- Espaço em branco generoso como elemento estrutural principal
- Hierarquia tipográfica clara com pesos contrastantes
- Interações suaves que guiam o utilizador sem distração
- Feedback visual imediato e legível

**Color Philosophy:**
- Fundo: #F5F5F7 (cinza Apple muito claro)
- Texto principal: #1D1D1F (quase preto Apple)
- Azul primário: #0071E3 (Apple Blue)
- Cards: branco puro com sombra ultra-subtil
- Bordas: #D2D2D7 (cinza neutro)

**Layout Paradigm:**
- Fluxo vertical em passos numerados (stepper lateral fixo no desktop)
- Cards flutuantes com glassmorphism subtil para cada secção
- Largura máxima de 860px centrada, com padding generoso

**Signature Elements:**
- Numeração de passos em círculos azuis com linha de progresso
- Inputs com foco animado (border azul + sombra suave)
- Cartão de resultado final com gradiente azul suave e número grande

**Interaction Philosophy:**
- Cada passo revela o seguinte com fade+slide-up
- Botões com hover scale(1.02) e active scale(0.98)
- Inputs com validação em tempo real (verde/vermelho subtil)

**Animation:**
- Fade-in + translateY(20px→0) em 300ms ease-out para cada secção
- Número da média final com counter animation
- Transição de step com slide horizontal suave

**Typography System:**
- Display: SF Pro Display / -apple-system / Inter (700-800)
- Body: SF Pro Text / -apple-system / Inter (400-500)
- Números de nota: monospace para alinhamento perfeito
</text>
<probability>0.09</probability>
</response>

<response>
<text>
## Abordagem 2 — "Academic Notebook"

**Design Movement:** Editorial Minimalismo com referências a cadernos académicos portugueses

**Core Principles:**
- Linhas horizontais subtis como textura de fundo (caderno)
- Tipografia serifada para títulos, sans-serif para dados
- Paleta quente e académica (creme, azul escuro, vermelho nota)
- Layout assimétrico com coluna lateral de navegação

**Color Philosophy:**
- Fundo: #FAFAF8 (creme papel)
- Texto: #2C2C2C
- Azul académico: #1A3A6B
- Destaque: #C0392B (vermelho nota)
- Cards: branco com borda esquerda colorida por disciplina

**Layout Paradigm:**
- Sidebar fixa à esquerda com navegação de passos
- Área principal com layout de "folha de caderno"
- Tabela de notas com linhas alternadas e espaçamento generoso

**Signature Elements:**
- Borda esquerda colorida nos cards de disciplina
- Ícone de livro/diploma no header
- Resultado final em estilo "carimbo oficial"

**Interaction Philosophy:**
- Transições de página com efeito de virar folha
- Hover nos campos com sublinhado animado
- Progresso visual em barra horizontal no topo

**Animation:**
- Slide-in da esquerda para cada novo passo
- Barra de progresso que cresce suavemente
- Números de média com efeito typewriter

**Typography System:**
- Títulos: Playfair Display (700) — serifada elegante
- Body: Inter (400/500)
- Notas: JetBrains Mono para números
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Abordagem 3 — "Frosted Glass Dashboard"

**Design Movement:** Glassmorphism moderno com fundo gradiente suave

**Core Principles:**
- Camadas de vidro fosco sobre fundo gradiente claro
- Tipografia display bold para impacto visual
- Cards com backdrop-blur e bordas translúcidas
- Paleta azul-lavanda suave com acentos vibrantes

**Color Philosophy:**
- Fundo: gradiente linear de #EEF2FF para #F0F9FF
- Cards: rgba(255,255,255,0.7) com backdrop-blur(20px)
- Azul primário: #2563EB
- Texto: #0F172A
- Destaque resultado: gradiente #2563EB → #0EA5E9

**Layout Paradigm:**
- Grid de 2 colunas no desktop: navegação + conteúdo
- Cards glassmorphism empilhados com sombras coloridas
- Resultado final em card central com glow effect

**Signature Elements:**
- Sombras coloridas nos cards (box-shadow com cor primária)
- Indicador de progresso circular (donut chart)
- Backdrop-blur em todos os painéis

**Interaction Philosophy:**
- Hover nos cards com lift effect (translateY(-4px))
- Inputs com glow azul no focus
- Animação de partículas subtil no resultado final

**Animation:**
- Scale-in para cards (0.95→1) com spring physics
- Glow pulsante no cartão de resultado
- Stagger animation nas linhas da tabela

**Typography System:**
- Títulos: Plus Jakarta Sans (800)
- Body: Inter (400/500)
- Números: Tabular nums com Inter
</text>
<probability>0.08</probability>
</response>

## Escolha Final: Abordagem 1 — "Apple Education White"

Escolhida por ser a mais adequada ao público-alvo (estudantes portugueses do secundário), por transmitir confiança e clareza, e por alinhar perfeitamente com o pedido explícito de "design estilo Apple" no briefing.
