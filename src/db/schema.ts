import { date, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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