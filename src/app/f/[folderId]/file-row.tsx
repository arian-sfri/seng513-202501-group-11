import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import type { folders_table, files_table } from "~/server/db/schema";

export function FileRow(props: {file: (typeof files_table.$inferSelect)}){
    const {file} = props;
    return(
        <li key={file.id} className="border-b border-stone-50 px-6 py-4">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                      <a
                        href={file.url}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                        target="_blank"
                      >
                        <FileIcon className="mr-3" size={20} />
                        {file.name}
                      </a>
                  </div>
                  <div className="col-span-2 text-stone-300">
                    {"file"}
                  </div>
                  <div className="col-span-3 text-stone-300">
                    {file.size}
                  </div>
                  <div className="col-span-1 text-stone-300">
                    <Button 
                      variant="ghost"
                      onClick={() => deleteFile(file.id)}
                      aria-label="Delete file">
                      <Trash2Icon size={20} />
                    </Button>
                  </div>
                </div>
              </li>
    )
}

export function FolderRow(props:{
    folder: (typeof folders_table.$inferSelect);
}){
    const {folder} = props;
    return(
        <li key={folder.id} className="border-b border-stone-50 px-6 py-4">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                      <Link
                        href={`/f/${folder.id}`}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                      >
                        <FolderIcon className="mr-3" size={20} />
                        {folder.name}
                      </Link>
                  </div>
                  <div className="col-span-2 text-stone-300">
                    {"folder"}
                  </div>
                  <div className="col-span-3 text-stone-300">
                    {/* Empty for folders */}
                  </div>
                  <div className="col-span-1 text-stone-300">
                    {/* Don't allow deletion of special folders */}
                    {folder.name !== "Root" && 
                     folder.name !== "Trash" && 
                     folder.name !== "Shared" && 
                     folder.name !== "Documents" && (
                      <Button 
                        variant="ghost"
                        onClick={() => deleteFolder(folder.id)}
                        aria-label="Delete folder">
                        <Trash2Icon size={20} />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
    )
}