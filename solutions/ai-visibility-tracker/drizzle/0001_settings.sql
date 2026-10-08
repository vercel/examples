CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"models" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
