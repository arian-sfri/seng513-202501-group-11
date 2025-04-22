import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
    params: Promise<{ folderId: string }>;
}) {
    const params = await props.params;

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>;
    }

    const [folders, files, parents] = await Promise.all([
        QUERIES.getFolders(parsedFolderId),
        QUERIES.getFiles(parsedFolderId),
        QUERIES.getAllParentsForFolder(parsedFolderId),
    ]);

    // Get sizes for all folders
    const foldersWithSizes = await Promise.all(
        folders.map(async (folder) => ({
            ...folder,
            size: await QUERIES.getFolderSize(folder.id),
        }))
    );

    return <DriveContents 
        files={files} 
        folders={foldersWithSizes} 
        parents={parents} 
        currentFolderId={parsedFolderId}
    />;
}
