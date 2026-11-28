import { eq } from "drizzle-orm";
import NextLink from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { db } from "@/db";
import { cashMoves, runs } from "@/db/schema";

import { finishRun } from "../../actions";
import { cashInBag } from "../../bag";

export default async function FinishPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ end?: string; count?: string }>;
}) {
  await connection(); // wait for a real visitor, so data is always fresh
  const { id } = await params;
  const runId = Number(id);
  if (!Number.isInteger(runId)) {
    notFound();
  }

  const [run] = await db.select().from(runs).where(eq(runs.id, runId));
  if (!run) {
    notFound();
  }
  if (run.status === "finished") {
    redirect(`/run/${run.id}`); // already done: show the summary
  }

  // What SHOULD be in the bag, from the ledger
  const moves = await db.select().from(cashMoves).where(eq(cashMoves.runId, runId));
  const expected = cashInBag(moves);

  // Step 2 of finishing: the "Check my count" form put her numbers in the URL
  const { end, count } = await searchParams;
  const endOdometer = Number(end);
  const counted = Number(count);
  const endTooLow = end !== undefined && endOdometer < run.startOdometer;
  const checked =
    end !== undefined &&
    count !== undefined &&
    Number.isInteger(endOdometer) &&
    Number.isInteger(counted) &&
    counted >= 0 &&
    !endTooLow;
  const difference = counted - expected; // less = negative, more = positive

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Finish run</h1>
      <p className="mt-1 text-sm text-gray-600">Run on {run.date}</p>

      {!checked && (
        // No action = a plain GET form: it just adds ?end=…&count=… to this page's address
        <form className="mt-6 flex max-w-sm flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Ending odometer</span>
            <input
              name="end"
              type="number"
              inputMode="numeric"
              min={run.startOdometer}
              step={1}
              required
              className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
            />
          </label>
          {endTooLow && (
            <p className="text-sm text-red-700">
              Ending odometer can&apos;t be less than the starting one ({run.startOdometer}).
            </p>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Cash left in the bag ($)</span>
            <input
              name="count"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              required
              className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-amber-400 p-3 text-lg font-semibold text-gray-900 hover:bg-amber-500"
          >
            Check my count
          </button>
        </form>
      )}

      {checked && (
        <form action={finishRun} className="mt-6 flex max-w-sm flex-col gap-4">
          <input type="hidden" name="runId" value={run.id} />
          <input type="hidden" name="endOdometer" value={endOdometer} />
          <input type="hidden" name="countedLeftover" value={counted} />

          <p>Miles today: {endOdometer - run.startOdometer}</p>

          {difference === 0 ? (
            <p className="rounded-lg bg-green-50 p-3 text-green-800">
              Your count matches: ${counted.toLocaleString("en-US")}.
            </p>
          ) : (
            <>
              <p className="rounded-lg bg-red-50 p-3 text-red-800">
                You counted ${Math.abs(difference).toLocaleString("en-US")} {difference < 0 ? "less" : "more"} than
                expected (${expected.toLocaleString("en-US")}). Count again, or write a note saying why.
              </p>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Note (why the count is different)</span>
                <textarea
                  name="note"
                  required
                  rows={3}
                  className="rounded-lg border border-gray-300 bg-white p-3 text-lg"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="rounded-lg bg-amber-400 p-3 text-lg font-semibold text-gray-900 hover:bg-amber-500"
          >
            Save and finish
          </button>
          <NextLink href={`/run/${run.id}/finish`} className="text-center text-sm underline">
            Count again
          </NextLink>
        </form>
      )}
    </main>
  );
}
