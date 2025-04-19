"use client";

import {ChevronRight} from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";


export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;

}) {

  const navigate = useRouter();

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
          <header className="flex justify-end items-center p-4 gap-4 h-16">
          <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </header>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-lg text-black">
              My Drive
            </span>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-stone-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-lg text-black hover:bg-stone-400 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <UploadButton endpoint="driveUploader" onClientUploadComplete={()=> navigate.refresh()}
          input={{folderId: props.currentFolderId,}}
          />
        </div>
        <div className="rounded-lg bg-stone-400 shadow-xl">
          <div className="border-b border-stone-50 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-stone-300">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
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
