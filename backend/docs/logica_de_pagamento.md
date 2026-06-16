# Esquema de Banco de Dados: Controle de Amortização (STITCH)

O banco de dados recomendado é o **PostgreSQL** (ou qualquer banco relacional equivalente), utilizando chaves primárias do tipo `UUID` ou `BIGSERIAL` (IDs numéricos auto-incrementais).

## 1. DDL / Representação das Tabelas (Esquema Logicial)

### `Users`

Armazena as informações de conta e dados de faturamento dos estudantes.

- `id` (Primary Key)
- `nome` (VARCHAR)
- `email` (VARCHAR, Único)
- `senha_hash` (VARCHAR)
- `pix_chave` (VARCHAR)
- `pix_tipo` (ENUM: 'CPF', 'EMAIL', 'TELEFONE', 'ALEATORIA')

### `ambientes`

Ambientes isolados onde as despesas acontecem.

- `id` (Primary Key)
- `nome` (VARCHAR)
- `tipo` (ENUM: 'RESIDENCIA', 'ATIVIDADE')

### `User_ambientes`

Tabela pivô que vincula quais usuários pertencem a quais ambientes.

- `user_id` (Foreign Key -> Users.id)
- `ambientes_id` (Foreign Key -> ambientes.id)
- _Chave Primária Composta:_ (`user_id`, `ambientes_id`)

### `Expenses`

O registro bruto do custo que foi pago por alguém. **Observaçao: Depois de registrado, o gasto NÃO pode ser atualizado.**

- `id` (Primary Key)
- `ambientes_id` (Foreign Key -> ambientes.id)
- `creator_id` (Foreign Key -> Users.id) — _Quem cadastrou_
- `pagador_id` (Foreign Key -> Users.id) — _Quem efetivamente tirou o dinheiro do bolso_
- `titulo` (VARCHAR)
- `valor_total` (DECIMAL 10,2)
- `tag` (ENUM: 'ESSENCIAL', 'LAZER')
- `data_criacao` (TIMESTAMP)

### `Expense_Participations`

A fatia de responsabilidade de cada usuário sobre uma despesa. **Aqui reside o controle de pagamentos parciais.**

- `id` (Primary Key)
- `expense_id` (Foreign Key -> Expenses.id)
- `user_id` (Foreign Key -> Users.id) — _O devedor desta fatia_
- `porcentagem` (DECIMAL 5,2) — _A cota dele (ex: 25.00)_
- `valor_calculado` (DECIMAL 10,2) — _O valor original da dívida (ex: R$ 50,00)_
- `valor_pago` (DECIMAL 10,2, Default: 0.00) — _Quanto o usuário já amortizou desta dívida_
- `status` (ENUM: 'PENDENTE', 'PAGO', 'EM*ANALISE') — \_Calculado com base no valor_pago*
- `pago_em` (TIMESTAMP, Nullable) — _Data em que o status mudou definitivamente para 'PAGO'_

### `Settlements` (Nova Tabela)

O registro das transferências PIX de "acerto de contas" realizadas entre os usuários.

- `id` (Primary Key)
- `ambientes_id` (Foreign Key -> ambientes.id)
- `pagador_id` (Foreign Key -> Users.id) — _Quem enviou o PIX (Ex: Usuário A)_
- `recebedor_id` (Foreign Key -> Users.id) — _Quem recebeu o PIX (Ex: Usuário B)_
- `valor_transferido` (DECIMAL 10,2) — _O montante do PIX (Ex: R$ 70,00)_
- `status` (ENUM: 'AGUARDANDO_CONFIRMACAO', 'CONFIRMADO', 'REJEITADO')
- `data_envio` (TIMESTAMP) — _Quando o pagador avisou no app que transferiu_
- `data_validacao` (TIMESTAMP, Nullable) — _Quando o recebedor confirmou no app_

---

## 📑 2. Dicionário e Regras de Campos Críticos

### Regra de Ouro do Saldo Devedor

Para descobrir quanto o `Usuário A` deve para o `Usuário B` dentro de um ambientes antes de fazer um PIX, o backend não precisa rodar cálculos complexos. Basta executar um comando básico no banco buscando o saldo em aberto:

> **Fórmula:** `Dívida = valor_calculated - valor_pago` onde o pagador da despesa original é o `Usuário B` e o participante devedor é o `Usuário A`.

### O Ciclo de Vida do Status em `Expense_Participations`

- **`PENDENTE`:** Quando `valor_pago` é igual a `0.00` ou menor que `valor_calculado`.
- **`PAGO`:** Quando `valor_pago` torna-se igual a `valor_calculado`. O campo `pago_em` é carimbado com o horário atual.

---

## ⚙️ 3. Lógica do Backend: O Algoritmo de Amortização FIFO (First In, First Out)

Quando o `Usuário B` clica em **"Confirmar"** na tabela `Settlements`, o backend deve rodar uma transação de banco de dados (DB Transaction) executando os seguintes passos:

1. Mudar o status do registro em `Settlements` para `'CONFIRMADO'`.
2. Definir uma variável local `saldo_disponivel = Settlements.valor_transferido`.
3. Buscar todas as linhas de `Expense_Participations` onde o devedor é o `Usuário A`, o dono da despesa é o `Usuário B` e o `status != 'PAGO'`, ordenando da **`data_criacao` mais antiga para a mais recente (FIFO)**.
4. Para cada dívida encontrada (num laço de repetição):

- Calcular o saldo restante daquela dívida: `sub_divida = valor_calculado - valor_pago`.
- Se `saldo_disponivel >= sub_divida`:
- A dívida foi quitada por completo.
- `valor_pago = valor_calculado`.
- `status = 'PAGO'`.
- `pago_em = CURRENT_TIMESTAMP`.
- Subtrair do saldo: `saldo_disponivel = saldo_disponivel - sub_divida`.

- Se `saldo_disponivel < sub_divida`:
- O dinheiro acabou, a dívida foi apenas parcialmente amortizada.
- `valor_pago = valor_pago + saldo_disponivel`.
- `status = 'PENDENTE'` (continua aberto, mas devendo menos).
- `saldo_disponivel = 0`.

- Se `saldo_disponivel == 0`, o laço é quebrado (Break).
