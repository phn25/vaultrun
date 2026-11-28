import { desc, eq, inArray } from "drizzle-orm";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { db } from "@/db";
import { bankAccounts, cashMoves, machines, runs } from "@/db/schema";

import { loadMachine, withdrawFromBank } from "../actions";
import { cashInBag } from "../bag";

export default async function RunPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ atm?: string; areas?: string }>;
}) {
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
  const inTheBag = cashInBag(moves);

  // Only the bank → run moves
  const fromBank = moves
    .filter((move) => move.fromPlace === "bank" && move.toPlace === "run")
    .reduce((total, move) => total + move.amount, 0);

  // Main account first, so it is picked by default
  const accounts = await db.select().from(bankAccounts).orderBy(desc(bankAccounts.isMain), bankAccounts.id);
  const mainAccount = accounts.find((account) => account.isMain);

  // The URL remembers her answers: /run/7?atm=yes&areas=North,South
  const { atm, areas } = await searchParams;
  const pickedAreas = areas ? areas.split(",") : []; // in the order she'll drive
  const atmRun = atm === "yes" || pickedAreas.length > 0;

  // Every area that has machines, for the "Add an area" buttons
  const allAreas = (await db.selectDistinct({ area: machines.area }).from(machines).orderBy(machines.area)).map(
    (row) => row.area,
  );
  const areasLeft = allAreas.filter((area) => !pickedAreas.includes(area));

  // Machines in the picked areas = today's stops, in driving order
  const stops =
    pickedAreas.length === 0
      ? []
      : (await db.select().from(machines).where(inArray(machines.area, pickedAreas)).orderBy(machines.id)).sort(
          (a, b) => pickedAreas.indexOf(a.area) - pickedAreas.indexOf(b.area),
        );

  // How much each machine got today: "m03" → 6000
  const loadedByMachine = new Map<string, number>();
  for (const move of moves) {
    if (move.fromPlace === "run" && move.toPlace === "machine" && move.machineId) {
      loadedByMachine.set(move.machineId, (loadedByMachine.get(move.machineId) ?? 0) + move.amount);
    }
  }
  const loaded = [...loadedByMachine.values()].reduce((total, amount) => total + amount, 0);
  const stopsDone = stops.filter((machine) => loadedByMachine.has(machine.id)).length;

  // A finished run only shows its summary (no more forms)
  if (run.status === "finished") {
    const tookHome = moves
      .filter((move) => move.fromPlace === "run" && move.toPlace === "home")
      .reduce((total, move) => total + move.amount, 0);
    return (
      <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
        <h1 className="text-2xl font-bold">Run complete</h1>
        <p className="mt-1 text-sm text-gray-600">Run on {run.date}</p>
        <dl className="mt-6 grid max-w-sm grid-cols-2 gap-y-2">
          <dt className="text-gray-600">Miles</dt>
          <dd className="text-right font-semibold">{(run.endOdometer ?? run.startOdometer) - run.startOdometer}</dd>
          <dt className="text-gray-600">Loaded</dt>
          <dd className="text-right font-semibold">${loaded.toLocaleString("en-US")}</dd>
          <dt className="text-gray-600">From bank</dt>
          <dd className="text-right font-semibold">${fromBank.toLocaleString("en-US")}</dd>
          <dt className="text-gray-600">Took home</dt>
          <dd className="text-right font-semibold">${tookHome.toLocaleString("en-US")}</dd>
        </dl>
        {run.differenceNote && <p className="mt-4 max-w-sm text-sm text-gray-600">Note: {run.differenceNote}</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Run on {run.date}</h1>
      <p className="mt-1 text-sm text-gray-600">Starting odometer: {run.startOdometer}</p>

      <div className="mt-6 grid max-w-sm grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-sm text-gray-600">In the bag</p>
          <p className="text-xl font-bold">${inTheBag.toLocaleString("en-US")}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-sm text-gray-600">Loaded</p>
          <p className="text-xl font-bold">${loaded.toLocaleString("en-US")}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-sm text-gray-600">From bank</p>
          <p className="text-xl font-bold">${fromBank.toLocaleString("en-US")}</p>
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

      {!atmRun && (
        <section className="mt-8 max-w-sm">
          <h2 className="text-lg font-semibold">Are you doing an ATM run today?</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <NextLink
              href={`/run/${run.id}?atm=yes`}
              className="rounded-lg bg-amber-400 p-3 text-center text-lg font-semibold text-gray-900 hover:bg-amber-500"
            >
              Yes
            </NextLink>
            <NextLink
              href={`/run/${run.id}/finish`}
              className="rounded-lg border border-gray-300 bg-white p-3 text-center text-lg font-semibold"
            >
              No, bank only
            </NextLink>
          </div>
        </section>
      )}

      {atmRun && (
        <section className="mt-8 max-w-sm">
          <h2 className="text-lg font-semibold">Areas, in driving order</h2>
          {pickedAreas.length === 0 && <p className="mt-1 text-sm text-gray-600">Tap the area you&apos;ll drive to first.</p>}
          <ol className="mt-2 list-decimal pl-6">
            {pickedAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            {areasLeft.map((area) => (
              <NextLink
                key={area}
                href={`/run/${run.id}?areas=${[...pickedAreas, area].join(",")}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium"
              >
                + {area}
              </NextLink>
            ))}
          </div>
        </section>
      )}

      {stops.length > 0 && (
        <section className="mt-8 max-w-sm">
          <h2 className="text-lg font-semibold">Stops</h2>
          <p className="text-sm text-gray-600">
            {stopsDone} of {stops.length} stops done
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {stops.map((machine) => {
              const amountLoaded = loadedByMachine.get(machine.id);
              return (
                <li key={machine.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="font-semibold">
                    {machine.name} <span className="text-sm font-normal text-gray-600">· {machine.area}</span>
                  </p>
                  {amountLoaded !== undefined ? (
                    <p className="mt-1 text-green-700">Loaded ${amountLoaded.toLocaleString("en-US")} ✓</p>
                  ) : (
                    <form action={loadMachine} className="mt-2 flex gap-2">
                      <input type="hidden" name="runId" value={run.id} />
                      <input type="hidden" name="machineId" value={machine.id} />
                      <input
                        name="amount"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        required
                        aria-label={`Amount put in ${machine.name} ($)`}
                        placeholder="Amount put in ($)"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-lg"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-amber-400 px-4 text-lg font-semibold text-gray-900 hover:bg-amber-500"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <NextLink
        href={`/run/${run.id}/finish`}
        className="mt-8 block max-w-sm rounded-lg border border-gray-300 bg-white p-3 text-center text-lg font-semibold"
      >
        Finish run
      </NextLink>
    </main>
  );
}
