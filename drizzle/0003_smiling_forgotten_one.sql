CREATE TYPE "public"."run_status" AS ENUM('in-progress', 'finished');--> statement-breakpoint
CREATE TABLE "runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"start_odometer" integer NOT NULL,
	"end_odometer" integer,
	"counted_leftover" integer,
	"difference_note" text,
	"status" "run_status" DEFAULT 'in-progress' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
