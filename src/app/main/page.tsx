"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mockFiles, mockFolders } from "../../lib/mock-data";
import { Folder, FileIcon, Upload, ChevronRight} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from 'next/image';
import { FileRow, FolderRow } from "./file-row";

export default function GoogleDriveClone() {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string>("root");

  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder);
  };

  const getCurrentFolders = () => {
    return mockFolders.filter((folder)=> folder.parent === currentFolder)
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = [];
    let currentId = currentFolder;

    while (currentId !=="root") {
      const folder = mockFolders.find((file) => file.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parent ?? "root";
      } else {
        break;
      }
    }

    return breadcrumbs;
  }, [currentFolder]);

  const handleUpload = () => {
    alert("Upload functionality would be implemented here");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-1/3 opacity-10 z-0"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-auto w-10" />
            <h1 className="text-Black text-xl font-medium">Cloudsync</h1>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => setCurrentFolder("root")}
              variant="ghost"
              className="mr-2 text-lg text-black hover:bg-stone-400 hover:text-white"
            >
              My Drive
            </Button>
            {breadcrumbs.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-stone-500" size={16} />
                <Button
                  onClick={() => handleFolderClick(folder.id)}
                  variant="ghost"
                  className="text-lg text-black hover:bg-stone-400 hover:text-white"
                >
                  {folder.name}
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            className="bg-stone-400 text-white hover:bg-stone-700"
          >
            <Upload className="mr-2" size={20} />
            Upload
          </Button>
        </div>
        <div className="rounded-lg bg-stone-400 shadow-xl">
          <div className="border-b border-stone-50 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-stone-300">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
          {getCurrentFolders().map((folder) => (
              <FolderRow 
                key={folder.id} 
                folder={folder} 
                handleFolderClick={() => {
                  handleFolderClick(folder.id);
                }
              } />
            ))}
            {getCurrentFiles().map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
