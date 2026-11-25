import { db } from "./index";
import { dailyTransactions, machines } from "./schema";

// The 14 fake machines (moved here from src/data/machines.ts)
const fakeMachines: (typeof machines.$inferInsert)[] = [
  { id: "m01", name: "Machine 01", area: "North", model: "Hyosung Halo II", serialNumber: "DEMO-SN-01", status: "active", targetFloat: 8000 },
  { id: "m02", name: "Machine 02", area: "North", model: "Genmega G2500", serialNumber: "DEMO-SN-02", status: "active", targetFloat: 8000 },
  { id: "m03", name: "Machine 03", area: "North", model: "Hyosung Halo II", serialNumber: "DEMO-SN-03", status: "needs-service", targetFloat: 8000 },
  { id: "m04", name: "Machine 04", area: "North", model: "Genmega G2500", serialNumber: "DEMO-SN-04", status: "active", targetFloat: 6000 },
  { id: "m05", name: "Machine 05", area: "North", model: "Hyosung Halo II", serialNumber: "DEMO-SN-05", status: "active", targetFloat: 8000 },
  { id: "m06", name: "Machine 06", area: "North", model: "Genmega G2500", serialNumber: "DEMO-SN-06", status: "offline", targetFloat: 8000 },
  { id: "m07", name: "Machine 07", area: "North", model: "Hyosung Halo II", serialNumber: "DEMO-SN-07", status: "active", targetFloat: 10000 },
  { id: "m08", name: "Machine 08", area: "South", model: "Genmega G2500", serialNumber: "DEMO-SN-08", status: "active", targetFloat: 8000 },
  { id: "m09", name: "Machine 09", area: "South", model: "Hyosung Halo II", serialNumber: "DEMO-SN-09", status: "active", targetFloat: 8000 },
  { id: "m10", name: "Machine 10", area: "South", model: "Genmega G2500", serialNumber: "DEMO-SN-10", status: "needs-service", targetFloat: 6000 },
  { id: "m11", name: "Machine 11", area: "South", model: "Hyosung Halo II", serialNumber: "DEMO-SN-11", status: "active", targetFloat: 8000 },
  { id: "m12", name: "Machine 12", area: "South", model: "Genmega G2500", serialNumber: "DEMO-SN-12", status: "active", targetFloat: 8000 },
  { id: "m13", name: "Machine 13", area: "South", model: "Hyosung Halo II", serialNumber: "DEMO-SN-13", status: "active", targetFloat: 8000 },
  { id: "m14", name: "Machine 14", area: "South", model: "Genmega G2500", serialNumber: "DEMO-SN-14", status: "active", targetFloat: 8000 },
];

// 6 months of fake daily withdrawals for every machine (busier on Fri and Sat)
function fakeDailyTransactions() {
  const rows: (typeof dailyTransactions.$inferInsert)[] = [];
  const today = new Date();

  for (const machine of fakeMachines) {
    for (let daysAgo = 182; daysAgo >= 1; daysAgo--) {
      const day = new Date(today);
      day.setDate(today.getDate() - daysAgo);

      const weekday = day.getDay(); // 0 = Sunday … 5 = Friday, 6 = Saturday
      const busy = weekday === 5 || weekday === 6 ? 1.6 : 1;
      const count = Math.round((8 + Math.random() * 10) * busy); // 8 to 18 on a normal day
      const averageWithdrawal = 20 * (3 + Math.floor(Math.random() * 3)); // $60, $80 or $100

      rows.push({
        machineId: machine.id,
        date: day.toISOString().slice(0, 10), // "2026-11-24"
        withdrawalCount: count,
        withdrawalAmount: count * averageWithdrawal,
        surchargeRevenue: count * 3, // fake $3 fee per withdrawal
      });
    }
  }
  return rows;
}

// Fake data only. Real names, locations and cash never go in this repo.
async function main() {
  // Delete children first: a transaction row points at a machine (foreign key)
  await db.delete(dailyTransactions);
  await db.delete(machines); // start clean so the seed can be re-run

  await db.insert(machines).values(fakeMachines);
  console.log(`Seeded ${fakeMachines.length} machines`);

  const transactions = fakeDailyTransactions();
  await db.insert(dailyTransactions).values(transactions);
  console.log(`Seeded ${transactions.length} daily transactions`);

  await db.$client.end(); // close the connection so the script exits
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});