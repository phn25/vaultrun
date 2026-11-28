import { and, eq, gte } from "drizzle-orm";
import NextLink from "next/link";
import { connection } from "next/server";

import { statusLabels } from "@/components/MachineCard";
import { db } from "@/db";
import { machines, runs, type Machine, type MachineStatus } from "@/db/schema";

// Status dot color for each machine status (tokens from globals.css)
const dotColors: Record<MachineStatus, string> = {
  active: "bg-ok",
  "needs-service": "bg-warn",
  offline: "bg-bad",
};

export default async function Home() {
  await connection(); // wait for a real visitor, so data is always fresh

  // Dates where Riley lives, not the server's (Vercel runs on UTC)
  const timeZone = "America/New_York";
  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone }); // "2026-11-28"
  const yearStart = `${today.slice(0, 4)}-01-01`;
  const hour = Number(now.toLocaleString("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }));
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const prettyDate = now.toLocaleDateString("en-US", { timeZone, weekday: "long", month: "long", day: "numeric" });

  const machineRows = await db.select().from(machines).orderBy(machines.area, machines.id);
  const finishedRuns = await db
    .select()
    .from(runs)
    .where(and(eq(runs.status, "finished"), gte(runs.date, yearStart)));

  // Miles for one run = end odometer − start odometer
  const milesOf = (run: (typeof finishedRuns)[number]) => (run.endOdometer ?? run.startOdometer) - run.startOdometer;
  const milesToday = finishedRuns.filter((run) => run.date === today).reduce((sum, run) => sum + milesOf(run), 0);
  const milesThisYear = finishedRuns.reduce((sum, run) => sum + milesOf(run), 0);

  const countOf = (status: MachineStatus) => machineRows.filter((m) => m.status === status).length;

  // Group machines by area: { North: [...], South: [...] }
  const byArea = Map.groupBy(machineRows, (m) => m.area);

  return (
    <main className="min-h-screen bg-page pb-28 text-ink">
      <header className="border-b border-edge px-4 pt-5 pb-4">
        <p className="font-wordmark text-2xl">VaultRun</p>
        <h1 className="mt-4 font-num text-4xl font-bold">{greeting}</h1>
        <p className="text-dim">{prettyDate}</p>

        <div className="mt-4 grid grid-cols-2 rounded-xl border border-edge bg-panel">
          <Stat value={`${milesToday.toLocaleString()} mi`} label="Driven today" />
          <Stat value={`${milesThisYear.toLocaleString()} mi`} label={`Driven in ${today.slice(0, 4)}, for taxes`} divider />
        </div>

        <div className="mt-3 grid grid-cols-3 rounded-xl border border-edge bg-panel">
          <Stat value={countOf("active")} label="Running" color="text-ok" />
          <Stat value={countOf("needs-service")} label="Need service" color="text-warn" divider />
          <Stat value={countOf("offline")} label="Offline" color="text-bad" divider />
        </div>
      </header>

      <section className="px-4 pt-5">
        <h2 className="font-num text-3xl font-bold">Your machines</h2>
        <p className="text-dim">Tap a machine for its details.</p>

        {[...byArea].map(([area, list]) => (
          <div key={area} className="mt-4 overflow-hidden rounded-xl border border-edge bg-panel">
            <div className="flex items-baseline justify-between px-4 py-3">
              <h3 className="font-bold">{area}</h3>
              <span className="text-sm text-dim">{list.length} machines</span>
            </div>
            {list.map((m) => (
              <MachineRow key={m.id} machine={m} />
            ))}
          </div>
        ))}
      </section>

      {/* Main button stays at the bottom of the screen, easy to reach with a thumb */}
      <div className="fixed inset-x-0 bottom-0 bg-linear-to-t from-page from-60% to-transparent px-4 pt-6 pb-4">
        <NextLink
          href="/run/start"
          className="block rounded-2xl bg-go p-4 text-center font-num text-2xl font-bold text-go-ink"
        >
          Start today
        </NextLink>
      </div>
    </main>
  );
}

// One number with a small label under it
function Stat({ value, label, color = "", divider = false }: { value: string | number; label: string; color?: string; divider?: boolean }) {
  return (
    <div className={`px-3 py-2 ${divider ? "border-l border-edge" : ""}`}>
      <p className={`font-num text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-dim">{label}</p>
    </div>
  );
}

// One machine: number, status dot + word, model, target float
function MachineRow({ machine }: { machine: Machine }) {
  return (
    <NextLink
      href={`/machines/${machine.id}`}
      className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-t border-edge px-4 py-3"
    >
      <span className="font-num text-3xl font-bold">{machine.id.slice(1)}</span>
      <span>
        <span className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${dotColors[machine.status]}`} />
          {machine.status === "active" ? "Running" : statusLabels[machine.status]}
        </span>
        <span className="text-sm text-dim">{machine.model}</span>
      </span>
      <span className="text-right">
        <span className="block font-num text-xl font-semibold">${machine.targetFloat.toLocaleString()}</span>
        <span className="text-xs text-dim">target</span>
      </span>
    </NextLink>
  );
}
