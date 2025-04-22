"use client";

import { ChevronRight, FolderPlusIcon, ShieldCheck, Settings2 } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { createFolder, updatePermissions } from "~/server/actions";
import { toast } from "sonner";

interface Permission {
  userId: string;
  access: 'read' | 'write' | 'admin';
}
interface ListEntry {
  userId: string;
  type: 'blacklist' | 'whitelist';
}

async function handlePermissionsUpdate(
  folderId: number,
  permissions: Permission[],
  lists: ListEntry[]
) {
  try {
    await updatePermissions({ folderId, permissions, lists });
    return { success: true, message: 'Permissions updated successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to update permissions' };
  }
}

// Dummy initial data for test, we can change this to fetch from the server later
const initialPermissions: Permission[] = [
  { userId: "user1@example.com", access: "read" },
  { userId: "user2@example.com", access: "write" },
];
const initialLists: ListEntry[] = [
  { userId: "user3@example.com", type: "blacklist" },
  { userId: "user4@example.com", type: "whitelist" },
];

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  // Permissions dialog state
  const [selectedTab, setSelectedTab] = useState<"users" | "lists">("users");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Local state for permissions and lists (not fetched yet)
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [lists, setLists] = useState<ListEntry[]>(initialLists);

  // For adding new permission
  const [newUserId, setNewUserId] = useState("");
  const [newAccess, setNewAccess] = useState<Permission["access"]>("read");

  // For adding new list entry
  const [newListUserId, setNewListUserId] = useState("");
  const [newListType, setNewListType] = useState<ListEntry["type"]>("blacklist");

  // Fetch permissions/lists when dialog opens
  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch(`/api/folder-permissions?folderId=${props.currentFolderId}`);
        if (!res.ok) throw new Error("Failed to fetch permissions");
        const data = await res.json();
        setPermissions(data.permissions || []);
        setLists(data.lists || []);
      } catch (err) {
        setMessage("Failed to load permissions.");
      }
      setLoading(false);
    }
    if (isPermissionsOpen) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPermissionsOpen, props.currentFolderId]);

  // Save changes to server
  const handleSavePermissions = async () => {
    setLoading(true);
    setMessage(null);
    const result = await handlePermissionsUpdate(props.currentFolderId, permissions, lists);
    setLoading(false);
    setMessage(result.message);
    if (result.success) {
      toast.success("Permissions updated!");
    } else {
      toast.error(result.message);
    }
  };

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
        className="absolute bottom-20 sm:bottom-10 left-1/2 z-0 w-1/3 -translate-x-1/2 transform opacity-10"
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
        <div className="mb-4 flex flex-col-reverse items-start items-center justify-start sm:flex-row sm:items-center sm:justify-between">
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
            <Button
              onClick={() => setIsPermissionsOpen(true)}
              variant="outline"
              className="text-md flex items-center border-none bg-stone-500 !px-3 py-[20px] text-white"
              title="Manage Permissions"
            >
              <ShieldCheck size={16} className="mr-2" />
              Manage Permissions
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
        <DialogContent className="bg-stone-50 text-black rounded-xl shadow-xl sm:max-w-md w-[90%]">
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
              className="text-black bg-stone-200 hover:bg-red-600 hover:text-white sm:mt-0 mt-2"
              onClick={() => setIsCreateFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-stone-500 text-white hover:bg-stone-700"
              onClick={handleCreateFolder}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="bg-stone-50 text-black rounded-xl shadow-xl sm:max-w-2xl w-[98%]">
          <DialogHeader>
            <DialogTitle>
              <Settings2 className="inline mr-2" /> Manage Permissions
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4 py-2">
            <div className="flex flex-row sm:flex-col gap-2 sm:w-40">
              <Button
                variant={selectedTab === "users" ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedTab("users")}
              >
                User Permissions
              </Button>
              <Button
                variant={selectedTab === "lists" ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedTab("lists")}
              >
                Blacklist/Whitelist
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              {selectedTab === "users" && (
                <div>
                  <h3 className="font-semibold mb-2">Grant or revoke user access</h3>
                  <table className="w-full mb-4 text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">User</th>
                        <th className="text-left">Access</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((perm, idx) => (
                        <tr key={perm.userId}>
                          <td>{perm.userId}</td>
                          <td>
                            <select
                              className="border rounded px-1 py-0.5"
                              value={perm.access}
                              onChange={e => {
                                const updated = [...permissions];
                                updated[idx] = { ...perm, access: e.target.value as Permission["access"] };
                                setPermissions(updated);
                              }}
                            >
                              <option value="read">Read</option>
                              <option value="write">Write</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1"
                              onClick={() => setPermissions(permissions.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <Input
                            placeholder="User email"
                            value={newUserId}
                            onChange={e => setNewUserId(e.target.value)}
                            className="text-xs"
                          />
                        </td>
                        <td>
                          <select
                            className="border rounded px-1 py-0.5"
                            value={newAccess}
                            onChange={e => setNewAccess(e.target.value as Permission["access"])}
                          >
                            <option value="read">Read</option>
                            <option value="write">Write</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1"
                            onClick={() => {
                              if (newUserId.trim()) {
                                setPermissions([...permissions, { userId: newUserId, access: newAccess }]);
                                setNewUserId("");
                                setNewAccess("read");
                              }
                            }}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedTab === "lists" && (
                <div>
                  <h3 className="font-semibold mb-2">Blacklist / Whitelist</h3>
                  <table className="w-full mb-4 text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">User</th>
                        <th className="text-left">Type</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lists.map((entry, idx) => (
                        <tr key={entry.userId + entry.type}>
                          <td>{entry.userId}</td>
                          <td>
                            <select
                              className="border rounded px-1 py-0.5"
                              value={entry.type}
                              onChange={e => {
                                const updated = [...lists];
                                updated[idx] = { ...entry, type: e.target.value as ListEntry["type"] };
                                setLists(updated);
                              }}
                            >
                              <option value="blacklist">Blacklist</option>
                              <option value="whitelist">Whitelist</option>
                            </select>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1"
                              onClick={() => setLists(lists.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <Input
                            placeholder="User email"
                            value={newListUserId}
                            onChange={e => setNewListUserId(e.target.value)}
                            className="text-xs"
                          />
                        </td>
                        <td>
                          <select
                            className="border rounded px-1 py-0.5"
                            value={newListType}
                            onChange={e => setNewListType(e.target.value as ListEntry["type"])}
                          >
                            <option value="blacklist">Blacklist</option>
                            <option value="whitelist">Whitelist</option>
                          </select>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1"
                            onClick={() => {
                              if (newListUserId.trim()) {
                                setLists([...lists, { userId: newListUserId, type: newListType }]);
                                setNewListUserId("");
                                setNewListType("blacklist");
                              }
                            }}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {message && (
                <div className="mt-2 text-center text-green-600">{message}</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-black bg-stone-200 hover:bg-red-600 hover:text-white"
              onClick={() => setIsPermissionsOpen(false)}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              className="bg-stone-500 text-white hover:bg-stone-700"
              onClick={handleSavePermissions}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
