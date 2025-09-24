-- CreateEnum
CREATE TYPE "public"."EntryType" AS ENUM ('TV', 'MOVIE', 'OVA', 'SPECIAL', 'SEQUEL');

-- CreateEnum
CREATE TYPE "public"."EntryStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'HIATUS');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."CommentStatus" AS ENUM ('ACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEWEPISODE', 'COMMENTREPLY');

-- CreateTable
CREATE TABLE "public"."franchise" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "original_title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."entry" (
    "id" SERIAL NOT NULL,
    "franchise_id" INTEGER NOT NULL,
    "sort_order" INTEGER,
    "slug" VARCHAR(255) NOT NULL,
    "english_title" VARCHAR(255) NOT NULL,
    "romaji_title" VARCHAR(255),
    "japanese_title" VARCHAR(255),
    "synonyms" VARCHAR(255),
    "aired" VARCHAR(50),
    "premiered" VARCHAR(50),
    "duration" INTEGER,
    "status" "public"."EntryStatus" NOT NULL DEFAULT 'UPCOMING',
    "type" "public"."EntryType" NOT NULL DEFAULT 'TV',
    "description" TEXT,
    "mal_score" DECIMAL(3,2),
    "anilist_score" DECIMAL(3,2),
    "poster_url" VARCHAR(500) NOT NULL,
    "banner_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."episode" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "episode_name" VARCHAR(255),
    "is_filler" BOOLEAN NOT NULL DEFAULT false,
    "is_recap" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."video" (
    "id" SERIAL NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "host_name" VARCHAR(50) NOT NULL,
    "quality" VARCHAR(10) NOT NULL,
    "resolution" VARCHAR(10),
    "video_url" VARCHAR(500) NOT NULL,
    "format" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "avatar_url" VARCHAR(500),
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "muted_until" TIMESTAMP(3),
    "banned_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_token" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hashed_token" VARCHAR(255) NOT NULL,
    "user_agent" VARCHAR(255),
    "ip" VARCHAR(255),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" SERIAL NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "status" "public"."CommentStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment_report" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."setting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDarkMode" BOOLEAN NOT NULL DEFAULT true,
    "autoPlay" BOOLEAN NOT NULL DEFAULT false,
    "autoSkipIntro" BOOLEAN NOT NULL DEFAULT false,
    "autoSkipOutro" BOOLEAN NOT NULL DEFAULT false,
    "autoNext" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genre" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."studio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."watch_later" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_later_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."watch_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "episode_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notification_type" "public"."NotificationType" NOT NULL DEFAULT 'NEWEPISODE',
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."noti_sub" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noti_sub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_EntryToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EntryToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EntryToStudio" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EntryToStudio_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "franchise_slug_key" ON "public"."franchise"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "entry_slug_key" ON "public"."entry"("slug");

-- CreateIndex
CREATE INDEX "entry_franchise_id_sort_order_idx" ON "public"."entry"("franchise_id", "sort_order");

-- CreateIndex
CREATE INDEX "entry_status_type_idx" ON "public"."entry"("status", "type");

-- CreateIndex
CREATE INDEX "episode_is_filler_is_recap_idx" ON "public"."episode"("is_filler", "is_recap");

-- CreateIndex
CREATE UNIQUE INDEX "episode_entry_id_episode_number_key" ON "public"."episode"("entry_id", "episode_number");

-- CreateIndex
CREATE INDEX "video_episode_id_quality_is_active_idx" ON "public"."video"("episode_id", "quality", "is_active");

-- CreateIndex
CREATE INDEX "video_is_active_idx" ON "public"."video"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "public"."user"("status");

-- CreateIndex
CREATE INDEX "user_role_status_idx" ON "public"."user"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_hashed_token_key" ON "public"."refresh_token"("hashed_token");

-- CreateIndex
CREATE INDEX "comment_episode_id_status_created_at_idx" ON "public"."comment"("episode_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "comment_parent_id_idx" ON "public"."comment"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_report_comment_id_user_id_key" ON "public"."comment_report"("comment_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "setting_userId_key" ON "public"."setting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "public"."genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genre_slug_key" ON "public"."genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "studio_name_key" ON "public"."studio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "studio_slug_key" ON "public"."studio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "watch_later_user_id_entry_id_key" ON "public"."watch_later"("user_id", "entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_user_id_entry_id_key" ON "public"."watch_history"("user_id", "entry_id");

-- CreateIndex
CREATE INDEX "notification_user_id_created_at_idx" ON "public"."notification"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "_EntryToGenre_B_index" ON "public"."_EntryToGenre"("B");

-- CreateIndex
CREATE INDEX "_EntryToStudio_B_index" ON "public"."_EntryToStudio"("B");

-- AddForeignKey
ALTER TABLE "public"."entry" ADD CONSTRAINT "entry_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."episode" ADD CONSTRAINT "episode_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."video" ADD CONSTRAINT "video_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "public"."episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "public"."episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_report" ADD CONSTRAINT "comment_report_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_report" ADD CONSTRAINT "comment_report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."setting" ADD CONSTRAINT "setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watch_later" ADD CONSTRAINT "watch_later_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watch_later" ADD CONSTRAINT "watch_later_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watch_history" ADD CONSTRAINT "watch_history_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watch_history" ADD CONSTRAINT "watch_history_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "public"."episode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watch_history" ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."noti_sub" ADD CONSTRAINT "noti_sub_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."noti_sub" ADD CONSTRAINT "noti_sub_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntryToGenre" ADD CONSTRAINT "_EntryToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntryToGenre" ADD CONSTRAINT "_EntryToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntryToStudio" ADD CONSTRAINT "_EntryToStudio_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntryToStudio" ADD CONSTRAINT "_EntryToStudio_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
