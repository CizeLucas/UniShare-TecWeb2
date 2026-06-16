Para alcançar uma independência real e evitar que um desenvolvedor dependa do código do outro para avançar, a estratégia clássica é **isolar as camadas por contratos de dados**.

No ecossistema NestJS/NextJS, o segredo para o paralelismo total é fazer um **Setup Inicial Unificado** do banco de dados utilizando Prisma com identificadores **UUID v4**. Uma vez que o banco de dados está modelado, os desenvolvedores de backend não precisam esperar uns pelos outros, pois todos escrevem regras de negócio mirando nas mesmas tabelas já existentes. No frontend, o uso de rotas isoladas no NextJS garante conflito zero de código.

Aqui está o planejamento de sprint balanceado e focado em autonomia máxima para a equipe de 5 pessoas:

---

## 🛠️ Passo Zero: Setup Inicial (Bloqueio Zero)

**Quem faz:** Um desenvolvedor backend (ou a equipe junta em uma chamada de 1 hora) faz o commit inicial.

1. **Frameworks:** Inicializar os repositórios NestJS (Back) e NextJS (Front).
2. **Prisma & PostgreSQL:** Configurar o arquivo `schema.prisma` com todas as tabelas mapeadas e os IDs configurados estritamente como **UUID v4**:

```prisma
id String @id @default(uuid()) // Garante UUID v4 nativo

```

3. **Contrato de API:** O time do frontend cria um arquivo de tipos locais (`types.ts`) espelhando as tabelas do Prisma. A partir daqui, o Frontend pode usar dados mockados (_fakes_) baseados nesses tipos, e o Backend pode codificar suas rotas em paralelo.

---

## 🖥️ Backend (3 Desenvolvedores)

_Com o banco de dados já criado no passo zero, cada desenvolvedor cuidará de um módulo lógico isolado do NestJS._

### 👤 Dev BE 01: Módulo de Acesso e Identidade (Auth & Users)

- **Escopo:** Cuidar de quem entra no sistema e garantir as credenciais básicas.
- **Tarefas:**
- Implementar o cadastro de usuários e login com autenticação via JWT (`AuthModule`).
- Criar o endpoint de atualização de perfil para inserção/validação da Chave PIX.
- Criar o endpoint de criação de Workspace e geração do código único (`STCH-XXXX`).
- Criar a rota de adesão ao Workspace via código.

### 📊 Dev BE 02: Módulo do Livro de Caixa (Expenses)

- **Escopo:** Cuidar do registro bruto das despesas e suas regras matemáticas de divisão.
- **Tarefas:**
- Criar o CRUD completo de Despesas (Lançar, listar, editar e deletar).
- Implementar a trava de segurança: Apenas o `creator_id` pode alterar/deletar a despesa.
- **Matemática de Divisão Igualitária:** Lógica que divide o valor pelo subconjunto de membros e joga os centavos restantes na cota do pagador original.
- **Matemática de Divisão Percentual:** Validador que barra o salvamento se a soma das fatias não der 100.00%.
- Adicionar a trava que impede edição caso a despesa já tenha recebido algum pagamento (`valor_pago > 0`).

### 💸 Dev BE 03: Módulo de Liquidação e Governança (Settlements & States)

- **Escopo:** Cuidar do fluxo de dinheiro saindo/entrando e das validações de estado do ambiente.
- **Tarefas:**
- Criar o CRUD de Intenções de Pagamento (`Settlements`).
- **O Algoritmo FIFO (Amortização):** Desenvolver a lógica que roda quando um pagamento é confirmado, varrendo as participações pendentes mais antigas daquele devedor e abatendo os valores.
- Criar as rotas de Aceite e Rejeição de PIX pelo recebedor.
- **Lógica de Saída do Bloco:** Rota de validação que checa se o saldo do usuário é estritamente zero para permitir que ele saia do Workspace.
- **Lógica de Arquivamento:** Rota que checa se todas as contas do Workspace estão pagas para permitir o congelamento do ambiente.

---

## 🎨 Frontend (2 Desenvolvedores)

_Aproveitando o App Router do NextJS, a divisão é feita por pastas de rotas totalmente isoladas. Conflito zero no Git._

### 🖼️ Dev FE 01: O Portal e o Gerenciamento (Rotas de Entrada)

- **Escopo:** Telas de fora do ambiente e a casca estrutural do sistema.
- **Tarefas (Pastas do NextJS: `/auth`, `/profile`, `/workspaces`):**
- Telas de Login e Cadastro de Usuário (Consumindo o JWT).
- Tela de Perfil do Usuário (Gerenciamento e input da Chave PIX).
- Tela de Boas-vindas dos Workspaces (Onde o usuário escolhe entre Criar um novo ambiente ou Digitar o código `STCH-XXXX` para entrar).
- Criação do Layout Global do App (Sidebar de navegação, cabeçalho com nome do usuário e seletor de ambientes).

### 🧙‍♂️ Dev FE 02: A Vivência do Workspace (Rotas Internas do Ambiente)

- **Escopo:** Toda a interação financeira e o dia a dia do grupo dentro de um ambiente específico.
- **Tarefas (Pastas do NextJS: `/workspaces/[id]`):**
- **Dashboard Principal:** Card central de saldo ("Você deve" / "Você tem a receber") e o feed de atividades recentes com filtros para as tags `[ESSENCIAL]` e `[LAZER]`.
- **Formulário Dinâmico de Despesa:** Tela de inserção de custos, com o checklist para selecionar o subconjunto de membros e o alternador para divisão percentual (com os sliders/inputs de %).
- **Painel de Acertos (Settlements):** Modal que exibe o PIX Copia e Cola do amigo para o pagamento e a aba de notificações onde o usuário aprova ou rejeita os PIXs que disseram ter enviado para ele.

---

## ⚖️ Por que esse modelo é balanceado e independente?

- **No Backend:** Dev 3 precisa interagir com a tabela de `Expense_Participations` (feita por Dev 2). Como o **Passo Zero** já criou essa tabela no Prisma, o Dev 3 pode escrever suas consultas e queries de amortização imediatamente, sem precisar que as rotas de criação de despesa do Dev 2 estejam prontas.
- **No Frontend:** Dev 1 trabalha nas páginas de login e configuração inicial. Dev 2 trabalha estritamente dentro das páginas dinâmicas dos ambientes (`[id]`). Eles não editam os mesmos arquivos em nenhum momento da sprint.
- **Segurança Matemática:** O uso de UUID v4 nativo no banco mitiga problemas de adivinhação de rotas ou conflitos de IDs sequenciais durante os testes paralelos da equipe.
