import { sql } from "drizzle-orm";
import { check, date, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Fixed list for app-defined states (enum = only these values allowed)
export const statusEnum = pgEnum("machine_status", ["active", "needs-service", "offline"]);

export const machines = pgTable("machines", {
  id: text("id").primaryKey(), // "m01"
  name: text("name").notNull(),
  area: text("area").notNull(), // neighborhood; open list, so plain text
  model: text("model").notNull(), // real-world equipment; open list
  serialNumber: text("serial_number"), // from the machine's label; blank until Riley adds it
  status: statusEnum("status").notNull().default("active"),
  targetFloat: integer("target_float").notNull(), // whole dollars
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Types derived from the table, so the shape is defined in one place
export type Machine = typeof machines.$inferSelect;
export type MachineStatus = Machine["status"];

// One row per machine per day, from the processor's report (fake in the demo)
export const dailyTransactions = pgTable("daily_transactions", {
  id: serial("id").primaryKey(), // 1, 2, 3… Postgres counts up for us
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id), // foreign key: must be a real machine id
  date: date("date").notNull(), // "2026-11-24"
  withdrawalCount: integer("withdrawal_count").notNull(), // how many withdrawals that day
  withdrawalAmount: integer("withdrawal_amount").notNull(), // whole dollars taken out
  surchargeRevenue: integer("surcharge_revenue").notNull(), // whole dollars in fees
});

// Fixed list for a run's state
export const runStatusEnum = pgEnum("run_status", ["in-progress", "finished"]);

// One row per day out (a bank-only day counts too)
export const runs = pgTable("runs", {
  id: serial("id").primaryKey(), // 1, 2, 3…
  date: date("date").notNull(), // "2026-11-25"
  startOdometer: integer("start_odometer").notNull(), // typed when she starts
  endOdometer: integer("end_odometer"), // blank until she finishes
  countedLeftover: integer("counted_leftover"), // whole dollars counted in the bag at finish
  differenceNote: text("difference_note"), // why the count differs from expected
  status: runStatusEnum("status").notNull().default("in-progress"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Run = typeof runs.$inferSelect;

// The four places cash can be
export const cashPlaceEnum = pgEnum("cash_place", ["home", "bank", "run", "machine"]);

// Append-only ledger: one row per money move.
// Never updated or deleted. A fix is a new row with a note.
export const cashMoves = pgTable(
  "cash_moves",
  {
    id: serial("id").primaryKey(),
    fromPlace: cashPlaceEnum("from_place").notNull(),
    toPlace: cashPlaceEnum("to_place").notNull(),
    amount: integer("amount").notNull(), // whole dollars, always more than 0
    runId: integer("run_id").references(() => runs.id), // optional: blank when not part of a run
    machineId: text("machine_id").references(() => machines.id), // optional: set when cash goes in or out of a machine
    note: text("note"), // required by the app for corrections and count differences
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("amount_positive", sql`${table.amount} > 0`)],
);

export type CashMove = typeof cashMoves.$inferSelect;