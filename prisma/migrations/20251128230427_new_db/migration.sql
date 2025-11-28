/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `services` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "testimonials_approved_idx";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "imageUrl",
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "occupation" TEXT;

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE INDEX "testimonials_approved_featured_idx" ON "testimonials"("approved", "featured");
