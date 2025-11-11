import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const servicesTable = sqliteTable("services", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  port: int().notNull().default(80),
  image: text().notNull(),
  environments: text(),
});


export type Service = typeof servicesTable.$inferSelect;