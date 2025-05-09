import "server-only";

import { db } from "~/server/db";
import { files_table as filesSchema, folders_table as foldersSchema } from "~/server/db/schema";
import { and, eq, isNull, sum } from "drizzle-orm";

export const QUERIES = {
    getFolders: function(folderId: number){
        return db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.parent, folderId))
            .orderBy(foldersSchema.id);
    },
    getFiles: function (folderId: number){
        return db
            .select()
            .from(filesSchema)
            .where(eq(filesSchema.parent, folderId))
            .orderBy(filesSchema.id);
    },
    getFolderSize: async function (folderId: number): Promise<number> {
        // Get direct files size
        const directFilesSize = await db
            .select({ totalSize: sum(filesSchema.size) })
            .from(filesSchema)
            .where(eq(filesSchema.parent, folderId));
        
        const directSize = Number(directFilesSize[0]?.totalSize ?? 0);

        // Get all subfolders
        const subfolders = await db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.parent, folderId));

        // Recursively get size of each subfolder
        const subfolderSizes: number[] = await Promise.all(
            subfolders.map(folder => this.getFolderSize(folder.id))
        );

        // Sum up all sizes
        const totalSubfolderSize = subfolderSizes.reduce((sum: number, size: number) => sum + size, 0);
        
        return directSize + totalSubfolderSize;
    },
    getAllParentsForFolder: async function (folderId: number) {
        const parents = [];
        let currentId: number | null = folderId;
        while (currentId !== null) {
            const folder = await db
                .selectDistinct()
                .from(foldersSchema)
                .where(eq(foldersSchema.id, currentId));
            if (!folder[0]){
                throw new Error("Parent folder not found");

            }
            parents.unshift(folder[0]);
            currentId = folder[0]?.parent;
        }
        return parents;
    },
    getFolderById: async function (folderId: number){
        const folder = await db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.id, folderId));
        return folder[0];
    },

    getRootFolderForUser: async function (userId: string){
        const folder = await db
                    .select()
                    .from(foldersSchema)
                    .where(and(eq(foldersSchema.ownerId, userId),isNull(foldersSchema.parent),),);
        return folder[0]
    },
};

export const MUTATIONS = {
    createFile: async function (input: {
        file : {
        name: string;
        size: number;
        url: string;
        parent : number;
        };
        userId:string;
    }) {
        return await db.insert(filesSchema).values({
            ...input.file,
            ownerId: input.userId,
        });
    },

    onboardUser: async function (userId:string){
        const rootFolder = await db.insert(foldersSchema).values({
            name: "Root",
            parent: null,
            ownerId: userId,
        }).$returningId();
        
        const rootFolderId = rootFolder[0]!.id;

        await db.insert(foldersSchema).values([
            {
                name: "Trash",
                parent: rootFolderId,
                ownerId: userId,
            },
            {
                name: "Shared",
                parent: rootFolderId,
                ownerId: userId,

            },
            {
                name: "Documents",
                parent: rootFolderId,
                ownerId: userId,
            },
        ]);



        return rootFolderId
    },
    // Add this to your MUTATIONS object
createFolder: async function (input: {
    name: string;
    parentId: number;
    userId: string;
}) {
    return await db.insert(foldersSchema).values({
        name: input.name,
        parent: input.parentId,
        ownerId: input.userId,
    }).$returningId();
}

    
}