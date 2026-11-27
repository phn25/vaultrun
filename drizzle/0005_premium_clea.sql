CREATE TABLE "bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_name" text NOT NULL,
	"nickname" text NOT NULL,
	"last4" text NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cash_moves" ADD COLUMN "bank_account_id" integer;--> statement-breakpoint
ALTER TABLE "cash_moves" ADD CONSTRAINT "cash_moves_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;