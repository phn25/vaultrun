import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Fixed list for app-defined states (enum = only these values allowed)
export const statusEnum = pgEnum("machine_status", ["active", "needs-service", "offline"]);

export const machines = pgTable("machines", {
  id: text("id").primaryKey(), // "m01"
  name: text("name").notNull(),
  area: text("area").notNull(), // neighborhood; open list, so plain text
  model: text("model").notNull(), // real-world equipment; open list
  status: statusEnum("status").notNull().default("active"),
  targetFloat: integer("target_float").notNull(), // whole dollars
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Types derived from the table, so the shape is defined in one place
export type Machine = typeof machines.$inferSelect;
export type MachineStatus = Machine["status"];