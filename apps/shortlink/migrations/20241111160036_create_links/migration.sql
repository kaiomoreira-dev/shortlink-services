-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "original_url" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "clicks" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_id_key" ON "Link"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_user_id_key" ON "Link"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_short_url_key" ON "Link"("short_url");
