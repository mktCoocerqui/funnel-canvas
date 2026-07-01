-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('cluster', 'pipeline', 'funil', 'cliente', 'campanha', 'mensagem', 'template', 'produto', 'categoria', 'objetivo', 'rfv', 'segmentacao', 'acao', 'condicao', 'espera', 'decisao', 'observacao', 'documento', 'indicador', 'kpi', 'metrica', 'api', 'integracao', 'banco_de_dados', 'webhook', 'cupom', 'promocao', 'loja', 'fornecedor', 'marca', 'persona', 'jornada', 'automacao', 'workflow', 'evento');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('planejamento', 'criado', 'em_andamento', 'em_teste', 'ativo', 'pausado', 'concluido', 'arquivado');

-- CreateEnum
CREATE TYPE "CardPriority" AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "category" TEXT,
    "responsavel" TEXT,
    "status" "CardStatus",
    "priority" "CardPriority",
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dueDate" TIMESTAMP(3),
    "expectedValue" TEXT,
    "roi" TEXT,
    "investimento" TEXT,
    "ticketMedio" TEXT,
    "conversao" TEXT,
    "notes" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Card_projectId_idx" ON "Card"("projectId");

-- CreateIndex
CREATE INDEX "Connection_projectId_idx" ON "Connection"("projectId");

-- CreateIndex
CREATE INDEX "Comment_cardId_idx" ON "Comment"("cardId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
