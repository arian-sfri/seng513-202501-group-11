import { Folder as FolderIcon, FileIcon } from "lucide-react";
import type { File, Folder } from "~/lib/mock-data"

export function FileRow(props: {file: File}){
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
    folder : Folder;
     handleFolderClick:()=> void;
}){
    const {folder, handleFolderClick} = props;
    return(
        <li key={folder.id} className="border-b border-stone-50 px-6 py-4">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                      <button
                        onClick={() => handleFolderClick()}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                      >
                        <FolderIcon className="mr-3" size={20} />
                        {folder.name}
                      </button>
                  </div>
                  <div className="col-span-3 text-stone-300">
                  </div>
                  <div className="col-span-3 text-stone-300">
                  </div>
                </div>
              </li>
    )
}