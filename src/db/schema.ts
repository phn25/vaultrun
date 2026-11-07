import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Fixed lists, same values as the Machine type in src/data/machines.ts
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