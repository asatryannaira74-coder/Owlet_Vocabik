import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wordSetsTable } from "./wordSets";

export const wordPairsTable = pgTable("word_pairs", {
  id: serial("id").primaryKey(),
  setId: integer("set_id")
    .notNull()
    .references(() => wordSetsTable.id, { onDelete: "cascade" }),
  wordA: text("word_a").notNull(),
  wordB: text("word_b").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWordPairSchema = createInsertSchema(wordPairsTable).omit({ id: true, createdAt: true });
export type InsertWordPair = z.infer<typeof insertWordPairSchema>;
export type WordPair = typeof wordPairsTable.$inferSelect;
