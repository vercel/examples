CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"platform" text NOT NULL,
	"model_id" text,
	"provider_model_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"text" text,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"search_queries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"brand_mentioned" boolean DEFAULT false NOT NULL,
	"brand_cited" boolean DEFAULT false NOT NULL,
	"mention_count" integer DEFAULT 0 NOT NULL,
	"brand_position" integer,
	"brands_named" integer DEFAULT 0 NOT NULL,
	"error" text,
	"input_tokens" integer,
	"output_tokens" integer,
	"duration_ms" integer,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_mentions" (
	"id" serial PRIMARY KEY NOT NULL,
	"answer_id" integer NOT NULL,
	"run_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"platform" text NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"website" text,
	"sentiment" text DEFAULT 'neutral' NOT NULL,
	"recommended" boolean DEFAULT false NOT NULL,
	"is_competitor" boolean DEFAULT true NOT NULL,
	"is_self" boolean DEFAULT false NOT NULL,
	"position" integer,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"domain" text NOT NULL,
	"country" text,
	"language" text,
	"platforms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"text" text NOT NULL,
	"cadence" text DEFAULT 'daily' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"trigger" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"total_items" integer DEFAULT 0 NOT NULL,
	"done_items" integer DEFAULT 0 NOT NULL,
	"failed_items" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_mentions" ADD CONSTRAINT "brand_mentions_answer_id_answers_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_mentions" ADD CONSTRAINT "brand_mentions_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_mentions" ADD CONSTRAINT "brand_mentions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_run_idx" ON "answers" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "answers_brand_completed_idx" ON "answers" USING btree ("brand_id","completed_at");--> statement-breakpoint
CREATE INDEX "answers_question_idx" ON "answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "brand_mentions_brand_key_idx" ON "brand_mentions" USING btree ("brand_id","key");--> statement-breakpoint
CREATE INDEX "brand_mentions_answer_idx" ON "brand_mentions" USING btree ("answer_id");--> statement-breakpoint
CREATE INDEX "questions_brand_idx" ON "questions" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "runs_brand_created_idx" ON "runs" USING btree ("brand_id","created_at");