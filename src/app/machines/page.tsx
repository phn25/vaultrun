import { connection } from "next/server";

import { MachineCard } from "@/components/MachineCard";
import { db } from "@/db";
import { machines } from "@/db/schema";

export default async function MachinesPage() {
  await connection(); // wait for a real visitor, so data is always fresh
  const rows = await db.select().from(machines).orderBy(machines.id);

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <h1 className="text-2xl font-bold">Machines</h1>
      <p className="mt-1 text-sm text-gray-600">{rows.length} machines</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((m) => (
          <MachineCard key={m.id} machine={m} />
        ))}
      </div>
    </main>
  );
}