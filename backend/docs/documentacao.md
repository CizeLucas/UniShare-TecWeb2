# 📑 REGRAS_DE_NEGOCIO.md - Fluxos Operacionais

Este documento mapeia o comportamento esperado do sistema para cada fluxo de interação do usuário, servindo como guia de implementação para as regras de validação no frontend e no backend.

---

## 1. Fluxo de Cadastro e Perfil (Onboarding)

O objetivo deste fluxo é garantir que todo usuário esteja apto a pagar e receber transações dentro da plataforma sem fricção.

- **Unicidade de Conta:** O sistema não permite dois cadastros com o mesmo e-mail.
- **Bloqueio de Recebimento:** O usuário pode concluir o cadastro sem informar uma Chave PIX. No entanto, o sistema aplicará uma trava: **esse usuário não poderá ser selecionado como "Pagador Original"** de nenhuma despesa até que uma chave PIX válida seja salva em seu perfil.
- **Validação de Chave:** Ao inserir a chave PIX, o sistema valida o formato básico com base no tipo selecionado (ex: formato de e-mail válido, CPF com 11 dígitos, telefone com DDD).

---

## 2. Fluxo de Gestão de Ambientes (ambientes)

Regras para criação, adesão e desligamento de membros em repúblicas ou grupos de projeto.

### Criação e Acesso

- **Código Único:** Ao criar um ambiente, o backend gera um código identificador (id) aleatório exclusivo (UUID).
- **Entrada no Ambiente:** Novos usuários entram no ambiente digitando esse código. Não há aprovação manual do administrador; digitou o código correto, o usuário está dentro.

### Vínculo e Desligamento (Sair do Ambiente)

Uma das regras mais críticas para evitar fraudes ou "calotes" acadêmicos:

- **A Trava de Saída:** Um usuário **só pode sair** voluntariamente de um ambiente se o seu saldo devedor atual com todos os outros membros daquele ambiente for **igual a zero** (ou seja, todas as suas participações em despesas estarem com o status `PAGO`).
- **Histórico Preservado:** Se um usuário for removido ou conseguir sair do ambiente com contas zeradas, os registros das despesas passadas que ele pagou ou participou continuam existindo no histórico do grupo para consulta dos demais, mas seu ID fica desvinculado de futuras cobranças.

---

## 3. Fluxo de Lançamento e Edição de Despesas

Regras de controle sobre como os custos são inseridos, divididos e modificados.

### Validação da Divisão (Matemática de Centavos)

- **Arredondamento na Divisão Igualitária:** Quando o valor total dividido pelo número de envolvidos gerar dízimas ou frações de centavos (ex: R$ 10,00 divididos por 3 pessoas = R$ 3,3333...), o backend calcula o valor base truncado (R$ 3,33) para os participantes e **adiciona a diferença de centavos (R$ 0,02) diretamente na cota do criador/pagador** da despesa para garantir que a soma das frações bata exatamente com o `valor_total`.
- **Validação da Divisão Percentual:** O botão "Salvar" permanece bloqueado no frontend enquanto a soma dos campos percentuais de todos os envolvidos selecionados não for exatamente **100.00%**.

### Alteração e Exclusão de despesas

- **Regra de Organização:** Uma despesa **não pode ser editada ou excluída** por nenhum usuário após sua criação.

---

## 4. Fluxo de Inicialização de Acerto (Settlement Initiation)

O comportamento do sistema quando um estudante decide pagar o que deve a outro.

```
[Usuário A: Envia PIX] ──► [Informa no App (Status: Aguardando)] ──► [Usuário B: Valida] ──► [Algoritmo FIFO Roda]

```

- **Geração da Cobrança:** Na tela de acerto, o Usuário A seleciona o Usuário B. O app busca todas as linhas `PENDENTES` onde A deve para B e exibe o valor total consolidado, junto com a chave PIX de B.
- **Registro da Intenção:** Ao realizar o PIX em seu aplicativo bancário, o Usuário A clica em "Confirmei o Envio" dentro do sistema. Neste momento, o registro nasce na tabela `Settlements` com o status `AGUARDANDO_CONFIRMACAO`.
- **Notificação e Bloqueio de Duplicidade:** O Usuário B vai ver uma notificação dentro do sistema avisando sobre essa transação. Enquanto esse acerto específico estiver pendente de validação, o Usuário A não pode abrir outra intenção de pagamento para o Usuário B, evitando envios duplicados acidentais no sistema.

---

## 5. Fluxo de Contestação (Rejeição de Acerto)

Caso o dinheiro não tenha caído na conta ou o valor informado esteja errado.

- **Ação do Recebedor:** Caso o Usuário B verifique seu extrato bancário e note que o dinheiro não caiu ou o valor está incorreto, ele clica em **"Rejeitar"**.
- **Consequência no Sistema:**
- O status da tabela `Settlements` muda para `REJEITADO`.
- O Usuário A será notificado com o aviso: _"Seu pagamento para [Nome] não foi reconhecido. Verifique o comprovante."_
- **Nenhum valor é abatido** das despesas. O saldo devedor permanece intacto, e o canal de pagamento entre A e B é reaberto para uma nova tentativa.
