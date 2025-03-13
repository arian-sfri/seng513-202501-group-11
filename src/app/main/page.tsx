"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { File, mockFiles } from "../../lib/mock-data";
import { Folder, FileIcon, Upload, ChevronRight, Router } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function GoogleDriveClone() {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder);
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentId = currentFolder;

    while (currentId !== null) {
      const folder = mockFiles.find((file) => file.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parent;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

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
              onClick={() => setCurrentFolder(null)}
              variant="ghost"
              className="mr-2 text-lg text-black hover:bg-stone-400 hover:text-white"
            >
              My Drive
            </Button>
            {getBreadcrumbs().map((folder, index) => (
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
            {getCurrentFiles().map((file) => (
              <li key={file.id} className="border-b border-stone-50 px-6 py-4">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-6 flex items-center">
                    {file.type === "folder" ? (
                      <button
                        onClick={() => handleFolderClick(file.id)}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                      >
                        <Folder className="mr-3" size={20} />
                        {file.name}
                      </button>
                    ) : (
                      <Link
                        href={file.url || "#"}
                        className="flex items-center text-gray-100 hover:text-stone-700"
                      >
                        <FileIcon className="mr-3" size={20} />
                        {file.name}
                      </Link>
                    )}
                  </div>
                  <div className="col-span-3 text-stone-300">
                    {file.type === "folder" ? "Folder" : "File"}
                  </div>
                  <div className="col-span-3 text-stone-300">
                    {file.type === "folder" ? "--" : "2 MB"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
