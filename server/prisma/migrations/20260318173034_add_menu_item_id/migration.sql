-- DropIndex
DROP INDEX "Review_userId_restaurantId_key";

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "isVeg" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "menuItemId" TEXT;

-- CreateIndex
CREATE INDEX "Review_menuItemId_idx" ON "Review"("menuItemId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
