"use client";

import { ChevronRight, FolderPlusIcon } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createFolder } from "~/server/actions"; // You'll need to create this action

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    await createFolder({
      name: folderName,
      parentId: props.currentFolderId,
      userId: "", // This will be populated in the server action
    });

    setFolderName("");
    setIsCreateFolderOpen(false);
    navigate.refresh();
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute bottom-10 left-1/2 z-0 w-1/3 -translate-x-1/2 transform opacity-10"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-auto w-10" />
            <h1 className="text-Black text-xl font-medium">Cloudsync</h1>
          </div>
          <header className="flex h-10 items-center justify-end gap-4 p-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
        </div>
        <div className="mb-4 flex flex-col-reverse items-start justify-start sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex min-w-max whitespace-nowrap">
              <span className="mr-2 text-lg text-black">My Drive</span>
              {props.parents.map((folder, index) => (
                <div key={folder.id} className="flex items-center">
                  <ChevronRight className="mx-2 text-stone-500" size={16} />
                  <Link
                    href={`/f/${folder.id}`}
                    className="text-lg text-black hover:text-stone-400"
                  >
                    {folder.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-2 flex flex-row justify-between gap-2 sm:mb-0">
            <Button
              onClick={() => setIsCreateFolderOpen(true)}
              variant="outline"
              className="text-md flex items-center border-none bg-stone-400 !px-3 py-[20px] text-white"
            >
              <FolderPlusIcon size={16} />
              New Folder
            </Button>
            <UploadButton
              endpoint="driveUploader"
              onClientUploadComplete={() => navigate.refresh()}
              input={{ folderId: props.currentFolderId }}
            />
          </div>
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

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFolderName(e.target.value)
              }
              placeholder="Enter folder name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
