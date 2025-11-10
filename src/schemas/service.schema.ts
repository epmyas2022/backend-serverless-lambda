import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const servicesTable = sqliteTable("services", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  externalPort: int().default(80),
  port: int().notNull(),
  image: text().notNull(),
});


export type Service = typeof servicesTable.$inferSelect;