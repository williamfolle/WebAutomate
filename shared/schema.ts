import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model remains the same as it's not used in this application
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Processing result validation schema
export const processingResultSchema = z.object({
  elementsProcessed: z.number(),
  attributesAdded: z.number(),
});

// File upload validation schemas
export const zipFileSchema = z.object({
  file: z.instanceof(File).refine((file) => 
    file.name.endsWith('.zip'), 
    { message: "O arquivo deve ser do tipo ZIP (.zip)" }
  )
});

export const csvFilesSchema = z.object({
  files: z.array(
    z.instanceof(File).refine((file) => 
      file.name.endsWith('.csv'), 
      { message: "Os arquivos devem ser do tipo CSV (.csv)" }
    )
  ).min(1, { message: "Pelo menos um arquivo CSV é necessário" })
});
