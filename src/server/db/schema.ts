// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { int, text, singlestoreTable } from "drizzle-orm/singlestore-core"; // video used drizzle-orm/singlestore-core but gives an error

export const users = singlestoreTable("users_table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
  age: int("age"),
});

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = sqliteTableCreator((name) => `cloudsync_${name}`);

// // users table: stores authentication and roles
// export const users = createTable("users", {
//   id: int("id").primaryKey({ autoIncrement: true }),
//   email: text("email", { length: 256 }).notNull(),
//   password: text("password", { length: 256 }).unique().notNull(),
//   role: text("role", {enum: ["admin", "editor", "viewer", "blacklisted"] }).notNull(),
//   createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull()
// });

// // folders table: stores directory structure
// export const files = createTable("files", {
//   id: int("id").primaryKey({ autoIncrement: true }),
//   userId : int("user_id").notNull().references(() => users.id),
//   name: text("name", { length: 256 }).notNull(),
//   path: text("path", { length: 512 }).notNull(),
//   size: int("size").notNull(),
//   type: text("type", { length: 50 }).notNull(),
//   createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
//   updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date())
// });

// // // folders table - stores directory structure
// // export const folders = createTable("folders", {
// //   id: int("id").primaryKey({ autoIncrement: true }),
// //   name: text("name", { length: 256 }).notNull(),
// //   parentId: int("parent_id").references(() => folders.id),         // having a problem on this line
// //   ownerId: int("owner_id").notNull().references(() => users.id)
// // });

// // access control table: defines permissions
// export const accessControl = createTable("access_control", {
//   id: int("id").primaryKey({ autoIncrement: true }),
//   fileId: int("file_id").notNull().references(() => files.id),
//   userId: int("user_id").notNull().references(() => users.id),
//   role: text("role", { enum: ["editor", "viewer", "blacklisted"] }).notNull()
// });