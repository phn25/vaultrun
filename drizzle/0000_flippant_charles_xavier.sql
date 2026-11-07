CREATE TYPE "public"."machine_status" AS ENUM('active', 'needs-service', 'offline');--> statement-breakpoint
CREATE TABLE "machines" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"area" text NOT NULL,
	"model" text NOT NULL,
	"status" "machine_status" DEFAULT 'active' NOT NULL,
	"target_float" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
