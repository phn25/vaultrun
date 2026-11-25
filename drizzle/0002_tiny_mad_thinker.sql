CREATE TABLE "daily_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" text NOT NULL,
	"date" date NOT NULL,
	"withdrawal_count" integer NOT NULL,
	"withdrawal_amount" integer NOT NULL,
	"surcharge_revenue" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_transactions" ADD CONSTRAINT "daily_transactions_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machines"("id") ON DELETE no action ON UPDATE no action;