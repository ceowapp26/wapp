/*
  Warnings:

  - You are about to drop the `PlanAImodel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanAImodel" DROP CONSTRAINT "PlanAImodel_modelId_fkey";

-- DropTable
DROP TABLE "PlanAImodel";

-- CreateTable
CREATE TABLE "PlanAIModel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "modelId" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "maxRPM" INTEGER NOT NULL,
    "floorRPM" INTEGER NOT NULL,
    "ceilingRPM" INTEGER NOT NULL,
    "maxRPD" INTEGER NOT NULL,
    "floorRPD" INTEGER NOT NULL,
    "ceilingRPD" INTEGER NOT NULL,
    "maxTPM" INTEGER NOT NULL,
    "floorTPM" INTEGER NOT NULL,
    "ceilingTPM" INTEGER NOT NULL,
    "maxTPD" INTEGER NOT NULL,
    "floorTPD" INTEGER NOT NULL,
    "ceilingTPD" INTEGER NOT NULL,
    "purchasedAmount" INTEGER NOT NULL,

    CONSTRAINT "PlanAIModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanAIModel" ADD CONSTRAINT "PlanAIModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "PlanModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
