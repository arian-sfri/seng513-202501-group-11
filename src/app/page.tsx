import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-500 text-white">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="pointer-events-none absolute z-0 items-center opacity-10 sm:w-2/4"
      />
      <div className="z-10 flex flex-col items-center">
        <h1 className="mb-6 text-center text-5xl font-bold">
          Welcome to CloudSync
        </h1>
        <p className="mb-6 text-lg">Your personal cloud storage solution</p>
        <div className="mb-6 flex space-x-8">
            <SignInButton forceRedirectUrl={"/drive"}>
              <Button
                type="submit"
                className="rounded-md bg-stone-50 px-8 py-3 text-lg font-semibold text-stone-700 transition hover:bg-stone-500 hover:text-white"
                size="lg"
              >
                Get Started
              </Button>
            </SignInButton>
        </div>
      </div>
    </main>
  );
}
