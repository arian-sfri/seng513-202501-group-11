import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
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
                  <div className="col-span-3 text-stone-300">
                    {"file"}
                  </div>
                  <div className="col-span-3 text-stone-300">
                    {file.size}
                  </div>
                </div>
              </li>
    )
}

export function FolderRow(props:{
    folder : (typeof folders_table.$inferSelect);
     handleFolderClick:()=> void;
}){
    const {folder} = props;
    return(
        <li key={folder.id} className="border-b border-stone-50 px-6 py-4">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                      <Link
                        href={`/main/f/${folder.id}`}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                      >
                        <FolderIcon className="mr-3" size={20} />
                        {folder.name}
                      </Link>
                  </div>
                  <div className="col-span-3 text-stone-300">
                  </div>
                  <div className="col-span-3 text-stone-300">
                  </div>
                </div>
              </li>
    )
}