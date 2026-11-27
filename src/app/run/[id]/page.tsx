import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { db } from "@/db";
import { bankAccounts, cashMoves, runs } from "@/db/schema";

import { withdrawFromBank } from "../actions";

export default async function RunPage({ params }: { params: Promise<{ id: string }> }) {
  await connection(); // wait for a real visitor, so data is always fresh
  const { id } = await params; // "7" when the URL is /run/7
  const runId = Number(id);
  if (!Number.isInteger(runId)) {
    notFound();
  }

  const [run] = await db.select().from(runs).where(eq(runs.id, runId));
  if (!run) {
    notFound();
  }

  // Cash in the bag = money moved into the run − money moved out of it
  const moves = await db.select().from(cashMoves).where(eq(cashMoves.runId, runId));
  const inTheBag = moves.reduce((total, move) => {
    if (move.toPlace === "run") return total + move.amount;
    if (move.fromPlace === "run") return total - move.amount;
    return total;
  }, 0);

  // Only the bank → run moves
  const fromBank = moves
    .filter((move) => move.fromPlace === "bank" && move.toPlace === "run")
    .reduce((total, move) => total + move.amount, 0);

  // Main account first, so it is picked by default
  const accounts = await db.select().from(bankAccounts).orderBy(desc(bankAccounts.isMain), bankAccounts.id);
  const mainAccount = accounts.find((account) => account.isMain);

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Run on {run.date}</h1>
      <p className="mt-1 text-sm text-gray-600">Starting odometer: {run.startOdometer}</p>

      <div className="mt-6 grid max-w-sm grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">In the bag</p>
          <p className="text-2xl font-bold">${inTheBag.toLocaleString("en-US")}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">From bank</p>
          <p className="text-2xl font-bold">${fromBank.toLocaleString("en-US")}</p>
        </div>
      </div>

      <form action={withdrawFromBank} className="mt-6 flex max-w-sm flex-col gap-4">
        <h2 className="text-lg font-semibold">Bank stop</h2>
        <input type="hidden" name="runId" value={run.id} />

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Account</span>
          <select
            name="bankAccountId"
            defaultValue={mainAccount?.id}
            required
            className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.nickname} ··{account.last4}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Amount withdrawn ($)</span>
          <input
            name="amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            required
            className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-amber-400 p-3 text-lg font-semibold text-gray-900 hover:bg-amber-500"
        >
          Save withdrawal
        </button>
      </form>
    </main>
  );
}
