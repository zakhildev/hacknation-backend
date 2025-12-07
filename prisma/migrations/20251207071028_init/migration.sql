-- CreateTable
CREATE TABLE "Cache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socketId" TEXT NOT NULL,
    "cache" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cache_id_key" ON "Cache"("id");
