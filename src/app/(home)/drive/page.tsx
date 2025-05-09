import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage () {

    const session = await auth();

    if(!session.userId){
        return redirect("/");
    }

    const rootFolder = await QUERIES.getRootFolderForUser(session.userId);
    if (!rootFolder){
        return  <form action={async ()=>{
            "use server";
            const session = await auth();

            if(!session.userId){
                return redirect("/");
            }


            const rootFolderId = await MUTATIONS.onboardUser(session.userId);
            return redirect(`/f/${rootFolderId}`);
        }}
        >
            <Button
          type="submit"
          className="rounded-md bg-stone-50 px-8 py-3 text-lg font-semibold text-stone-700 transition hover:bg-stone-500 hover:text-white"
          size="lg" 
          >
            Create New Drive
          </Button>

                </form>
    }

    return redirect(`/f/${rootFolder.id}`);
}