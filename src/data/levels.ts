import type { Level } from '@/types';

// ══════════════════════════════════════════════════════════════════
//  MUNDO 1 — FUNDAMENTOS (mecânica: conceitos e identificação)
//  Tipos: quiz, match, identify, select-elements, fill-diagram
// ══════════════════════════════════════════════════════════════════

const W1: Level[] = [
  // ── Fase 1: O que é um estado? ──────────────────────────────────
  {
    id: 1, world: 1, name: 'Estados da Lâmpada', difficulty: 1,
    concept: 'Conceito de Estado',
    story: 'Uma lâmpada só pode estar em dois estados: ligada ou desligada. Como um autômato, ela nunca está "entre" dois estados ao mesmo tempo.',
    pedagogy: 'O aluno associa "estado" a uma configuração discreta de um sistema familiar antes de ver a definição formal.',
    hint: 'Um estado é uma "foto" do sistema num dado instante. Pergunte: em quantas situações distintas a lâmpada pode estar?',
    states: [
      { id: 'lig', label: 'Lig', x: 220, y: 230, isInitial: true,  isAccept: false },
      { id: 'des', label: 'Des', x: 540, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'lig', to: 'des', label: 'off' },
      { from: 'des', to: 'lig', label: 'on'  },
    ],
    activity: {
      type: 'quiz',
      question: 'No diagrama da lâmpada, o que representa cada círculo (nó)?',
      options: [
        'Um estado — uma configuração em que a lâmpada pode estar',
        'Uma ação — o ato de ligar ou desligar',
        'Uma string — a sequência de eventos',
        'O alfabeto — os símbolos possíveis',
      ],
      answer: 'Um estado — uma configuração em que a lâmpada pode estar',
    },
  },

  // ── Fase 2: Identificar estado inicial ──────────────────────────
  {
    id: 2, world: 1, name: 'Ponto de Partida', difficulty: 1,
    concept: 'Estado Inicial',
    story: 'Todo autômato precisa de um ponto de partida — um estado inicial. No diagrama, ele é marcado por uma seta vinda de fora apontando para ele.',
    pedagogy: 'O aluno identifica visualmente o estado inicial no diagrama.',
    hint: 'Procure a seta que não vem de nenhum estado — ela aponta para o estado inicial.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 400, y: 150, isInitial: false, isAccept: true  },
      { id: 'q2', label: 'q2', x: 400, y: 320, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'identify',
      instruction: 'Toque no estado INICIAL do autômato abaixo.',
      correctIds: ['q0'],
      maxSelections: 1,
    },
  },

  // ── Fase 3: Identificar estados aceitadores ──────────────────────
  {
    id: 3, world: 1, name: 'Estados Aceitadores', difficulty: 1,
    concept: 'Estado de Aceitação',
    story: 'Estados aceitadores (círculo duplo) são as "metas" do autômato. Se terminar neles, a string é aceita. Podem ser mais de um!',
    pedagogy: 'O aluno diferencia visualmente estados normais de estados aceitadores (círculo duplo).',
    hint: 'Procure os estados com dois círculos concêntricos — eles são os aceitadores.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 400, y: 150, isInitial: false, isAccept: true  },
      { id: 'q2', label: 'q2', x: 400, y: 320, isInitial: false, isAccept: false },
      { id: 'q3', label: 'q3', x: 600, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q3', label: 'b' },
      { from: 'q2', to: 'q3', label: 'a' },
    ],
    activity: {
      type: 'identify',
      instruction: 'Toque em TODOS os estados aceitadores (círculo duplo) do autômato.',
      correctIds: ['q1', 'q3'],
    },
  },

  // ── Fase 4: Associar conceitos ───────────────────────────────────
  {
    id: 4, world: 1, name: 'Vocabulário do AF', difficulty: 2,
    concept: 'Componentes Formais: Q, Σ, δ, q0, F',
    story: 'Um autômato é definido formalmente por 5 componentes. Dominar essa notação é a base para entender tudo que vem depois.',
    pedagogy: 'O aluno associa os símbolos formais às suas definições em linguagem natural.',
    hint: 'Q = estados, Σ = alfabeto, δ = função de transição, q0 = inicial, F = aceitadores.',
    states: [], transitions: [],
    activity: {
      type: 'match',
      instruction: 'Associe cada símbolo formal à sua definição:',
      pairs: [
        { id: 'Q',  left: 'Q',  right: 'Conjunto finito de todos os estados do autômato' },
        { id: 'S',  left: 'Σ',  right: 'Alfabeto — conjunto de símbolos que o AF pode ler' },
        { id: 'd',  left: 'δ',  right: 'Função de transição — define os caminhos entre estados' },
        { id: 'q0', left: 'q0', right: 'Estado inicial — onde o processamento começa' },
        { id: 'F',  left: 'F',  right: 'Conjunto de estados de aceitação (estados finais)' },
      ],
    },
  },

  // ── Fase 5: Selecionar caminho de aceitação ──────────────────────
  {
    id: 5, world: 1, name: 'Caminho da String "ab"', difficulty: 2,
    concept: 'Caminho de Aceitação',
    story: 'Seguir uma string num diagrama é como traçar um caminho. Selecione o caminho correto que a string "ab" percorre neste autômato.',
    pedagogy: 'O aluno rastreia visualmente o caminho de uma string simples antes de formalizar a função δ*.',
    hint: 'Parta do estado inicial, siga a seta rotulada "a", depois a seta rotulada "b".',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 400, y: 230, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 600, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q2', label: 'b' },
      { from: 'q0', to: 'q0', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
    ],
    activity: {
      type: 'select-elements',
      instruction: 'Selecione, em ordem, os estados que a string "ab" percorre neste autômato (incluindo o estado inicial e o final).',
      correctIds: ['q0', 'q1', 'q2'],
    },
  },

  // ── Fase 6: Ordenar componentes ──────────────────────────────────
  {
    id: 6, world: 1, name: 'Ordem das Etapas', difficulty: 2,
    concept: 'Processamento passo a passo',
    story: 'Processar uma string num autômato segue uma sequência rigorosa de passos. A ordem importa!',
    pedagogy: 'O aluno ordena os passos do processamento, consolidando o procedimento antes de aplicá-lo.',
    hint: 'Primeiro define-se o ponto de partida, depois lê-se cada símbolo em ordem, e por último verifica-se onde terminou.',
    states: [], transitions: [],
    activity: {
      type: 'order',
      instruction: 'Ordene os passos do processamento de uma string num autômato finito:',
      items: [
        '1. Partir do estado inicial (q0)',
        '2. Ler o próximo símbolo da string (da esquerda para a direita)',
        '3. Seguir a transição δ(estado atual, símbolo lido)',
        '4. Atualizar o estado atual para o estado de destino',
        '5. Repetir passos 2–4 até o fim da string',
        '6. Verificar se o estado atual pertence a F (estados de aceitação)',
      ],
    },
  },

  // ── Fase 7: Quiz alfabeto ────────────────────────────────────────
  {
    id: 7, world: 1, name: 'O Alfabeto Σ', difficulty: 2,
    concept: 'Alfabeto e Strings',
    story: 'Num autômato binário, Σ = {0, 1}. Todas as strings de entrada são compostas apenas desses símbolos.',
    pedagogy: 'O aluno reforça o conceito de alfabeto e o distingue de string e de estado.',
    hint: 'Σ é o conjunto de símbolos permitidos. Uma string é uma sequência de símbolos de Σ.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 400, y: 230, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 600, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: '0' },
      { from: 'q1', to: 'q2', label: '1' },
      { from: 'q2', to: 'q2', label: '1' },
      { from: 'q2', to: 'q0', label: '0' },
    ],
    activity: {
      type: 'quiz',
      question: 'Qual é o alfabeto Σ do autômato exibido?',
      options: [
        'Σ = {0, 1}',
        'Σ = {q0, q1, q2}',
        'Σ = {0, 1, q0}',
        'Σ = {"01", "10"}',
      ],
      answer: 'Σ = {0, 1}',
    },
  },

  // ── Fase 8: Completar diagrama (fill-diagram) ────────────────────
  {
    id: 8, world: 1, name: 'Monte o Autômato', difficulty: 3,
    concept: 'Estado Inicial e Aceitadores',
    story: 'O diagrama está incompleto! As transições já estão lá, mas você precisa definir qual estado é inicial e quais são aceitadores.',
    pedagogy: 'O aluno aplica o conhecimento de estado inicial e aceitador para completar ativamente um diagrama parcial.',
    hint: 'A linguagem aceita strings que terminam com "a". Qual estado representa esse final?',
    states: [
      { id: 'q0', label: 'q0', x: 200, y: 230, isInitial: false, isAccept: false },
      { id: 'q1', label: 'q1', x: 420, y: 140, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 420, y: 320, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q2', label: 'b' },
      { from: 'q2', to: 'q1', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'fill-diagram',
      instruction: 'Este autômato aceita strings que TERMINAM com "a". Defina o estado inicial e o(s) estado(s) aceitador(es).',
      correctInitial: ['q0'],
      correctAccept: ['q1'],
    },
  },

  // ── Fase 9: Associar estados a papéis ────────────────────────────
  {
    id: 9, world: 1, name: 'Papéis dos Estados', difficulty: 3,
    concept: 'Tipos de Estado: inicial, aceitador, erro',
    story: 'Cada estado num autômato desempenha um papel específico. Saber identificar esses papéis é essencial para leitura de diagramas.',
    pedagogy: 'O aluno associa identificadores de estados a seus papéis, reforçando a leitura de diagramas reais.',
    hint: 'Estado com seta entrante externa = inicial. Dois círculos = aceitador. Vermelho = erro.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 400, y: 150, isInitial: false, isAccept: true  },
      { id: 'q2', label: 'q2', x: 400, y: 320, isInitial: false, isAccept: false, isError: true },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'match',
      instruction: 'Associe cada estado ao seu papel no autômato:',
      pairs: [
        { id: 'r1', left: 'q0', right: 'Estado inicial (seta entrante externa)' },
        { id: 'r2', left: 'q1', right: 'Estado de aceitação (círculo duplo)' },
        { id: 'r3', left: 'q2', right: 'Estado de erro / rejeição' },
      ],
    },
  },

  // ── Fase 10: Revisar Mundo 1 ─────────────────────────────────────
  {
    id: 10, world: 1, name: 'Revisão: Fundamentos', difficulty: 3,
    concept: 'Revisão geral: estados, alfabeto, diagrama',
    story: 'Hora de consolidar! Este desafio revisita todos os conceitos do Mundo 1 em uma única questão de síntese.',
    pedagogy: 'Prática de Recuperação: o aluno recupera ativamente múltiplos conceitos sem material de apoio.',
    hint: 'Revise: estado inicial = seta externa; aceitador = círculo duplo; alfabeto = símbolos nas setas.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 430, y: 230, isInitial: false, isAccept: true  },
      { id: 'q2', label: 'q2', x: 620, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q2', label: 'b' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'quiz',
      question: 'Analisando o autômato: qual afirmação está CORRETA?',
      options: [
        'q0 é inicial, q1 é aceitador, Σ = {a, b} e "aa" é aceita',
        'q0 é aceitador, q1 é inicial, Σ = {a, b} e "ab" é aceita',
        'q1 é inicial, q2 é aceitador, e "b" é aceita',
        'Σ = {q0, q1, q2} e "aa" é rejeitada',
      ],
      answer: 'q0 é inicial, q1 é aceitador, Σ = {a, b} e "aa" é aceita',
    },
  },
];

// ══════════════════════════════════════════════════════════════════
//  MUNDO 2 — RACIOCÍNIO (mecânica: transições e reconhecimento)
//  Tipos: dragdrop, order, select-elements + quiz e identify (intercalados)
// ══════════════════════════════════════════════════════════════════

const W2: Level[] = [
  // ── Fase 11: O que é δ? ─────────────────────────────────────────
  {
    id: 11, world: 2, name: 'A Função de Transição', difficulty: 1,
    concept: 'Função δ: Q × Σ → Q',
    story: 'A função δ é o "motor" do autômato. Ela diz exatamente para onde ir dado o estado atual e o símbolo lido.',
    pedagogy: 'Mundo 2 inicia com quiz (reuso de Mundo 1) para ativar conhecimento prévio antes de introduzir mecânica nova (dragdrop).',
    hint: 'δ(q, a) = q\' significa: no estado q, ao ler a, vá para q\'.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 430, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: '0' },
      { from: 'q1', to: 'q0', label: '1' },
      { from: 'q0', to: 'q0', label: '1' },
      { from: 'q1', to: 'q1', label: '0' },
    ],
    activity: {
      type: 'quiz',
      question: 'No autômato exibido, o que representa δ(q0, 0) = q1?',
      options: [
        'No estado q0, ao ler o símbolo 0, o autômato vai para q1',
        'No estado q1, ao ler 0, o autômato vai para q0',
        'O alfabeto contém apenas 0 e q0',
        'q1 é o estado inicial do autômato',
      ],
      answer: 'No estado q0, ao ler o símbolo 0, o autômato vai para q1',
    },
  },

  // ── Fase 12: Arrastar rótulos de transição ────────────────────────
  {
    id: 12, world: 2, name: 'Complete as Transições', difficulty: 2,
    concept: 'Completar função de transição por dragdrop',
    story: 'Algumas setas deste autômato perderam seus rótulos! Arraste os símbolos corretos para completar a função de transição.',
    pedagogy: 'Mecânica central do Mundo 2: dragdrop de rótulos em transições. Exige aplicação direta de δ.',
    hint: 'Este autômato aceita strings com número ÍMPAR de "a"s. Pense qual símbolo causa a troca de estado.',
    states: [
      { id: 'par',  label: 'Par',  x: 200, y: 230, isInitial: true,  isAccept: false },
      { id: 'imp',  label: 'Ímpar', x: 500, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'par', to: 'imp', label: 'a' },
      { from: 'imp', to: 'par', label: 'a' },
      { from: 'par', to: 'par', label: 'b' },
      { from: 'imp', to: 'imp', label: 'b' },
    ],
    activity: {
      type: 'dragdrop',
      instruction: 'Arraste os rótulos corretos para as setas "?" do autômato (conta número ímpar de "a"s).',
      blanks: [
        { from: 'par', to: 'imp', correctLabel: 'a' },
        { from: 'imp', to: 'par', correctLabel: 'a' },
      ],
      labelPool: ['a', 'b', 'a,b', '0', '1'],
    },
  },

  // ── Fase 13: Rastrear string ("select-elements") ─────────────────
  {
    id: 13, world: 2, name: 'Rastrea "010"', difficulty: 2,
    concept: 'δ* — função de transição estendida',
    story: 'A string "010" entra no autômato. Selecione, em ordem, todos os estados visitados durante o processamento — incluindo inicial e final.',
    pedagogy: 'Intercala mecânica select-elements (do Mundo 1) com conteúdo de Mundo 2 (δ*), forçando raciocínio procedimental.',
    hint: 'Parta de q0, siga 0→q1, depois 1→?, depois 0→?. Siga as setas!',
    states: [
      { id: 'q0', label: 'q0', x: 200, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 420, y: 140, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 420, y: 320, isInitial: false, isAccept: true  },
      { id: 'q3', label: 'q3', x: 620, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: '0' },
      { from: 'q0', to: 'q3', label: '1' },
      { from: 'q1', to: 'q2', label: '1' },
      { from: 'q1', to: 'q0', label: '0' },
      { from: 'q2', to: 'q1', label: '0' },
      { from: 'q2', to: 'q3', label: '1' },
      { from: 'q3', to: 'q3', label: '0' },
      { from: 'q3', to: 'q3', label: '1' },
    ],
    activity: {
      type: 'select-elements',
      instruction: 'Selecione (em ordem) todos os estados que a string "010" percorre neste autômato.',
      correctIds: ['q0', 'q1', 'q2', 'q1'],
    },
  },

  // ── Fase 14: Dragdrop com loop ────────────────────────────────────
  {
    id: 14, world: 2, name: 'Auto-Transições', difficulty: 2,
    concept: 'Self-loop: δ(q, a) = q',
    story: 'Algumas transições mantêm o autômato no mesmo estado — as famosas auto-transições (loops). Complete o autômato com os rótulos corretos.',
    pedagogy: 'Aprofunda dragdrop com auto-transições — tipo de problema diferente da fase anterior, aplicando Intercalação.',
    hint: 'Uma auto-transição (loop) significa que ler aquele símbolo não muda o estado. Qual símbolo mantém cada estado?',
    states: [
      { id: 'q0', label: 'q0', x: 200, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q0', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q0', label: 'b' },
    ],
    activity: {
      type: 'dragdrop',
      instruction: 'Complete as auto-transições deste autômato. Ele aceita strings que terminam com "a".',
      blanks: [
        { from: 'q0', to: 'q0', correctLabel: 'b' },
        { from: 'q1', to: 'q1', correctLabel: 'a' },
      ],
      labelPool: ['a', 'b', 'ε', 'a,b'],
    },
  },

  // ── Fase 15: Quiz aceitação/rejeição ────────────────────────────
  {
    id: 15, world: 2, name: 'Aceita ou Rejeita?', difficulty: 3,
    concept: 'Aceitação e Rejeição de Strings',
    story: 'Agora o desafio é decidir: dada uma string, o autômato a aceita ou rejeita? Trace o caminho mentalmente.',
    pedagogy: 'Quiz (intercalado do Mundo 1) com conteúdo de nível 2, exigindo rastrear δ* mentalmente.',
    hint: 'Trace: "bba" → q0→(b)→q0→(b)→q0→(a)→q1. q1 é aceitador? Verifique!',
    states: [
      { id: 'q0', label: 'q0', x: 200, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q0', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q0', label: 'b' },
    ],
    activity: {
      type: 'quiz',
      question: 'Qual das strings abaixo é ACEITA por este autômato (que aceita strings terminando em "a")?',
      options: ['"bba"', '"aab"', '"bb"', '"aba"... não, "abab"'],
      answer: '"bba"',
    },
  },

  // ── Fase 16: Ordenar passos de δ* ────────────────────────────────
  {
    id: 16, world: 2, name: 'Passo a Passo de δ*', difficulty: 3,
    concept: 'Função de Transição Estendida δ*',
    story: 'A função δ* aplica δ repetidamente, símbolo por símbolo. Ordene os passos do cálculo de δ*(q0, "ab").',
    pedagogy: 'Order reforça o procedimento formal de δ*, distinguindo-o de δ simples.',
    hint: 'δ*(q0, "ab") = δ(δ*(q0, "a"), b) = δ(δ(q0, a), b).',
    states: [], transitions: [],
    activity: {
      type: 'order',
      instruction: 'Ordene os passos para calcular δ*(q0, "ab") — onde Σ = {a, b}, δ(q0,a)=q1, δ(q1,b)=q2:',
      items: [
        '1. Partir de q0 com a string completa "ab"',
        '2. Ler o primeiro símbolo "a": aplicar δ(q0, a) = q1',
        '3. Estado atual passa a ser q1',
        '4. Ler o próximo símbolo "b": aplicar δ(q1, b) = q2',
        '5. Estado atual passa a ser q2',
        '6. String esgotada. Verificar: q2 ∈ F? Se sim → aceita',
      ],
    },
  },

  // ── Fase 17: Identificar tabela de transição ──────────────────────
  {
    id: 17, world: 2, name: 'Tabela de Transição', difficulty: 3,
    concept: 'Tabela de transição como representação de δ',
    story: 'A tabela de transição é outra forma de representar o mesmo autômato do diagrama. Cada célula é um valor de δ.',
    pedagogy: 'Reativa identify (Mundo 1) com conteúdo de Mundo 2: o aluno identifica o estado aceitador na tabela.',
    hint: 'Na tabela, linhas = estados, colunas = símbolos. Estados marcados com * são aceitadores.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 420, y: 150, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 420, y: 320, isInitial: false, isAccept: true  },
      { id: 'q3', label: 'q3', x: 630, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q3', label: 'a' },
      { from: 'q1', to: 'q1', label: 'b' },
      { from: 'q2', to: 'q2', label: 'a' },
      { from: 'q2', to: 'q3', label: 'b' },
      { from: 'q3', to: 'q3', label: 'a' },
      { from: 'q3', to: 'q3', label: 'b' },
    ],
    activity: {
      type: 'identify',
      instruction: 'Identifique o estado de ACEITAÇÃO deste autômato tocando nele no diagrama.',
      correctIds: ['q2'],
      maxSelections: 1,
    },
  },

  // ── Fase 18: Dragdrop 3 estados ───────────────────────────────────
  {
    id: 18, world: 2, name: 'Três Estados, Duas Letras', difficulty: 4,
    concept: 'Completar autômato com 3 estados e Σ = {a, b}',
    story: 'Um autômato mais complexo — 3 estados e 2 símbolos. Complete TODAS as transições faltantes.',
    pedagogy: 'Dragdrop com maior número de blanks, exigindo raciocínio mais longo e tolerância a ambiguidade.',
    hint: 'Este autômato aceita strings com número de "a"s divisível por 3. O estado representa o resto da divisão.',
    states: [
      { id: 'q0', label: 'q0', x: 200, y: 230, isInitial: true,  isAccept: true  },
      { id: 'q1', label: 'q1', x: 430, y: 140, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 430, y: 320, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q2', label: 'a' },
      { from: 'q2', to: 'q0', label: 'a' },
      { from: 'q0', to: 'q0', label: 'b' },
      { from: 'q1', to: 'q1', label: 'b' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'dragdrop',
      instruction: 'Complete as transições faltantes. O autômato aceita strings com número de "a"s divisível por 3.',
      blanks: [
        { from: 'q1', to: 'q2', correctLabel: 'a' },
        { from: 'q2', to: 'q0', correctLabel: 'a' },
        { from: 'q1', to: 'q1', correctLabel: 'b' },
      ],
      labelPool: ['a', 'b', 'ε', 'a,b', '0', '1'],
    },
  },

  // ── Fase 19: Selecionar caminho "aba" ────────────────────────────
  {
    id: 19, world: 2, name: 'Caminho de "aba"', difficulty: 4,
    concept: 'Rastreamento manual de δ*',
    story: 'Rastreie manualmente o caminho da string "aba" no autômato. Selecione todos os estados visitados, na ordem correta.',
    pedagogy: 'Variação do select-elements de nível mais alto: string mais longa, mais estados visitados, exige mais memória de trabalho.',
    hint: '"aba": q0→(a)→q1→(b)→?→(a)→?. Siga cada seta com atenção ao rótulo.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 380, y: 140, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 380, y: 320, isInitial: false, isAccept: false },
      { id: 'q3', label: 'q3', x: 580, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q3', label: 'b' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q2', to: 'q3', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
      { from: 'q3', to: 'q3', label: 'a' },
      { from: 'q3', to: 'q3', label: 'b' },
    ],
    activity: {
      type: 'select-elements',
      instruction: 'Selecione, em ordem, todos os estados percorridos ao processar "aba" (incluindo início e fim).',
      correctIds: ['q0', 'q1', 'q3', 'q3'],
    },
  },

  // ── Fase 20: Revisão Mundo 2 ─────────────────────────────────────
  {
    id: 20, world: 2, name: 'Revisão: Raciocínio', difficulty: 4,
    concept: 'Revisão: δ, δ*, aceitação, tabela',
    story: 'Desafio final do Mundo 2. Você precisa aplicar tudo que aprendeu: ler o diagrama, rastrear a string e concluir sobre a linguagem.',
    pedagogy: 'Prática de Recuperação: questão integradora que exige múltiplos conceitos do Mundo 2 sem material de apoio.',
    hint: 'Lembre-se: Q = {q0,q1,q2}, δ bem definido, F = estados aceitadores. Trace a string cuidadosamente.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: true  },
      { id: 'q1', label: 'q1', x: 430, y: 230, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 640, y: 230, isInitial: false, isAccept: false, isError: true },
    ],
    transitions: [
      { from: 'q0', to: 'q0', label: 'b' },
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q0', label: 'a' },
      { from: 'q1', to: 'q2', label: 'b' },
      { from: 'q2', to: 'q2', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'quiz',
      question: 'Este autômato aceita strings com número PAR de "a"s (incluindo zero). Qual das opções está CORRETA?',
      options: [
        '"bbabb" é aceita — tem 0 "a"s de forma alternada, mas... espera: conta "a"s: 1. Rejeitada.',
        '"aabb" é aceita — tem 2 "a"s (par), termina em q0 ∈ F',
        '"aab" é aceita — tem 2 "a"s mas termina em estado de erro',
        '"b" é rejeitada — não tem "a"s, mas q0 não é aceitador',
      ],
      answer: '"aabb" é aceita — tem 2 "a"s (par), termina em q0 ∈ F',
    },
  },
];

// ══════════════════════════════════════════════════════════════════
//  MUNDO 3 — CONSTRUÇÃO (mecânica: montagem de autômatos, 3 estágios)
//  Fases 21–23: mark-states | 24–27: add-transitions | 28–30: full-build
// ══════════════════════════════════════════════════════════════════

const W3: Level[] = [
  // ── Fase 21: mark-states 1 ───────────────────────────────────────
  {
    id: 21, world: 3, name: 'Defina o Início e o Fim (1)', difficulty: 2,
    concept: 'Marcar estado inicial e aceitador',
    story: 'O diagrama completo está aqui — todas as transições já foram definidas. Sua missão: marcar o estado inicial e o aceitador para que o autômato aceite strings que terminam com "b".',
    pedagogy: 'Estágio 1 da montagem: menor complexidade. O aluno foca em papéis dos estados sem se preocupar com transições.',
    hint: 'O último "b" deve levar a um estado aceitador. Qual estado pode ser esse?',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: false, isAccept: false },
      { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'b' },
      { from: 'q1', to: 'q0', label: 'a' },
      { from: 'q0', to: 'q0', label: 'a' },
      { from: 'q1', to: 'q1', label: 'b' },
    ],
    activity: {
      type: 'build-automaton',
      stage: 'mark-states',
      instruction: 'Marque o estado INICIAL e o estado ACEITADOR para que este autômato aceite strings que terminam com "b".',
      languageDescription: 'Strings sobre {a,b} que terminam com "b"',
      starter: {
        states: [
          { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: false, isAccept: false },
          { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: false },
        ],
        transitions: [
          { from: 'q0', to: 'q1', label: 'b' },
          { from: 'q1', to: 'q0', label: 'a' },
          { from: 'q0', to: 'q0', label: 'a' },
          { from: 'q1', to: 'q1', label: 'b' },
        ],
      },
      testAccept: ['b', 'ab', 'aab', 'bb'],
      testReject: ['a', 'ba', 'aba', ''],
    },
  },

  // ── Fase 22: mark-states 2 ───────────────────────────────────────
  {
    id: 22, world: 3, name: 'Defina o Início e o Fim (2)', difficulty: 2,
    concept: 'Marcar estados com múltiplos aceitadores',
    story: 'Agora o autômato tem 3 estados e DOIS aceitadores possíveis. Strings válidas: "a", "aa", "aaa" ... (qualquer número positivo de "a"s, sem "b").',
    pedagogy: 'Variação do mark-states com múltiplos aceitadores e 3 estados — aumenta a complexidade gradualmente.',
    hint: 'O estado de "nenhum a lido ainda" não deve ser aceitador. Todos os estados com pelo menos um "a" devem aceitar.',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: false, isAccept: false },
      { id: 'q1', label: 'q1', x: 420, y: 230, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 640, y: 230, isInitial: false, isAccept: false, isError: true },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'a' },
      { from: 'q1', to: 'q1', label: 'a' },
      { from: 'q0', to: 'q2', label: 'b' },
      { from: 'q1', to: 'q2', label: 'b' },
      { from: 'q2', to: 'q2', label: 'a' },
      { from: 'q2', to: 'q2', label: 'b' },
    ],
    activity: {
      type: 'build-automaton',
      stage: 'mark-states',
      instruction: 'Marque o estado INICIAL e todos os estados ACEITADORES para que o autômato reconheça strings formadas APENAS por "a"s (uma ou mais).',
      languageDescription: 'Strings sobre {a,b} formadas apenas por "a"s (a+)',
      starter: {
        states: [
          { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: false, isAccept: false },
          { id: 'q1', label: 'q1', x: 420, y: 230, isInitial: false, isAccept: false },
          { id: 'q2', label: 'q2', x: 640, y: 230, isInitial: false, isAccept: false },
        ],
        transitions: [
          { from: 'q0', to: 'q1', label: 'a' },
          { from: 'q1', to: 'q1', label: 'a' },
          { from: 'q0', to: 'q2', label: 'b' },
          { from: 'q1', to: 'q2', label: 'b' },
          { from: 'q2', to: 'q2', label: 'a' },
          { from: 'q2', to: 'q2', label: 'b' },
        ],
      },
      testAccept: ['a', 'aa', 'aaa'],
      testReject: ['', 'b', 'ab', 'ba'],
    },
  },

  // ── Fase 23: mark-states 3 (com quiz intercalado) ───────────────
  {
    id: 23, world: 3, name: 'Início e Fim: Binário', difficulty: 3,
    concept: 'AFD sobre Σ = {0,1}',
    story: 'Autômato binário! As transições já estão definidas, mas você deve escolher q0 como inicial e o único estado aceitador — strings que terminam com "1".',
    pedagogy: 'Mark-states final, conteúdo binário (novo alfabeto). Intercala com conceitos de Mundo 1 (identificação).',
    hint: 'Strings que terminam com 1: o estado aceitador é aquele alcançado após ler "1".',
    states: [
      { id: 'A', label: 'A', x: 180, y: 230, isInitial: false, isAccept: false },
      { id: 'B', label: 'B', x: 500, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [
      { from: 'A', to: 'B', label: '1' },
      { from: 'B', to: 'A', label: '0' },
      { from: 'A', to: 'A', label: '0' },
      { from: 'B', to: 'B', label: '1' },
    ],
    activity: {
      type: 'build-automaton',
      stage: 'mark-states',
      instruction: 'Configure o autômato para aceitar strings binárias que terminam com "1".',
      languageDescription: 'Strings sobre {0,1} que terminam com "1"',
      starter: {
        states: [
          { id: 'A', label: 'A', x: 180, y: 230, isInitial: false, isAccept: false },
          { id: 'B', label: 'B', x: 500, y: 230, isInitial: false, isAccept: false },
        ],
        transitions: [
          { from: 'A', to: 'B', label: '1' },
          { from: 'B', to: 'A', label: '0' },
          { from: 'A', to: 'A', label: '0' },
          { from: 'B', to: 'B', label: '1' },
        ],
      },
      testAccept: ['1', '01', '11', '001'],
      testReject: ['0', '10', '100', ''],
    },
  },

  // ── Fase 24: add-transitions 1 ───────────────────────────────────
  {
    id: 24, world: 3, name: 'Adicione Transições (1)', difficulty: 3,
    concept: 'Construir δ a partir de estados e linguagem',
    story: 'Agora os estados ESTÃO definidos (inicial e aceitador marcados), mas as transições estão faltando. Você tem 4 transições disponíveis — use com sabedoria!',
    pedagogy: 'Estágio 2 da montagem: o aluno precisa raciocinar sobre QUAIS transições criar. Limite de transições força planejamento.',
    hint: 'Com Σ = {a,b} e 2 estados, um AFD completo precisa de exatamente 4 transições (2 estados × 2 símbolos). Use todas!',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'add-transitions',
      instruction: 'Adicione as transições para que o autômato aceite strings que contêm pelo menos um "a". Você tem máximo 4 transições.',
      languageDescription: 'Strings sobre {a,b} que contêm pelo menos um "a"',
      starter: {
        states: [
          { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
          { id: 'q1', label: 'q1', x: 500, y: 230, isInitial: false, isAccept: true  },
        ],
        transitions: [],
      },
      labelPool: ['a', 'b'],
      maxTransitions: 4,
      testAccept: ['a', 'ab', 'ba', 'aab'],
      testReject: ['', 'b', 'bb', 'bbb'],
    },
  },

  // ── Fase 25: add-transitions 2 ───────────────────────────────────
  {
    id: 25, world: 3, name: 'Adicione Transições (2)', difficulty: 3,
    concept: 'AFD: strings terminando com "ab"',
    story: 'Strings que terminam com "ab" precisam de um autômato que "lembre" o sufixo. Você tem 3 estados e 6 transições disponíveis.',
    pedagogy: 'Add-transitions com padrão de sufixo: exige raciocínio sobre o que cada estado "representa".',
    hint: 'q0 = nada útil ainda; q1 = acabei de ler "a"; q2 = acabei de ler "ab". Estados representam sufixo reconhecido!',
    states: [
      { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
      { id: 'q1', label: 'q1', x: 420, y: 230, isInitial: false, isAccept: false },
      { id: 'q2', label: 'q2', x: 640, y: 230, isInitial: false, isAccept: true  },
    ],
    transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'add-transitions',
      instruction: 'Adicione as transições para que o autômato aceite strings que TERMINAM com "ab". Máximo 6 transições.',
      languageDescription: 'Strings sobre {a,b} que terminam com "ab"',
      starter: {
        states: [
          { id: 'q0', label: 'q0', x: 180, y: 230, isInitial: true,  isAccept: false },
          { id: 'q1', label: 'q1', x: 420, y: 230, isInitial: false, isAccept: false },
          { id: 'q2', label: 'q2', x: 640, y: 230, isInitial: false, isAccept: true  },
        ],
        transitions: [],
      },
      labelPool: ['a', 'b'],
      maxTransitions: 6,
      testAccept: ['ab', 'aab', 'bab', 'aaab'],
      testReject: ['', 'a', 'b', 'ba', 'abb'],
    },
  },

  // ── Fase 26: add-transitions 3 ───────────────────────────────────
  {
    id: 26, world: 3, name: 'Adicione Transições (3)', difficulty: 4,
    concept: 'AFD: número par de 0s (binário)',
    story: 'Um clássico! Strings binárias com número par de zeros. Você tem 2 estados e 4 transições. O estado representa a paridade dos zeros lidos.',
    pedagogy: 'Add-transitions com alfabeto binário e semântica de paridade: exige entender o que cada estado "representa".',
    hint: 'q0 = par de zeros lidos (inclui zero zeros → q0 é aceitador). Ler 0 troca a paridade; ler 1 mantém.',
    states: [
      { id: 'par',  label: 'Par',  x: 200, y: 230, isInitial: true,  isAccept: true  },
      { id: 'imp',  label: 'Ímpar', x: 500, y: 230, isInitial: false, isAccept: false },
    ],
    transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'add-transitions',
      instruction: 'Adicione as transições para aceitar strings binárias com número PAR de 0s (incluindo nenhum 0). Máximo 4 transições.',
      languageDescription: 'Strings sobre {0,1} com número par de 0s (0, 2, 4, ...)',
      starter: {
        states: [
          { id: 'par',  label: 'Par',  x: 200, y: 230, isInitial: true,  isAccept: true  },
          { id: 'imp',  label: 'Ímpar', x: 500, y: 230, isInitial: false, isAccept: false },
        ],
        transitions: [],
      },
      labelPool: ['0', '1'],
      maxTransitions: 4,
      testAccept: ['', '00', '11', '1001', '0011'],
      testReject: ['0', '1110', '010', '001'],
    },
  },

  // ── Fase 27: add-transitions 4 (quiz intercalado) ────────────────
  {
    id: 27, world: 3, name: 'Antes de Construir', difficulty: 4,
    concept: 'Equivalência AFD ↔ AFND (quiz + add-transitions)',
    story: 'Antes do desafio final de construção livre, uma questão conceitual importante: a diferença entre AFD e AFND.',
    pedagogy: 'Quiz intercalado de revisão (Mundos 1+2) antes do estágio mais difícil do Mundo 3, ativando conhecimento relevante.',
    hint: 'AFD: cada (estado, símbolo) → exatamente 1 destino. AFND: pode ter 0, 1 ou mais destinos.',
    states: [], transitions: [],
    activity: {
      type: 'quiz',
      question: 'Qual é a principal diferença entre um AFD e um AFND?',
      options: [
        'No AFD, cada par (estado, símbolo) tem exatamente uma transição; no AFND pode ter zero, uma ou mais',
        'AFD aceita mais linguagens do que AFND',
        'AFND não pode ter estados aceitadores',
        'AFD não tem estado inicial; AFND tem vários',
      ],
      answer: 'No AFD, cada par (estado, símbolo) tem exatamente uma transição; no AFND pode ter zero, uma ou mais',
    },
  },

  // ── Fase 28: full-build 1 ────────────────────────────────────────
  {
    id: 28, world: 3, name: 'Construção Livre (1)', difficulty: 4,
    concept: 'Construir AFD completo: strings que comecem com "a"',
    story: 'Você tem estados em branco e rótulos à disposição. Monte do zero um autômato que aceite todas as strings que COMEÇAM com "a".',
    pedagogy: 'Estágio 3, fase 1: linguagem simples para introduzir a construção livre. Casos de teste ao vivo guiam o aluno.',
    hint: 'Você precisa de 3 estados: q0 (inicial), q1 (leu "a" como 1º símbolo — aceitar!), q2 (leu "b" como 1º — rejeitar tudo).',
    states: [], transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'full-build',
      instruction: 'Construa um AFD que aceite strings sobre {a,b} que COMEÇAM com "a". Posicione os estados, defina inicial e aceitadores, e adicione as transições.',
      languageDescription: 'Strings sobre {a,b} que começam com "a"',
      starter: { states: [], transitions: [] },
      labelPool: ['a', 'b'],
      maxTransitions: 8,
      availableStates: 3,
      testAccept: ['a', 'ab', 'aa', 'aba'],
      testReject: ['', 'b', 'ba', 'baa'],
    },
  },

  // ── Fase 29: full-build 2 ────────────────────────────────────────
  {
    id: 29, world: 3, name: 'Construção Livre (2)', difficulty: 5,
    concept: 'Construir AFD: strings com "ab" como substring',
    story: 'Desafio avançado: construa um autômato que aceite strings que contêm "ab" em qualquer posição. Este padrão exige 3 estados bem planejados.',
    pedagogy: 'Full-build com padrão de substring: exige raciocínio mais profundo sobre o que cada estado deve "memorizar".',
    hint: 'q0 = não vi "a" útil; q1 = vi "a" e estou esperando "b"; q2 (aceitador) = já vi "ab". De q2, tudo permanece em q2.',
    states: [], transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'full-build',
      instruction: 'Construa um AFD que aceite todas as strings sobre {a,b} que contêm a substring "ab".',
      languageDescription: 'Strings sobre {a,b} que contêm "ab" como substring',
      starter: { states: [], transitions: [] },
      labelPool: ['a', 'b'],
      maxTransitions: 8,
      availableStates: 3,
      testAccept: ['ab', 'aab', 'abb', 'bab', 'aabb'],
      testReject: ['', 'a', 'b', 'ba', 'bba', 'aa'],
    },
  },

  // ── Fase 30: full-build FINAL ─────────────────────────────────────
  {
    id: 30, world: 3, name: '🏆 Grande Desafio Final', difficulty: 5,
    concept: 'Síntese: construir AFD completo para linguagem real',
    story: 'O desafio definitivo! Construa um autômato que aceite strings binárias representando números divisíveis por 2 (terminam com "0"). Você está no controle total!',
    pedagogy: 'Síntese máxima: o aluno aplica todos os conceitos dos 3 mundos para construir um AFD completo e testá-lo contra casos de teste reais.',
    hint: 'Número binário divisível por 2 = termina com 0. Você precisa de: q0 (inicial), q1 (último símbolo foi 0 — aceitar!), q2 (último símbolo foi 1).',
    states: [], transitions: [],
    activity: {
      type: 'build-automaton',
      stage: 'full-build',
      instruction: 'Construa um AFD que aceite strings binárias que representam números divisíveis por 2 (ou seja, terminam em "0"). Exclua a string vazia.',
      languageDescription: 'Strings sobre {0,1} que terminam com "0" (números binários pares)',
      starter: { states: [], transitions: [] },
      labelPool: ['0', '1'],
      maxTransitions: 8,
      availableStates: 4,
      testAccept: ['0', '10', '100', '110', '1010'],
      testReject: ['', '1', '11', '101', '111'],
    },
  },
];

export const ALL_LEVELS: Level[] = [...W1, ...W2, ...W3];

export const getLevelsByWorld = (worldId: number): Level[] =>
  ALL_LEVELS.filter(l => l.world === worldId);

export const getLevel = (id: number): Level | undefined =>
  ALL_LEVELS.find(l => l.id === id);
