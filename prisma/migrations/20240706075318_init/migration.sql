-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('FREE', 'STANDARD', 'PRO', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Model" AS ENUM ('gpt_4', 'gpt_4_32k', 'gpt_4_1106_preview', 'gpt_4_0125_preview', 'gpt_4_turbo', 'gpt_4_turbo_2024_04_09', 'gpt_3_5_turbo', 'gpt_3_5_turbo_16k', 'gpt_3_5_turbo_1106', 'gpt_3_5_turbo_0125', 'gemini_1_0_pro', 'gemini_1_5_pro', 'gemini_1_5_flash', 'dall_e_3');

-- CreateTable
CREATE TABLE "App" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "deployedDate" TIMESTAMP(3) NOT NULL,
    "releasedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "developers" JSONB NOT NULL DEFAULT '{}',
    "releaseNotes" JSONB NOT NULL DEFAULT '[]',
    "license" TEXT,
    "platform" TEXT NOT NULL,
    "watermark" TEXT,
    "domain" TEXT NOT NULL,
    "logo" TEXT,
    "plan" "Plans" NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "deployedDate" TIMESTAMP(3) NOT NULL,
    "releasedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "developers" JSONB NOT NULL DEFAULT '{}',
    "releaseNotes" JSONB NOT NULL DEFAULT '[]',
    "appId" UUID NOT NULL,
    "serviceId" UUID,
    "plan" "Plans" NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "deployedDate" TIMESTAMP(3) NOT NULL,
    "releasedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "developers" JSONB NOT NULL DEFAULT '{}',
    "releaseNotes" JSONB NOT NULL DEFAULT '[]',
    "license" JSONB NOT NULL DEFAULT '{}',
    "platforms" TEXT NOT NULL,
    "watermark" TEXT,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppBillings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "appId" UUID NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "AppBillings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBillings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serviceId" UUID NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "ServiceBillings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clerkId" TEXT NOT NULL,
    "username" TEXT,
    "fullname" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "permission" TEXT,
    "stripeId" TEXT,
    "phone" TEXT,
    "pictureUrl" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clerkId" TEXT NOT NULL,
    "username" TEXT,
    "fullname" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'admin',
    "permission" TEXT,
    "stripeId" TEXT,
    "phone" TEXT,
    "pictureUrl" TEXT,
    "password" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "customers" TEXT[],
    "template" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "numOfUsers" INTEGER NOT NULL,
    "numOfSubscribers" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "numOfSubscribers" INTEGER NOT NULL,
    "appId" UUID,
    "serviceId" UUID,
    "plan" "Plans" NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "senderAvatar" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planmodel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plan" "Plans" NOT NULL,

    CONSTRAINT "Planmodel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aimodel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" "Model" NOT NULL,
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

    CONSTRAINT "Aimodel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppBillings" ADD CONSTRAINT "AppBillings_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBillings" ADD CONSTRAINT "ServiceBillings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aimodel" ADD CONSTRAINT "Aimodel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Planmodel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
