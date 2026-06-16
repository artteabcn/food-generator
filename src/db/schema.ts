import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  githubRepo: text("github_repo").notNull(),
  cfProjectName: text("cf_project_name").notNull(),
  deployUrl: text("deploy_url"),
  status: text("status", {
    enum: ["pending", "deploying", "live", "error"],
  })
    .notNull()
    .default("pending"),
  theme: text("theme").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
