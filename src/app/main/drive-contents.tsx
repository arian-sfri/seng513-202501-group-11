"use client";

import { useRouter } from "next/navigation";
import {Upload, ChevronRight} from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from 'next/image';
import { FileRow, FolderRow } from "./file-row";
import type { files, folders } from "~/server/db/schema"
import Link from "next/link";

export default function DriveContents(props: {
  files: (typeof files.$inferSelect)[];
  folders: (typeof folders.$inferSelect)[];
  parents: (typeof folders.$inferSelect)[];
}) {
  const router = useRouter();

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
            <Link
              href="/main/f/1"
              className="mr-2 text-lg text-black hover:bg-stone-400 hover:text-white"
            >
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-stone-500" size={16} />
                <Link
                  href={`/main/f/${folder.id}`}
                  className="text-lg text-black hover:bg-stone-400 hover:text-white"
                >
                  {folder.name}
                </Link>
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
          {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
