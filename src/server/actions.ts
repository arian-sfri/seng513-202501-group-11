"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
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