-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "parentCardId" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX "Project_parentCardId_key" ON "Project"("parentCardId");
-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_parentCardId_fkey" FOREIGN KEY ("parentCardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
