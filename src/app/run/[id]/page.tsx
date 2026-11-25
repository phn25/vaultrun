import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { db } from "@/db";
import { cashMoves, runs } from "@/db/schema";

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

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Run on {run.date}</h1>
      <p className="mt-1 text-sm text-gray-600">Starting odometer: {run.startOdometer}</p>

      <div className="mt-6 max-w-sm rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">In the bag</p>
        <p className="text-3xl font-bold">${inTheBag.toLocaleString("en-US")}</p>
      </div>
    </main>
  );
}
