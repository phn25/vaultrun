import { eq } from "drizzle-orm";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { statusLabels } from "@/components/MachineCard";
import { db } from "@/db";
import { machines } from "@/db/schema";

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
        <Row label="Target float" value={`$${machine.targetFloat.toLocaleString()}`} />
        <Row label="Machine ID" value={machine.id} />
      </dl>
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