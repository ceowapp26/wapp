/*
  Warnings:

  - You are about to drop the `Aimodel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Planmodel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Aimodel" DROP CONSTRAINT "Aimodel_modelId_fkey";

-- DropTable
DROP TABLE "Aimodel";

-- DropTable
DROP TABLE "Planmodel";

-- CreateTable
CREATE TABLE "PlanModel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plan" "Plans" NOT NULL,

    CONSTRAINT "PlanModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAImodel" (
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

    CONSTRAINT "PlanAImodel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditAIModel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "modelId" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "maxRPM" INTEGER NOT NULL,
    "ceilingRPM" INTEGER NOT NULL,
    "floorRPM" INTEGER NOT NULL,
    "maxRPD" INTEGER NOT NULL,
    "ceilingRPD" INTEGER NOT NULL,
    "floorRPD" INTEGER NOT NULL,
    "maxInputTokens" INTEGER NOT NULL,
    "ceilingInputTokens" INTEGER NOT NULL,
    "floorInputTokens" INTEGER NOT NULL,
    "maxOutputTokens" INTEGER NOT NULL,
    "ceilingOutputTokens" INTEGER NOT NULL,
    "floorOutputTokens" INTEGER NOT NULL,
    "purchasedAmount" INTEGER NOT NULL,

    CONSTRAINT "CreditAIModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanAImodel" ADD CONSTRAINT "PlanAImodel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "PlanModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
