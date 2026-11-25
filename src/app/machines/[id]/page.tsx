import { eq, sql } from "drizzle-orm";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { statusLabels } from "@/components/MachineCard";
import { db } from "@/db";
import { dailyTransactions, machines } from "@/db/schema";

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection(); // wait for a real visitor, so data is always fresh
  const { id } = await params; // "m03" when the URL is /machines/m03

  // SQL: SELECT * FROM machines WHERE id = 'm03'
  const [machine] = await db.select().from(machines).where(eq(machines.id, id));

  if (!machine) {
    notFound(); // show the 404 page
  }

  // SQL: SELECT week, SUM(withdrawal_amount) FROM daily_transactions
  //      WHERE machine_id = 'm03' GROUP BY week ORDER BY week
  const week = sql<string>`date_trunc('week', ${dailyTransactions.date})::date`; // the Monday of that day's week
  const weeks = await db
    .select({ week, total: sql<number>`sum(${dailyTransactions.withdrawalAmount})::int` })
    .from(dailyTransactions)
    .where(eq(dailyTransactions.machineId, id))
    .groupBy(week)
    .orderBy(week);

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <NextLink href="/machines" className="text-sm text-gray-600 hover:underline">
        ← All machines
      </NextLink>
      <h1 className="mt-2 text-2xl font-bold">{machine.name}</h1>

      <dl className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        <Row label="Status" value={statusLabels[machine.status]} />
        <Row label="Area" value={machine.area} />
        <Row label="Model" value={machine.model} />
        <Row label="Serial number" value={machine.serialNumber ?? "Not set"} />
        <Row label="Target float" value={`$${machine.targetFloat.toLocaleString()}`} />
        <Row label="Machine ID" value={machine.id} />
      </dl>

      <WithdrawalsChart weeks={weeks} />
    </main>
  );
}

// One label-left, value-right line in the details list
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 p-3 text-sm">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

// Bar chart made of plain divs: each bar's height = that week's total ÷ the biggest week
function WithdrawalsChart({ weeks }: { weeks: { week: string; total: number }[] }) {
  if (weeks.length === 0) {
    return <p className="mt-6 text-sm text-gray-600">No withdrawals yet.</p>;
  }

  const biggest = Math.max(...weeks.map((w) => w.total));

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
      <h2 className="text-sm font-semibold">Withdrawals per week</h2>
      <div className="mt-3 flex h-40 items-end gap-0.5">
        {weeks.map((w) => (
          <div
            key={w.week}
            title={`Week of ${w.week}: $${w.total.toLocaleString()}`}
            className="flex-1 rounded-t bg-blue-500"
            style={{ height: `${(w.total / biggest) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-600">
        <span>{weeks[0].week}</span>
        <span>{weeks[weeks.length - 1].week}</span>
      </div>
      <p className="mt-2 text-xs text-gray-600">Biggest week: ${biggest.toLocaleString()}</p>
    </section>
  );
}