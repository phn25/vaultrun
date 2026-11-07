import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// One shared connection pool. DATABASE_URL comes from .env.local (never committed).
export const db = drizzle(process.env.DATABASE_URL!, { schema });