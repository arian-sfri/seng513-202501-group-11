"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table, folder_permissions, folder_lists } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId){
        return { error: "Unauthorized" };
    }
    const [file] = await db
        .select()
        .from(files_table)
        .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)));

    if (!file) {
        return { error: "File not found" };
    }

    const utApiResult = await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")]);

    const dbDeleteResult = await db.delete(files_table).where(eq(files_table.id, fileId));

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
    return { success: true };
}

export async function createFolder(input: {
    name: string;
    parentId: number;
    userId?: string;
  }) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }
  
    const result = await db.insert(folders_table).values({
      name: input.name,
      parent: input.parentId,
      ownerId: session.userId,
    }).$returningId();

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
    return { success: true };

  }

export async function deleteFolder(folderId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }
    
    await db.delete(folders_table).where(eq(folders_table.id, folderId));
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
    return { success: true };

}

export async function updatePermissions({
  folderId,
  permissions,
  lists,
}: {
  folderId: number;
  permissions: { userId: string; access: string }[];
  lists: { userId: string; type: string }[];
}) {
  // Remove all and re-insert for simplicity (can optimize later)
  await db.delete(folder_permissions).where({ folderId });
  await db.delete(folder_lists).where({ folderId });

  if (permissions.length) {
    await db.insert(folder_permissions).values(
      permissions.map((p) => ({
        folderId,
        userId: p.userId,
        access: p.access,
      }))
    );
  }
  if (lists.length) {
    await db.insert(folder_lists).values(
      lists.map((l) => ({
        folderId,
        userId: l.userId,
        type: l.type,
      }))
    );
  }
}

export async function getFolderPermissions(folderId: number) {
  // Replace with your DB logic
  // Example:
  // const permissions = await db.permissions.findMany({ where: { folderId } });
  // const lists = await db.lists.findMany({ where: { folderId } });
  // return { permissions, lists };

  // Dummy data for now:
  return {
    permissions: [
      { userId: "user1@example.com", access: "read" },
      { userId: "user2@example.com", access: "write" },
    ],
    lists: [
      { userId: "user3@example.com", type: "blacklist" },
      { userId: "user4@example.com", type: "whitelist" },
    ],
  };
}

export async function getFolderLists(folderId: number) {
  return db.select().from(folder_lists).where({ folderId });
}