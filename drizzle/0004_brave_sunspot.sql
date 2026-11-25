CREATE TYPE "public"."cash_place" AS ENUM('home', 'bank', 'run', 'machine');--> statement-breakpoint
CREATE TABLE "cash_moves" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_place" "cash_place" NOT NULL,
	"to_place" "cash_place" NOT NULL,
	"amount" integer NOT NULL,
	"run_id" integer,
	"machine_id" text,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "amount_positive" CHECK ("cash_moves"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "cash_moves" ADD CONSTRAINT "cash_moves_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_moves" ADD CONSTRAINT "cash_moves_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id") ON DELETE no action ON UPDATE no action;