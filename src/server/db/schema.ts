// import "server-only";

import {int, text, index, singlestoreTableCreator, bigint, timestamp} from 'drizzle-orm/singlestore-core'
import { pgTable, text as pgText, integer, primaryKey } from "drizzle-orm/pg-core";

export const createTable = singlestoreTableCreator(
  (name) => `cloudSync_${name}`,
);

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id",{mode: "number", unsigned: true}).primaryKey().autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", {mode: "number", unsigned: true}).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },(t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id",{mode: "number", unsigned: true}).primaryKey().autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parent: bigint("parent", {mode: "number", unsigned: true}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ]
  },
)

export type DB_FolderType = typeof folders_table.$inferSelect;

export const folder_permissions = pgTable("folder_permissions", {
  folderId: integer("folder_id").notNull(),
  userId: pgText("user_id").notNull(),
  access: pgText("access").notNull(), // 'read' | 'write' | 'admin'
}, (table) => ({
  pk: primaryKey({ columns: [table.folderId, table.userId] }),
}));

export const folder_lists = pgTable("folder_lists", {
  folderId: integer("folder_id").notNull(),
  userId: pgText("user_id").notNull(),
  type: pgText("type").notNull(), // 'blacklist' | 'whitelist'
}, (table) => ({
  pk: primaryKey({ columns: [table.folderId, table.userId, table.type] }),
}));