"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { cashMoves, runs } from "@/db/schema";

// Runs on the server when the Start today form is submitted
export async function startRun(formData: FormData) {
  const startOdometer = Number(formData.get("startOdometer"));
  const cashFromHome = Number(formData.get("cashFromHome"));

  // Never trust the browser: check the numbers again here
  if (!Number.isInteger(startOdometer) || startOdometer < 0) {
    throw new Error("Starting odometer must be a whole number");
  }
  if (!Number.isInteger(cashFromHome) || cashFromHome < 0) {
    throw new Error("Cash from home must be whole dollars");
  }

  // Today's date where Riley lives, not the server's (Vercel runs on UTC)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  // Both rows are saved, or neither is
  const runId = await db.transaction(async (tx) => {
    const [run] = await tx
      .insert(runs)
      .values({ date: today, startOdometer })
      .returning({ id: runs.id });

    // $0 from home = no move (the database refuses amounts of 0)
    if (cashFromHome > 0) {
      await tx.insert(cashMoves).values({
        fromPlace: "home",
        toPlace: "run",
        amount: cashFromHome,
        runId: run.id,
      });
    }

    return run.id;
  });

  redirect(`/run/${runId}`); // go to the new run's page
}

// Runs on the server when Riley saves a bank withdrawal on the run page
export async function withdrawFromBank(formData: FormData) {
  const runId = Number(formData.get("runId")); // from the hidden box
  const bankAccountId = Number(formData.get("bankAccountId"));
  const amount = Number(formData.get("amount"));

  // Never trust the browser: check again here
  if (!Number.isInteger(runId) || !Number.isInteger(bankAccountId)) {
    throw new Error("Missing run or bank account");
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Amount must be whole dollars, more than $0");
  }

  // One new row: money moves from the bank into the bag
  await db.insert(cashMoves).values({
    fromPlace: "bank",
    toPlace: "run",
    amount,
    runId,
    bankAccountId,
  });

  revalidatePath(`/run/${runId}`); // show the new totals right away
}
