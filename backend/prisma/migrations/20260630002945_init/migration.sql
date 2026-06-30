-- CreateEnum
CREATE TYPE "PixTipo" AS ENUM ('CPF', 'EMAIL', 'TELEFONE', 'ALEATORIA');

-- CreateEnum
CREATE TYPE "AmbienteTipo" AS ENUM ('RESIDENCIA', 'ATIVIDADE');

-- CreateEnum
CREATE TYPE "ExpenseTag" AS ENUM ('ESSENCIAL', 'LAZER');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('PENDENTE', 'PAGO', 'EM_ANALISE');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('AGUARDANDO_CONFIRMACAO', 'CONFIRMADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "pix_chave" TEXT,
    "pix_tipo" "PixTipo",
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "AmbienteTipo" NOT NULL,

    CONSTRAINT "ambientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ambientes" (
    "user_id" TEXT NOT NULL,
    "ambiente_id" TEXT NOT NULL,
    "entrada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ambientes_pkey" PRIMARY KEY ("user_id","ambiente_id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "ambiente_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "pagador_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "tag" "ExpenseTag" NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_participations" (
    "id" TEXT NOT NULL,
    "expense_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "porcentagem" DECIMAL(5,2) NOT NULL,
    "valor_calculado" DECIMAL(10,2) NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'PENDENTE',
    "pago_em" TIMESTAMP(3),

    CONSTRAINT "expense_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "ambiente_id" TEXT NOT NULL,
    "pagador_id" TEXT NOT NULL,
    "recebedor_id" TEXT NOT NULL,
    "valor_transferido" DECIMAL(10,2) NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'AGUARDANDO_CONFIRMACAO',
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_validacao" TIMESTAMP(3),

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_ambientes" ADD CONSTRAINT "user_ambientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ambientes" ADD CONSTRAINT "user_ambientes_ambiente_id_fkey" FOREIGN KEY ("ambiente_id") REFERENCES "ambientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_ambiente_id_fkey" FOREIGN KEY ("ambiente_id") REFERENCES "ambientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_pagador_id_fkey" FOREIGN KEY ("pagador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_participations" ADD CONSTRAINT "expense_participations_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_participations" ADD CONSTRAINT "expense_participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_ambiente_id_fkey" FOREIGN KEY ("ambiente_id") REFERENCES "ambientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_pagador_id_fkey" FOREIGN KEY ("pagador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_recebedor_id_fkey" FOREIGN KEY ("recebedor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
