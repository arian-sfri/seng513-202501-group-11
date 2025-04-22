import { NextRequest, NextResponse } from "next/server";
import { getFolderPermissions } from "~/server/actions"; // You must implement this

export async function GET(req: NextRequest) {
  const folderId = Number(req.nextUrl.searchParams.get("folderId"));
  if (!folderId) {
    return NextResponse.json({ error: "Missing folderId" }, { status: 400 });
  }
  try {
    // Should return { permissions: Permission[], lists: ListEntry[] }
    const data = await getFolderPermissions(folderId);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}