import type { Flashcard } from '@/types';

export const FLASHCARDS: Flashcard[] = [
  // ─── Mundo 1 — Fundamentos ───────────────────────────────────────────────
  { id: 'fc-01', world: 1, term: 'Autômato Finito (AF)', definition: 'Modelo matemático de computação com um número finito de estados, que processa símbolos de entrada e decide se pertence ou não a uma linguagem.', example: 'Um semáforo com estados: vermelho, amarelo, verde.' },
  { id: 'fc-02', world: 1, term: 'Estado', definition: 'Configuração instantânea de um sistema em um dado momento. Um AF está sempre em exatamente um estado por vez.', example: 'q0, q1, q2 são nomes comuns de estados.' },
  { id: 'fc-03', world: 1, term: 'Estado Inicial', definition: 'O estado em que o autômato começa o processamento. Representado visualmente por uma seta vinda de "fora" apontando para ele.', example: 'Todo AF tem exatamente um estado inicial.' },
  { id: 'fc-04', world: 1, term: 'Estado de Aceitação', definition: 'Estado em que o autômato termina e indica que a string de entrada foi ACEITA pela linguagem. Representado por círculo duplo.', example: 'Se δ*(q0, "ab") = q2 e q2 ∈ F, então "ab" ∈ L(M).' },
  { id: 'fc-05', world: 1, term: 'Estado de Erro / Rejeição', definition: 'Estado em que o autômato indica que a string de entrada foi REJEITADA. Também pode ocorrer quando não há transição definida para o símbolo atual.', example: 'Representado em vermelho nos diagramas.' },
  { id: 'fc-06', world: 1, term: 'Alfabeto (Σ)', definition: 'Conjunto finito e não-vazio de símbolos que o autômato pode ler. Toda string de entrada é composta de símbolos de Σ.', example: 'Σ = {0, 1} para autômatos binários; Σ = {a, b} para linguagens simples.' },
  { id: 'fc-07', world: 1, term: 'String (cadeia de caracteres)', definition: 'Sequência finita de símbolos do alfabeto. O autômato lê uma string símbolo por símbolo da esquerda para a direita.', example: '"aab", "01101", "" (string vazia = ε).' },
  { id: 'fc-08', world: 1, term: 'String vazia (ε)', definition: 'String com zero símbolos. Um AF pode aceitar ε se o estado inicial for também um estado de aceitação.', example: 'ε ∈ L(M) ↔ o estado inicial é estado de aceitação.' },
  { id: 'fc-09', world: 1, term: 'Conjunto de estados (Q)', definition: 'Conjunto finito com todos os estados possíveis do autômato. É um dos 5 componentes formais de um AF.', example: 'Q = {q0, q1, q2} — autômato com 3 estados.' },
  { id: 'fc-10', world: 1, term: '5 Componentes Formais de um AF', definition: 'M = (Q, Σ, δ, q0, F): Q = estados; Σ = alfabeto; δ = função de transição; q0 = estado inicial; F = estados de aceitação.', example: 'Esses 5 elementos definem completamente um autômato.' },

  // ─── Mundo 2 — Raciocínio ────────────────────────────────────────────────
  { id: 'fc-11', world: 2, term: 'Função de Transição (δ)', definition: 'Função δ: Q × Σ → Q que define para qual estado o autômato vai a partir do estado atual ao ler um símbolo.', example: 'δ(q0, a) = q1 significa: "no estado q0, ao ler a, vá para q1".' },
  { id: 'fc-12', world: 2, term: 'Notação δ(q, a) = q\'', definition: 'Leitura: "no estado q, ao ler o símbolo a, o autômato vai para o estado q\'". δ é determinística: cada (estado, símbolo) tem no máximo um destino.', example: 'δ(q0, 0) = q1; δ(q0, 1) = q0.' },
  { id: 'fc-13', world: 2, term: 'Transição (aresta)', definition: 'Seta no diagrama que conecta um estado de origem a um estado de destino, rotulada com o símbolo que a dispara.', example: 'q0 →[a]→ q1 significa δ(q0, a) = q1.' },
  { id: 'fc-14', world: 2, term: 'Auto-transição (self-loop)', definition: 'Transição que leva o autômato de um estado de volta para o mesmo estado. Representada por uma seta em arco sobre o estado.', example: 'δ(q1, b) = q1: ao ler b em q1, permanece em q1.' },
  { id: 'fc-15', world: 2, term: 'Função de Transição Estendida (δ*)', definition: 'Extensão de δ para strings inteiras (não só símbolos). δ*(q, ε) = q; δ*(q, wa) = δ(δ*(q, w), a).', example: 'δ*(q0, "ab") = δ(δ(q0, a), b) — aplica cada símbolo em sequência.' },
  { id: 'fc-16', world: 2, term: 'Processamento de uma String', definition: 'Passos: (1) partir do estado inicial, (2) ler cada símbolo da esquerda para a direita, (3) seguir a transição correspondente, (4) verificar se estado final ∈ F.', example: '"ab" em M: q0 →[a]→ q1 →[b]→ q2. Se q2 ∈ F, aceita.' },
  { id: 'fc-17', world: 2, term: 'Aceitação de String', definition: 'Uma string w é aceita por M se δ*(q0, w) ∈ F — ou seja, o autômato termina em um estado de aceitação após ler w completo.', example: '"01" aceita se, após processar 0 e depois 1, o estado final é de aceitação.' },
  { id: 'fc-18', world: 2, term: 'Rejeição de String', definition: 'Uma string w é rejeitada se δ*(q0, w) ∉ F — o estado final não é de aceitação — ou se alguma transição não está definida.', example: '"00" rejeita se terminar em q1 e q1 ∉ F.' },
  { id: 'fc-19', world: 2, term: 'AFD (Autômato Finito Determinístico)', definition: 'AF em que para cada par (estado, símbolo) existe exatamente uma transição definida. Nenhuma ambiguidade — o caminho é único e determinado.', example: 'Todo símbolo no estado atual leva a exatamente um próximo estado.' },
  { id: 'fc-20', world: 2, term: 'Tabela de Transição', definition: 'Representação da função δ em formato de tabela: linhas = estados, colunas = símbolos do alfabeto, células = estado de destino.', example: '     a   b\nq0 | q1  q0\nq1 | q1  q2' },

  // ─── Mundo 3 — Construção ────────────────────────────────────────────────
  { id: 'fc-21', world: 3, term: 'Linguagem de um Autômato L(M)', definition: 'Conjunto de todas as strings aceitas pelo autômato M. L(M) = { w ∈ Σ* | δ*(q0, w) ∈ F }.', example: 'Se M aceita todas as strings com número par de "a"s, L(M) = linguagem desse padrão.' },
  { id: 'fc-22', world: 3, term: 'Linguagem Regular', definition: 'Linguagem que pode ser reconhecida por um AFD. Toda linguagem descrita por expressão regular é regular, e vice-versa.', example: 'Strings que terminam em "ab", strings com número par de 0s, etc.' },
  { id: 'fc-23', world: 3, term: 'Linguagem Vazia (∅)', definition: 'Linguagem que não contém nenhuma string. Um AF aceita ∅ se não existe nenhum estado de aceitação alcançável a partir do estado inicial.', example: 'L(M) = ∅ se F = ∅ ou nenhum estado de aceitação é alcançável.' },
  { id: 'fc-24', world: 3, term: 'Fecho de Kleene (Σ*)', definition: 'Conjunto de todas as strings possíveis sobre o alfabeto Σ, incluindo a string vazia ε. Σ* é o domínio das linguagens formais.', example: 'Se Σ = {a, b}, então Σ* = {ε, a, b, aa, ab, ba, bb, aaa, ...}.' },
  { id: 'fc-25', world: 3, term: 'Expressão Regular (ER)', definition: 'Notação compacta para descrever linguagens regulares. Usa ∪ (união), · (concatenação) e * (fecho).', example: '(a∪b)*ab = strings que terminam com "ab".' },
  { id: 'fc-26', world: 3, term: 'AFND (Autômato Finito Não-Determinístico)', definition: 'AF em que um par (estado, símbolo) pode ter zero, uma ou mais transições definidas. Todo AFND tem um AFD equivalente.', example: 'O AFND pode "tentar" múltiplos caminhos simultaneamente.' },
  { id: 'fc-27', world: 3, term: 'Equivalência AFD ↔ AFND', definition: 'Para toda linguagem aceita por um AFND, existe um AFD que aceita exatamente a mesma linguagem (construção de subconjuntos).', example: 'AFND com n estados pode gerar AFD com até 2ⁿ estados.' },
  { id: 'fc-28', world: 3, term: 'Minimização de AFD', definition: 'Processo de reduzir um AFD ao menor número de estados possível, combinando estados equivalentes (indistinguíveis).', example: 'O AFD mínimo é único para cada linguagem regular.' },
  { id: 'fc-29', world: 3, term: 'Complemento de uma Linguagem', definition: 'L̄ = Σ* \\ L: o complemento contém todas as strings que L NÃO contém. Para AFD, basta inverter estados de aceitação e não-aceitação.', example: 'Se L = strings com "aa", L̄ = strings sem "aa".' },
  { id: 'fc-30', world: 3, term: 'Diagrama de Transição', definition: 'Grafo dirigido que representa um AF: nós = estados, arestas rotuladas = transições. É a forma visual padrão de descrever autômatos.', example: 'Estados especiais: inicial (seta entrante), aceitação (círculo duplo).' },
];

export const getFlashcardsByWorld = (worldId: number) =>
  FLASHCARDS.filter(f => f.world === worldId);
