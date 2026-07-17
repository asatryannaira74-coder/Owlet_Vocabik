import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wordSetsTable = pgTable("word_sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  languageFrom: text("language_from").notNull().default("en"),
  languageTo: text("language_to").notNull().default("ru"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWordSetSchema = createInsertSchema(wordSetsTable).omit({ id: true, createdAt: true });
export type InsertWordSet = z.infer<typeof insertWordSetSchema>;
export type WordSet = typeof wordSetsTable.$inferSelect;
