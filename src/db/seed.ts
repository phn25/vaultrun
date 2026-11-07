import { db } from "./index";
import { machines } from "./schema";
import { machines as fakeMachines } from "@/data/machines";

// Fake data only. Real names, locations and cash never go in this repo.
async function main() {
  await db.delete(machines); // start clean so the seed can be re-run
  await db.insert(machines).values(fakeMachines);
  console.log(`Seeded ${fakeMachines.length} machines`);
  await db.$client.end(); // close the connection so the script exits
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});